const authService = require("../modules/auth/auth.service");
const jsonWebtoken = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const userService = require("../modules/user/user.service");

/*
  - fetches the masked access token from the authorization headers
  - fetches the corresponding access token from the auths collection
  - verifies it using jsonwebtoken
  - attaches the user_id from the payload to the request object
*/
const auth = (role) => {
  return async (req, res, next) => {
    try {
      // extract masked access token
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw {
          message: "Authorization header missing or invalid",
          code: 401,
        };
      }

      const token = authHeader.split(" ")[1];

      // fetch access token from the masked token from the auths collection
      const authRow = await authService.fetchSingleRowByFilter({
        maskedAccessToken: token,
      });

      // if token row not found throw exception
      if (!authRow) {
        throw {
          message: "Invalid token. Access token not found",
          code: 401,
        };
      }

      // verify accessToken and automatically throw exception if invalid
      const payload = jsonWebtoken.verify(
        authRow.accessToken,
        AppConfig.jwtSecret
      );

      const user = await userService.fetchSingleRowByFilter({
        _id: payload._id,
      });

      if (!user) {
        throw {
          message: "User doesnt exist",
          code: 422,
        };
      }

      // check if role matches and if role doesnt exist, also grant access
      const stringMatch = user.userType === role;
      const arrayMatch = Array.isArray(role) && role.includes(user.userType);


      if (!(stringMatch || arrayMatch || user.userType === undefined || !role)) {
        throw {
          message: "Unauthorized User",
          code: 422,
        };
      }

      req.loggedInUserId = user._id;
      req.loggedInUser = user;

      // call the next middleware
      next();
    } catch (exception) {
      next(exception);
    }
  };
};

module.exports = auth;
