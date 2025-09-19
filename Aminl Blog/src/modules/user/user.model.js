const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    forgetPasswordToken: { type: String },
    forgetPasswordExpiry: {type: Date},
    image:{
      public_id: String,
      url: String,
      secure_url: String
    },
    activationToken: String,
    status: {
      type: String,
      enum: ["active", "inactive"]
    }
  },
  {
    autoCreate: true,
    timestamps: true,
    autoIndex: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
