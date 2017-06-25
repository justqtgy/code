var express = require('express');
var utils = require('utility');
var date = require('date-utils');
var users = require('../models/member');
var router = express.Router();

router.requireAuthentication = function(req, res, next) {
    console.log('check login cookies ...', req.session.member);

    if (req.path.indexOf("/users/login") >= 0 || req.path.indexOf("/users/reg") >= 0) {
        next();
        return;
    }
    if (req.session.member) {
        var member = req.session.member;
        req.account = member.account;
        next();
    } else {
        req.session.vehicle_group = '';

        var from_url = req.originalUrl;
        if (from_url != "")
            res.redirect('/users/login?url=' + from_url);
        else
            res.redirect('/users/login');
    }
};


router.get('/login', function(req, res, next) {
    var account = '';
    if (req.cookies.userinfo) {
        account = req.cookies.userinfo;
    }
    res.render('login', { account: account });
});

router.post('/login', function(req, res, next) {
    var url = req.body.url || '';
    var account = req.body.username;

    users.get_info(account, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (!result || result.length == 0) {
            res.send({ ok: 0, msg: "账号错误" });
            return;
        }

        var userid = result[0].ID;
        var isAdmin = result[0].IsAdmin;
        // var user_type = result[0].user_type;

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
        res.cookie('userinfo', account, { maxAge: 3600000, httpOnly: true, path: '/' });

        var user = { userid: userid, account: account, isadmin: isAdmin };
        req.session.member = user;
        res.send({ ok: 1 })
    });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/users/login');
});

router.get('/check_login', function(req, res) {
    if (req.session.member) {
        var member = req.session.member;
        res.send({ member: member });
    }
});

module.exports = router;