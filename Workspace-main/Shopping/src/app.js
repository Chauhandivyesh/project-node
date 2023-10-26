const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require('cors');
// cookie store
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const connectDB = require("../config");
// connect to database
connectDB();

//security purpose 
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// router
const { authRouter, productRouter, userRouter } = require("../routes");

app.use("/api/v1/auth", authRouter);
app.use('/api/v1/product', productRouter)
app.use('/api/v1/user', userRouter)

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
