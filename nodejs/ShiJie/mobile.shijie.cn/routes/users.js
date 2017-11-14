var express = require('express');
var utils = require('utility');
var date = require('date-utils');
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
        var from_url = req.originalUrl;
        if (from_url != "")
            res.redirect('/users/login?url=' + from_url);
        else
            res.redirect('/users/login');
    }
};


router.get('/login', function(req, res, next) {
    var account = '';
    if (req.cookies.member) {
        account = req.cookies.member;
    }
    res.render('login', { account: account });
});

router.post('/login', function(req, res, next) {
    var url = req.body.url || '';
    var account = req.body.account;
    console.log('post login body => ', req.body)
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
        var isAdmin = result[0].IsAdmin ? 1 : 0;

        var password = req.body.password;

        password = utils.md5(account.toLowerCase() + '&' + password);
        if (password != result[0].Password) {
            res.send({ ok: 0, msg: "密码错误" });
            return;
        }

        var user = { userid: userid, account: account, isadmin: isAdmin };
        res.cookie('member', user, { maxAge: 3600000, httpOnly: true, path: '/' });

        res.send({ ok: 1 });
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