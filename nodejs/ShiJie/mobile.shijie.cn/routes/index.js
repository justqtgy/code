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

router.get('/join', function(req, res, next) {
    res.render('join', { title: 'dftd' });
});

router.get('/pricing', function(req, res, next) {
    res.render('pricing', { title: 'dftd' });
});

router.get('/orders', function(req, res, next) {
    res.render('orders', { title: 'dftd' });
});

router.get('/yeji', function(req, res, next) {
    res.render('yeji', { title: 'dftd' });
});

router.get('/invite', function(req, res, next) {
    var member = req.cookies.member;
    res.send('invite', { member : member });
});

module.exports = router;