const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
    },
    phonenumber: {
      type: String,
      match: [
        /^\d{10}$/,
        'Invalid phone number format'
      ]
    },
    address: {
      type: String,
      max: [10, "please enter full address"],
    },
    city: {
      type: String,
    },
    codePostal: {
      type: Number,
    },
    gmail: {
      type: String,
      require: true,
      unique: true,
      min: [3, "please enter more than 3 letter"],
      max: [30, "please enter valid email"],
      match: [
        /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      require: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/,
        'Minimum four characters, at least one letter and one number'],
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
