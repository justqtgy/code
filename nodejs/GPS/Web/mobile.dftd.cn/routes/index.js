var express = require('express');
var router = express.Router();
var users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/boss', function(req, res, next) {
  res.render('boss/index');
});

router.get('/driver', function(req, res, next) {
  res.render('driver/index');
});

router.get('/group', function(req, res, next) {
  res.render('control/_group', { title: 'dftd' });
});

module.exports = router;
