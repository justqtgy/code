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

        // if (password != result[0].password) {
        //     res.send({ ok: 1, msg: "密码错误" });
        //     return;
        // }

        var userid = result[0].id;
        var boss = result[0].boss;
        var user_type = result[0].user_type;

        //res.clearCookie('member');
        res.cookie('member', { userid: userid, account: account, boss: 1, user_type: user_type }, { maxAge: 3600000, httpOnly: true, path: '/' });
        res.cookie('userinfo', account, { maxAge: 3600000, httpOnly: true, path: '/' });

        res.send({ ok: 1 })
    });
});

router.get('/logout', function(req, res) {
    req.clearCookie("member");
    res.redirect('/login');
});

module.exports = router;