const { userAuth } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { statusCode } = require("../global");
const { sendMail } = require('../utils')

const [success, notFound] = [statusCode.OK, statusCode.NOT_FOUND];

const authController = {
  async create_user(req, res) {
    const newUser = new userAuth({
      username: req.body.username,  
      gmail: req.body.gmail,
      password: req.body.password,
    });

    try {
      const user = await newUser.save();
      sendMail(user.username, user.gmail,user.password)
      return res.status(success.statuscode).json({
        success,
        user,
      });
    } catch (err) {
      return res.send(err);
    }
  },

  async login_user(req, res) {
    const user = await userAuth.findOne({ gmail: req.body.gmail });

    console.log("Cookies", req.cookies);
    res.cookie("gmail", user.gmail);
    if (!user) {
      return res.status(statusCode.NOT_FOUND.statuscode).json({
        notFound,
      });
    }

    // Check if the user's password has been reset (e.g., resetPasswordExpires is not null)
    if (user.resetPasswordExpires) {
      return res.status(401).json({
        type: "failed",
        message:
          "Password has been reset. Please use the new password to login.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY
    );
    user.token = token;
    await user.save();

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);

    if (passwordMatch) {
      return res.status(success.statuscode).json({
        success,
      });
    }
    return res.status(401).json({
      type: "failed",
      message: "Username or password is invalid",
    });
  },

  // logout api
  async logout_user(req, res) {
    if (req.cookies && req.cookies.gmail) {
      console.log("Cookie cleared");
      await res.clearCookie("gmail");
      return res.status(success.statuscode).json({
        success,
      });
    }
    return res.status(201).json({
      type: "success",
      message: "please login first",
      code: "1",
    });
  },
};

module.exports = authController;
