const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

// use for express-session
const session = require("express-session");

let corsOption = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allows sending cookies
  optionsSuccessStatus: 204,
};

router.use(cors(corsOption));

router.use(cookieParser());

router.use(
  session({
    secret: process.env.SESSIONKEY,
    data: null,
    isAdmin: null,
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 30000 },
  })
);

// User router
let userLoggedInStatus = false;
let userName = "";
let uEmail = "";

const myLogger = function (req, res, next) {
  SessionData = req.session.data;
  userName = req.cookies.name;
  uEmail = req.cookies.uEmail;
  if (SessionData != undefined) {
    userLoggedInStatus = true;
  } else {
    userLoggedInStatus = false;
  }
  next();
};
router.use(myLogger);

// Admin router
const isAdminMiddleware = function (req, res, next) {
  SessionData = req.session.data;
  userName = req.cookies.username;

  if (req.cookies.isAdmin == "true") {
    userLoggedInStatus = true;
    next();
  } else {
    userLoggedInStatus = false;
    return res.status(401).json("You are not authenticated");
  }
};
// router.use([myLogger, isAdminMiddleware]);
router.use(myLogger);

router.get(["/", "/index"], myLogger, (req, res) => {
  // for fetching the name from cookie usign cookie-parser
  res.render("index", { userLoggedIn: userLoggedInStatus, userName: userName });
});


router.get("/login", myLogger, (req, res) => {
  res.render("login");
});

router.get("/admin", myLogger, isAdminMiddleware, (req, res) => {
  res.send("Admin is connected");
});

router.post("/login", async (req, res) => {
  const findData = await User.findOne({
    gmail: req.body.uEmail,
  });

  if (findData) {
    const validPassword = await bcrypt.compare(
      req.body.uPassword,
      findData.password
    );

    if (validPassword) {
      try {
        token = jwt.sign(
          { userId: findData._id, email: findData.gmail },
          process.env.SESSIONKEY,
          { expiresIn: "1h" }
        );
        findData.token = token;
        req.session.data = token;
        console.log("session data: ", req.session.data);
        await findData.save();
      } catch (err) {
        console.log("Error catch", err);

        return res.send({ Message: "Error! Something went wrong.", Code: "0" });
      }
      // to store data in cookie
      res.cookie("email", findData.gmail);
      res.cookie("name", findData.name);
      // toastr.success('Have fun storming the castle!', 'Miracle Max Says')

      if (findData.role == "admin") {
        res.cookie("isAdmin", "true");
        req.session.isAdmin = true;
      } else {
        res.cookie("isAdmin", "false");
        req.session.isAdmin = false;
      }

      return res.send({
        Message: "Success",
        Code: "1",
        Data: {
          token: token,
          isAdmin: req.session.isAdmin,
        },
      });
    } else {
      console.log("Invalid userName or password");
      return res.send({ Message: "Invalid userName or password", Code: "0" });
    }
  } else {
    console.log("User not found");
    return res.send({ Message: "User not found", Code: "0" });
  }
});

router.get("/logout", myLogger, async (req, res) => {
  res.clearCookie("email");
  res.clearCookie("name");

  req.session.destroy();
  // res.redirect("login");
  return res.send({ Message: "Success", Code: "0" });
});

router.post("/getalluser", async (req, res) => {
  res.send(req.headers.header_api);
  console.log(JSON.stringify(req.headers.header_api));
  res.end();
});

router.post("/register", async (req, res) => {
  const saltRounds = await bcrypt.genSalt(10);
  const hasPassword = await bcrypt.hash(req.body.uPassword, saltRounds);

  if (req.body.uPassword === req.body.cPassword) {
    const UserData = new User({
      name: req.body.uName,
      gmail: req.body.uEmail,
      password: hasPassword,
    });
    const result = await UserData.save();
    console.log(result);
    res.redirect("login");
  } else {
    console.log('Oops Password doesn"t match');
    res.render("404");
  }
});

router.get("/editpage", async (req, res) => {
  const email = req.cookies.email;
  const user = await User.findOne({ gmail: email });
  // console.log("user data for edit",user);
  res.render("editpage", { userdata: user });
});

router.post("/editpage", myLogger, async (req, res) => {
  const email = req.cookies.email;
  const findData = await User.findOne({ gmail: email });

  try {
    if (findData) {
      console.log("inside if user");
      console.log(findData);
      const token = findData.token;

      const updateUserFields = {
        lastname: req.body.uLastname,
        phonenumber: req.body.uPhone,
        address: req.body.uAddress,
        city: req.body.uCity,
        codePostal: req.body.uCode,
        token: token
      };

      if (req.body.uPassword && req.body.uPassword !== req.body.cPassword) {
        return res.send({
          message: "Password and Confirm Password must be the same",
          code: "0",
        });
      }

      if (req.body.uPassword !== "") {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          req.body.uPassword,
          saltRounds
        );
        updateUserFields.password = hashedPassword;
      }

      const updateUser = await User.updateOne(
        { _id: findData._id }, 
        { $set: updateUserFields } 
      );

      return res.status(200).send({
        message: "Profile updated successfully",
        data: "1",
        code: "1",
        updateUser,
      });
    } else {
      console.log("User not found");
      return res.status(404).send({
        message: "User not found",
        code: "0",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An error occurred",
      code: "0",
    });
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/news", (req, res) => {
  res.render("news");
});

router.get("/single-news", (req, res) => {
  res.render("single-news");
});

router.get("/contact", (req, res) => {
  console.log("contact");
  res.render("contact");
});

router.get("/shop", (req, res) => {
  res.render("shop");
});

router.get("/checkout", (req, res) => {
  res.render("checkout");
});

router.get("/cart", (Req, res) => {
  res.render("cart");
});

router.get("/single-product", (req, res) => {
  res.render("single-product");
});

router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
