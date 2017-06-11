var express = require('express');
var utils = require('utility');
var users = require('../models/member');
var router = express.Router();

router.requireAuthentication = function(req, res, next) {
    console.log('check login cookies ...', req.cookies.member);

    if (req.path.indexOf("/users/login") >= 0 || req.path.indexOf("/users/reg") >= 0) {
        next();
        return;
    }
    if (req.cookies.member) {
        var member = req.cookies.member;
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
            res.send({ ok: 1, msg: "账号错误" });
            return;
        }
        var userid = result[0].ID;
        // var boss = result[0].boss;
        // var user_type = result[0].user_type;

        var password = req.body.password;
        password = utils.md5(result[0].ID + '&' + password);
        if (password != result[0].Password) {
            res.send({ ok: 1, msg: "密码错误" });
            return;
        }

        //res.clearCookie('member');
        res.cookie('member', { userid: userid, account: account }, { maxAge: 3600000, httpOnly: true, path: '/' });
        res.cookie('userinfo', account, { maxAge: 3600000, httpOnly: true, path: '/' });

        res.send({ ok: 1 })
    });
});

router.get('/logout', function(req, res) {
    res.clearCookie("member");
    res.redirect('/users/login');
});

router.get('/check_login', function(req, res) {
    if (req.cookies.member) {
        var member = req.cookies.member;
        res.send({ member: member });
    }
});

module.exports = router;