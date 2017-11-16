var express = require('express');
var date = require('date-utils');
var qr = require('qr-image');
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

router.get('/reg', function(req, res, next) {
    var args = req.query;
    res.render('reg', { userid: args.userid, account: args.account });
});

router.get('/qrcode', function(req, res, next) {
    res.render('qrcode', { title: 'dftd' });
});

router.get('/my_qrcode', function(req, res, next) {
    var member = req.cookies.member;
    var url = '/reg?userid=' + member.userid + '&account=' + member.account;
    var code = qr.image(url, { type: 'png' });
    res.setHeader('Content-type', 'image/png'); //sent qr image to client side
    code.pipe(res);
});

module.exports = router;