const Router = require('express').Router();

Router.get('/', (req, res) => {
  res.render('index');
});

Router.get('/truco', (req, res) => {
  res.render('truco');
});

module.exports = Router;