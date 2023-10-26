const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || '3000';
const partials = path.join(__dirname, '/views/partials');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
hbs.registerPartials(partials);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
