const BaseServiceController = require("../../services/base.service");
const userService = require("../user/user.service");
const authService = require("./auth.service");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { AppConfig } = require("../../config/config");
const { generateRandomString } = require("../../util/helper");
const blogService = require("../blog/blog.service");

class AuthController {
  register = async (req, res, next) => {
    try {
      // hash password and check for duplicate emails before inserting
      const data = await authService.transformRegisterData(req);
      const response = await authService.createUser(data);
    

      res.status(201).json({
        message: "User successfully registered",
        data: userService.getPublicUserData(response),
        options: null,
        status: "Success",
      });
    } catch (exception) {
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
      const user = await authService.fetchLoggedInUser({
        _id: req.loggedInUserId,
      });

      res.json({
        message: "User successfully fetched",
        status: "Success",
        data: {
          user: { id: user.id, name: user.name, email: user.email },
        },
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getProfileBlogs = async(req, res, next)=>{
     try {
          console.log('req user: ',  req.loggedInUserId)
          const yourBlogs = await blogService.fetchMultipleRowsByFilter({user: req.loggedInUserId});
          console.log('yourBLogs: ', yourBlogs);
          res.json({
            message: "Your blogs successfully fetched",
            status: "success",
            data: yourBlogs,
            options: null,
          });
        } catch (exception) {
          next(exception);
        }
  }
}

module.exports = new AuthController();
