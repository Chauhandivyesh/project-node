const nodemailer = require("nodemailer");


const sendEmail = async (subject, htmlContent, userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSKEY,
      },
    });

    // Define your email content
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: userEmail, // Use the recipient's email address
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;