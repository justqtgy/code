var express = require('express');
var date = require('date-utils');
var qr = require('qr-image');
var orders = require('../models/orders');
var member_stat = require('../models/member_stat');
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
    var member = req.cookies.member;
    orders.isExists(member.userid, function(err, counts) {
        if (counts > 0) {
            //res.render('pricing', { start_date: start_date, end_date: end_date });
            res.redirect('pricing');
        } else {
            res.render('join');
        }
    });
});

router.get('/pricing', function(req, res, next) {
    var member = req.cookies.member;
    orders.isExists(member.userid, function(err, counts) {
        if (counts > 0) {
            res.render('pricing');
        } else {
            res.redirect('join');
        }
    });
});

router.get('/orders', function(req, res, next) {
    res.render('orders', { title: 'dftd' });
});

router.get('/yeji', function(req, res, next) {
    res.render('yeji', { title: 'dftd' });
});

router.get('/member/reg', function(req, res, next) {
    var args = req.query;
    res.render('reg', { userid: args.userid || 0, account: args.account });
});

router.get('/qrcode', function(req, res, next) {
    res.render('qrcode', { title: 'dftd' });
});

router.get('/my_qrcode', function(req, res, next) {
    var member = req.cookies.member;
    var url = '/member/reg?userid=' + member.userid + '&account=' + member.account;
    var code = qr.image(url, { type: 'png' });
    res.setHeader('Content-type', 'image/png'); //sent qr image to client side
    code.pipe(res);
});

module.exports = router;