const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const useMiddleware = (req, res, next) => {
  const { name } = req.query;
  if (name) {
    next();
  } else {
    res.redirect('/');
  }
};

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { name, date } = req.body;

  const years = moment().diff(date, 'years');
  if (years > 18) {
    res.redirect(`/major?name=${name}`);
  } else {
    res.redirect(`/minor?name=${name}`);
  }
});

app.get('/major', useMiddleware, (req, res) => {
  const { name } = req.query;
  res.render('major', { name });
});

app.get('/minor', useMiddleware, (req, res) => {
  const { name } = req.query;
  res.render('minor', { name });
});

app.listen(3000);
