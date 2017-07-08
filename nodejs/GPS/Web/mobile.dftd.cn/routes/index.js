var express = require('express');
var date = require('date-utils');
var router = express.Router();
var driver_vehicle = require('../models/driver_vehicle');

/* GET home page. */
router.get('/', function(req, res, next) {
    var member = req.cookies.member;
    if (member) {
        if (member.isBoss) {
            res.render('boss');
        } else {
            res.render('driver');
        }
    } else {
        res.render('/users/login');
    }
});

router.get('/boss', function(req, res, next) {
    res.render('boss');
});

router.get('/driver', function(req, res, next) {
    res.render('driver');
});

router.get('/m_b_index', function(req, res, next) {
    res.render('boss');
});

router.get('/m_d_index', function(req, res, next) {
    res.render('driver');
});


router.get('/fuel_up', function(req, res, next) {
    var today = new Date().toFormat('YYYY-MM-DD');
    var member = req.cookies.member;
    driver_vehicle.get_list(member.userid, function(err, rows) {
        console.log(rows)
        res.render('fuel_up', {
            today: today,
            vehicles: rows
        });
    });
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

router.get('/cost_check', function(req, res, next) {
    res.send('开发中....');
});

module.exports = router;