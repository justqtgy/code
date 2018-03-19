var express = require('express');
var router = express.Router();
var utils = require('utility');
var date = require('date-utils');
var member = require('../models/member');

/* GET member home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('member', { start_date: start_date, end_date: end_date });
});

router.post('/delete', function(req, res, next) {
    var args = req.body;
    member.delete(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });
});

router.post('/password', function(req, res, next) {
    var userinfo = req.cookies.member;
    var args = req.body;

    if (!args.old_password) {
        return res.send({ ok: 0, msg: '密码不能为空，请输入密码' });
    }

    if (args.new_password != args.confirm_password) {
        return res.send({ ok: 0, msg: '密码不一致，请重新输入' });
    }

    args.id = userinfo.userid;
    var oldPasssword = utils.md5(userinfo.account + '&' + args.old_password);
    member.get_single(args.id, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }

        args.account = result[0].Account;
        args.password = utils.md5(args.account.toLowerCase() + '&' + args.new_password);

        if (oldPasssword != result[0].Password) {
            return res.send({ ok: 0, msg: '旧密码错误，请重新输入' });
        }

        member.change_password(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    });
});


module.exports = router;