var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/boss', function(req, res, next) {
    res.render('boss');
});

router.get('/driver', function(req, res, next) {
    res.render('driver');
});

router.get('/group', function(req, res, next) {
    res.render('control/_group', { title: 'dftd' });
});

module.exports = router;