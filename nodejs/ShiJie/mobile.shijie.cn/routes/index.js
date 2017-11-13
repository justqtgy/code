var express = require('express');
var date = require('date-utils');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var member = req.cookies.member;
    if (member) {
        res.render('index');
    } else {
        res.render('/users/login');
    }
});

router.get('/password', function(req, res, next) {
    res.render('password');
});

router.get('/group', function(req, res, next) {
    res.render('control/_group', { title: 'dftd' });
});

router.get('/oil_ticket', function(req, res, next) {
    res.send('开发中....');
});

module.exports = router;