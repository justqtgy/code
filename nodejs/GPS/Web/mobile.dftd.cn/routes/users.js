var express = require('express');
var router = express.Router();
var utils = require('utility');
var date = require('date-utils');
var users = require('../models/member');

router.requireAuthentication = function(req, res, next) {
    console.log('check login cookies ...', req.cookies.member);

    if (req.path.indexOf("/users/login") >= 0 || req.path.indexOf("/users/reg") >= 0) {
        next();
        return;
    }
    if (req.cookies.member) {
        var member = req.cookies.member;
        next();
    } else {
        //req.session.vehicle_group = '';
        res.redirect('/users/login');
    }
};

router.get('/login', function(req, res, next) {
    var member = req.cookies.member,
        account = '';
    if (member) {
        account = member.account;
    }
    res.render('login', { account: account });
});

router.get('/logout', function(req, res) {
    console.log('logout.....');
    res.clearCookie("member");
    res.redirect('/users/login');
});

router.post('/login', function(req, res, next) {
    console.log(req.body)
    var account = req.body.account,
        password = req.body.password;
    password = utils.md5(account + '&' + password);
    users.get_info(account, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (!result || result.length === 0) {
            res.send({ ok: 0, msg: "账号错误" });
            return;
        }

        var userid = result[0].ID;
        var isAdmin = result[0].IsAdmin;
        var isBoss = result[0].isBoss;

        var password = req.body.password;

        password = utils.md5(account.toLowerCase() + '&' + password);
        if (password != result[0].Password) {
            res.send({ ok: 0, msg: "密码错误" });
            return;
        }

        var now = new Date(),
            expireTime = new Date(result[0].ExpireTime);
        if (Date.compare(expireTime, now) < 0) {
            res.send({ ok: 0, msg: "账号已过期" });
            return;
        }

        //res.clearCookie('member');
        var user = { userid: userid, account: account, isBoss: isBoss };
        res.cookie('member', user, { maxAge: 3600000 * 24, httpOnly: true, path: '/' });
        res.send({ ok: 1 });
    });
});

router.post('/reg', function(req, res, next) {
    var account = req.body.username,
        password = utils.md5(account + '&' + req.body.password);

    var msg = {
        "-1": "该车牌号不存在",
        "-2": "该车牌号已经被注册",
        "0": "写入数据库失败",
    };
    /*
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
    */
});

module.exports = router;