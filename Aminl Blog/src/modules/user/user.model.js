const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    forgetPasswordToken: { type: String },
    forgetPasswordExpiry: {type: Date}
  },
  {
    autoCreate: true,
    timestamps: true,
    autoIndex: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
