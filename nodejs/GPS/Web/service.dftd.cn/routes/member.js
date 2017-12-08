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

var get_count = function(req, res, next) {
    var args = req.body;
    console.log(args);
    member.get_count(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.post('/list', [get_count], function(req, res, next) {
    var args = req.body;
    member.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});


router.get('/single', function(req, res, next) {
    var id = req.query.id;
    member.get_single(id, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, rows: result });
    });
});

router.post('/set', function(req, res, next) {
    var args = {
        id: req.body.id,
        account: req.body.account,
        password: req.body.password,
        trueName: req.body.trueName,
        email: req.body.email,
        mobile: req.body.mobile,
        expireTime: req.body.expireTime,
        isAdmin: req.body.isAdmin ? 1 : 0
    };
    console.log(args)
    if (args.id && args.id > 0) {
        member.update(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    } else {
        args.password = utils.md5(args.account.toLowerCase() + '&' + args.password);
        member.add(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    }
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
    console.log(req.body)
    var args = {
        id: req.body.id,
        account: req.body.account,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    if (!args.password) {
        return res.send({ ok: 0, msg: '密码不能为空，请输入密码' });
    }

    if (args.password != args.confirmPassword) {
        return res.send({ ok: 0, msg: '密码不一致，请重新输入' });
    }

    args.password = utils.md5(args.account.toLowerCase() + '&' + args.password);

    member.change_password(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });
});


module.exports = router;