const { userAuth } = require("../models");
const { statusCode } = require("../global");
const { sendEmail } = require("../utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  OK: success,
  NOT_FOUND: notFound,
  BAD_REQUEST: badRequest,
  INTERNAL_SERVER_ERROR: internal,
} = statusCode;

// Function to generate a random token
const generateRandomToken = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

// Generate a random 4-digit number
const generateRandom4DigitNumber = () =>
  Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

const userController = {
    async forgot_password(req, res) {
        const { gmail } = req.body;
        const newOtp = generateRandom4DigitNumber();
      
        try {
          // Find the user by their Gmail address
          const user = await userAuth.findOne({ gmail });
      
          if (!user) {
            return res.status(notFound.statuscode).json({
              notFound,
            });
          }
      
          // Generate a random reset token and expiration date
          const resetToken = generateRandomToken(32);
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 1);
      
          // Update the user's document with the new OTP, reset token, and expiration date
          user.otp = newOtp;
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = expirationDate;
          
          // Construct the reset password link
          const resetPasswordLink = `https://localhost:3000/reset-password?token=${resetToken}`;
      
          // Create the HTML content for the reset password email
          const resetPasswordHTML = `
            <p>Hello ${user.username},</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p>
          `;
      
          // Send the reset password email
          sendEmail('Forgot Password', resetPasswordHTML, user.gmail);
      
          // Save changes to the user document
          await user.save();
      
          return res.status(success.statuscode).json({
            success,
            user,
          });
        } catch (err) {
          return res.status(internal.statuscode).json({
            internal,
          });
        }
    },
      
  async reset_password(req, res) {
    console.log("reset password called");
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;
      const user = await userAuth.findOne({ email });
      console.log("reset", user);

      if (!user) {
        return res.status(notFound.statuscode).json({ notFound });
      }

    //   if(user.otp !== otp) {
    //     return res.status(badRequest.statuscode).json({ badRequest });
    //   }

    //   if(newPassword !== confirmPassword) {
    //     return res.status(badRequest.statuscode).json({ badRequest });
    //   }

      // Check if the reset token is valid and not expired
      if (user.resetPasswordExpires < Date.now()) {
        return res
          .status(406)
          .json({ message: "Invalid or expired reset token" });
      }

      // Hash the new password using bcrypt
      const hashedPassword = bcrypt.hashSync(newPassword, 10); // 10 is the number of salt rounds

      // Update user's password and clear the token
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.otp = null;

      // Save changes to the user document
      await user.save();

    // newResetPasswordMail(user.username, user.gmail);
      res.status(200).json({ message: "Password reset successful" });

      // Optionally, you can send a confirmation email to the user here.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;
