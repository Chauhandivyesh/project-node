const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const userRouter = require('../router/userRouter');
const bodyParser = require('body-parser');
const connectDB = require('../database/index');
require('dotenv').config();

const port = process.env.PORT;

// mongodb connection
connectDB();

app.set('view engine', 'hbs');
app.set('views', path.join('templates', 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join('public', 'assets')));

// Register partials with Handlebars
const partialsPath = path.join('templates', 'views', 'partials');
hbs.registerPartials(partialsPath);

// to register json helper
hbs.registerHelper('json', function(obj) {
  return JSON.stringify(obj, null, 3);
});

// router file initialize
app.use('/', userRouter);
// app.get("*", (req, res) => {
//   res.render("404");
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
