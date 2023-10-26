const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userAuth = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gmail: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    token: {
      type: String,
    },
    otp: {
      type: Number
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

userAuth.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = bcrypt.hashSync(this.password,10)
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", userAuth);
