const BaseServiceController = require("../../services/base.service");
const userService = require("../user/user.service");
const authService = require("./auth.service");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { AppConfig } = require("../../config/config");
const { generateRandomString } = require("../../util/helper");
const blogService = require("../blog/blog.service");
const cloudinaryService = require("../../services/cloudinary.service");
const emailService = require("../../services/email.service");
const { UserType, UserStatus } = require("../../util/constants");
const { options } = require("joi");

class AuthController {
  register = async (req, res, next) => {
    try {
      // hash password and check for duplicate emails before inserting
      const data = await authService.transformRegisterData(req);

      const user = await authService.createUser(data);
      const activationToken = generateRandomString(150);

      await authService.sendActivationEmail(user, activationToken);
      user.activationToken = activationToken;
      user.save();

      res.status(201).json({
        message: "User successfully registered",
        data: userService.getPublicUserData(user),
        options: null,
        status: "Success",
      });
    } catch (exception) {
      console.log("exception: ", exception);
      // all exceptions get sent to the final middleware from where necessary details get sent back to the user
      next(exception);
    }
  };

  login = async (req, res, next) => {
    try {
      // validate login credentials & password verification
      const data = req.body;
      const user = await userService.fetchSingleRowByFilter({
        email: data.email,
      });

      // throw exception and return failure message if user is not found
      if (!user) {
        throw {
          message: "Invalid credentials",
          detail: { password: "Invalid credentials" },
          code: 401,
        };
      }
      // throw the same message if passwords dont match
      if (!bcrypt.compareSync(data.password, user.password)) {
        throw {
          message: "Invalid credentials",
          detail: { password: "Invalid credentials" },
          code: 401,
        };
      }
      // generate access token
      const accessToken = jsonwebtoken.sign(
        { type: "access", _id: user._id, email: user.email },
        AppConfig.jwtSecret,
        { expiresIn: "1h" }
      );

      // generate random strings for access token
      const maskedAccessToken = generateRandomString();
      // store all the tokens in one record with the userId
      const loggedInUser = await authService.createSingleRow({
        user: user._id,
        accessToken,
        maskedAccessToken: maskedAccessToken,
      });

      res.status(201).json({
        message: "User successfully logged in",
        data: {
          accessToken: loggedInUser.maskedAccessToken,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  showOwnProfile = async (req, res, next) => {
    try {
      const user = req.loggedInUser;
      res.json({
        message: "User successfully fetched",
        status: "Success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          status: user.status,
          image: user.image.secure_url,
        },
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getProfileBlogs = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await userService.fetchSingleRowByFilter({ _id: userId });
      if (!user) {
        throw {
          message: "User not found",
          code: 404,
        };
      }

      const yourBlogs = await blogService.fetchMultipleRowsByFilter({
        user: userId,
      });
      res.json({
        message: "Your blogs successfully fetched",
        status: "success",
        data: yourBlogs,
        options: { user },
      });
    } catch (exception) {
      next(exception);
    }
  };

  updateOwnProfile = async (req, res, next) => {
    try {
      const data = req.body;
      console.log('data: ', data );

      
      
      if (req.file) {
        const image = await cloudinaryService.uploadFile(
          req.file.path,
          "/UserProfiles/"
        );
        data["image"] = image;
      }else{
        data['image'] = req.loggedInUser.image
      }

      const updatedProfile = await userService.updateSingleRowByFilter(
        { _id: data._id },
        data
      );

      res.json({
        message: "Profile successfully updated",
        status: "success",
        data: {
          _id: updatedProfile._id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          userType: updatedProfile.userType,
          status: updatedProfile.status,
          image: updatedProfile.image.secure_url,
        },
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  forgetPassword = async (req, res, next) => {
    try {
      // fetch user detail from user model
      const email = req.body.email;
      // send appropriate message
      const user = await userService.fetchSingleRowByFilter({ email });
      if (!user) {
        throw {
          message: "User not found. Invalid Email",
          code: 404,
        };
      }

      // generate and update token and send mail
      await authService.sendPasswordResetEmail(user);

      res.json({
        message: "Password reset link sent",
        data: null,
        status: "Success",
        options: null,
      });

      // send the token in an email to the user
    } catch (exception) {
      next(exception);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { password } = req.body;
      const token = req.params.token;
      console.log("token: ", token);
      // fetch user detail
      const userDetail = await userService.fetchSingleRowByFilter({
        forgetPasswordToken: token,
      });
      if (!userDetail) {
        throw {
          message: "Invalid Token",
          code: 422,
        };
      }
      const duplciatePassword = bcrypt.compareSync(
        password,
        userDetail.password
      );

      if (duplciatePassword) {
        throw {
          message: "You cannot set your old password as your password",
          detail: {
            password: "You cannot set your old password as your password",
          },
          code: 422,
        };
      }

      const newPassword = bcrypt.hashSync(password, 12);

      userDetail.password = newPassword;
      await userDetail.save();
      res.json({
        message: "Password successfully changed",
        status: "Success",
        data: null,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  authenticateResetToken = async (req, res, next) => {
    try {
      const token = req.params.token;
      const user = await userService.fetchSingleRowByFilter({
        forgetPasswordToken: token,
      });
      if (!user) {
        throw {
          message: "Invalid Token",
          code: 422,
        };
      }

      res.json({
        data: {
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
        options: null,
        message: "Token authenticated",
        status: "Success",
      });
    } catch (exception) {
      next(exception);
    }
  };

  activateUser = async (req, res, next) => {
    try {
      const token = req.params.token;
      console.log("token: ", token);
      const user = await userService.fetchSingleRowByFilter({
        activationToken: token,
      });

      console.log("user: ", user);
      if (!user) {
        throw {
          message: "Invalid Token",
          status: "INVALID_TOKEN",
          code: 401,
        };
      }
      if (user.status === UserStatus.active) {
        res.json({
          message: "User already activated!",
          status: "Success",
          data: null,
          options: null,
        });
      }
      const updatedUser = await userService.updateSingleRowByFilter(
        {
          _id: user._id,
        },
        {
          activationToken: "",
          status: UserStatus.active,
        }
      );

      res.json({
        message: "User successfully activated",
        status: "Success",
        data: updatedUser,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  sendVerificationEmail = async (req, res, next) => {
    try {
      const user = req.loggedInUser;
      console.log("user: ", user);
      if (user.status === UserStatus.active) {
        res.json({
          message: "User is already activated",
          status: "USER_ALREADY_ACTIVATED",
          data: null,
          options: null,
        });
      }
      const token = generateRandomString(150);
      user.activationToken = token;
      await user.save();
      await authService.sendActivationEmail(user, token);
      res.json({
        message: "Verification Email sent",
        status: "SCUCESS",
        data: null,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new AuthController();
