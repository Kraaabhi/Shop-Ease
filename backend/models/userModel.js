const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your Name"],
    maxLength: [30, "name can not exceed 30 character"],
    minLength: [4, "name can not be less than 4 character"],
  },
  email: {
    type: String,
    required: [true, "please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "please enter your Password"],
    minLength: [8, "password can not be less than 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

userSchema.pre("save", async function (next) {
    // This code is part of a Mongoose (a MongoDB Object-Modeling tool) schema and it defines a middleware
    //  function that runs before the "save" event.
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//JWT Token

userSchema.methods.getJWTToken = function () {
    // This code generates a JWT that contains the id of the user 
    // and expires after the time specified in process.env.JWT_EXPIRE.
    //  The JWT can be used to identify the user in subsequent requests and to ensure 
    // that the token was not tampered with while being transmitted.
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating  Password reset token
userSchema.methods.getResetPasswordToken = async function () {
  //generating random string of length 20 which will be token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hashing and adding to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire=Date.now()+15*60*1000;
  return resetToken;
};

module.exports = mongoose.model("user", userSchema);
