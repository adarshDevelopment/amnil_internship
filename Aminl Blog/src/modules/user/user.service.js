const BaseServiceClass = require("../../services/base.service");
const emailService = require("../../services/email.service");
const { generateRandomString } = require("../../util/helper");
const UserModel = require("./user.model");


class UserService extends BaseServiceClass {
  getPublicUserData = (data) => {
    return {
      email: data.email,
      name: data.name,
    };
  };


}

module.exports = new UserService(UserModel);
