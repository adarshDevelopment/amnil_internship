const BaseServiceController = require("../../services/base.service");
const userService = require("../user/user.service");
const AuthModel = require("./auth.model");
const bcrypt = require("bcrypt");
const UserModel = require("../user/user.model");
const { UserType, UserStatus } = require("../../util/constants");
const { generateRandomString } = require("../../util/helper");
const { FrontendUrl } = require("../../config/config");
const emailService = require("../../services/email.service");

class AuthService extends BaseServiceController {
  transformRegisterData = async (req) => {
    try {
      const data = req.body;
      const user = await userService.fetchSingleRowByFilter({
        email: data.email,
      });
      // check for duplicate error
      if (user) {
        throw {
          detail: { email: "Email already exists" },
          code: 409,
        };
      }
      // hash password
      const hashedPassword = bcrypt.hashSync(data.password, 12);
      const userType = data.isAdmin ? UserType.admin : UserType.user;
      return {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        userType,
        status: UserStatus.inactive
      };
    } catch (exception) {
      console.log("exception from auth service");
      throw exception;
    }
  };

  createUser = async (data) => {
    // try catch block to find specific exceptions
    try {
      return await UserModel.create(data);
    } catch (exception) {
      throw exception;
    }
  };

  fetchLoggedInUser = async (filter) => {
    return await userService.fetchSingleRowByFilter(filter);
  };

  sendPasswordResetEmail = async (user) => {
    // generate tokens
    const forgetPasswordToken = generateRandomString(150);
    const forgetPasswordExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // update user record
    await userService.udpateSingleRowByFilter(
      { _id: user._id },
      {
        forgetPasswordExpiry,
        forgetPasswordToken,
      }
    );

    const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #007BFF;">Reset Your Password</h2>
    <p>We received a request to reset your password.</p>

    <p>
      <a 
        href="${FrontendUrl}/reset-password/${forgetPasswordToken}" 
        style="
          display: inline-block;
          background-color: #007BFF;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;"
      >
        Reset Password
      </a>
    </p>

    <p>If the button doesn't work, copy and paste this link in your browser:</p>
    <p style="word-break: break-all;">
      <a href="${FrontendUrl}/reset-password/${forgetPasswordToken}" " style="color: #007BFF;">
       ${FrontendUrl}/reset-password/${forgetPasswordToken}
      </a>
    </p>

    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p style="margin-top: 20px; font-size: 12px; color: #888;">This link will expire in 30 minutes.</p>
  </div>
`;
    await emailService.sendMail({
      to: user.email,
      subject: "Password Reset email",
      html,
    });
  };

  sendActivationEmail = async (user, token) => {
    const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Welcome!</h2>
            <p style="font-size: 16px; color: #555;">
              This is your email activation link. Please click the button below to activate your account:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${FrontendUrl}/user-activation/${token}" 
                style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Activate Account
              </a>
            </div>

            <p style="font-size: 14px; color: #777;">
              If the button above doesn’t work, copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #007BFF; word-break: break-all;">
              ${FrontendUrl}/user-activation/${token}
            </p>

            <p style="font-size: 14px; color: #aaa;">Thanks,<br/>The Team</p>
          </div>
        `;

    await emailService.sendMail({
      to: user.email,
      subject: "User activation email",
      html: html,
    });
  };
}

module.exports = new AuthService(AuthModel);
