var express = require('express');
var router = express.Router();
var utils = require('utility');
var users = require('../models/users');
var driver = require('../models/driver');
var driver_vhc = require('../models/driver_vhc');


router.requireAuthentication = function(req, res, next) {
    console.log('check login cookies ...', req.cookies.member);

    if (req.path.indexOf("/users/login") >= 0 || req.path.indexOf("/users/reg") >= 0) {
        next();
        return;
    }
    if (req.cookies.member) {
        var member = req.cookies.member;
        req.account = member.account;
        req.isboss = member.isboss;
        next();
    } else {
        req.session.vehicle_group = '';

        var from_url = req.originalUrl;
        if (from_url != "")
            res.redirect('/users/login?url=' + from_url);
        else
            res.redirect('/users/login');
    }
}


router.get('/login', function(req, res, next) {
    var account = '';
    if (req.cookies.userinfo) {
        account = req.cookies.userinfo;
    }
    res.render('login', { account: account });
});

router.get('/logout', function(req, res) {
    req.clearCookie("account");
    res.redirect('/login');
});

router.post('/login', function(req, res, next) {
    var url = req.body.url || '';
    var account = req.body.username;
    var password = utils.md5(req.body.password);
    users.get_info(account, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (!result || result.length == 0) {
            res.send({ ok: 1, msg: "账号错误" });
            return;
        }

        if (password != result[0].password) {
            res.send({ ok: 1, msg: "密码错误" });
            return;
        }

        var userid = result[0].id;
        var boss = result[0].boss;
        var user_type = result[0].user_type;

        //res.clearCookie('member');
        res.cookie('member', { userid: userid, account: account, boss: 0, user_type: user_type }, { maxAge: 3600000, httpOnly: true, path: '/' });
        res.cookie('userinfo', account, { maxAge: 3600000, httpOnly: true, path: '/' });

        res.send({ ok: 0 })
    });
});

router.post('/reg', function(req, res, next) {
    var account = req.body.username,
        password = utils.md5(req.body.password);

    var msg = {
        "-1": "该车牌号不存在",
        "-2": "该车牌号已经被注册",
        "0": "写入数据库失败",
    }

    driver.add(account, password, function(err, result) {
        if (err) {
            console.log(err);
            throw err;
        }

        if (result < 1) {
            res.send({ ok: 1, msg: msg[result] });
            return;
        }

        res.send({ ok: 0, url: '/users/login' });
    });
});

module.exports = router;