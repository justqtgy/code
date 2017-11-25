var express = require('express');
var router = express.Router();
var async = require('async');
var member = require('../models/member');
var member_stat = require('../models/member_stat');
var agent = require('../models/agent');

router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('member', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    member.get_count(function(err, result) {
        if (err) {
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.get('/list', function(req, res, next) {
    var args = req.body;
    console.log('get /member/list args => ', args);
    member.get_list(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    member.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        agent.get_single(req.query.pid, function(err, parents) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }

            res.send({ ok: 1, rows: result, parents: parents });
        });
    });
});

router.post('/reg', function(req, res, next) {
    var args = req.body;    
    args.status = 1
    console.log('post /member/reg => ', args);
    async.waterfall([
        function(cb){
            member.add(args, function(err, result) {
                if (err) {
                    return cb(err);                    
                }
                console.log('add member result =>', result);
                args.member_id = result[0].ID;
                args.member_no = 'GSMY'+PrefixInteger(args.member_id, 8);
                cb(null)
            });
        },
        function(cb){
            member_stat.init(args, function(err, result) {
                if (err) {
                    return cb(err);
                }    
                cb(null)
            });
        },
        function(cb){            
            agent.add(args, function(err, result){
                if (err) {
                    return cb(err);
                }
    
                cb(null)
            });
        }
    ],function(err){
        if (err) {
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });    
});

router.post('/save', function(req, res, next) {
    var args = req.body;
    console.log('post /member/save => ', args);
    if (args.id && args.id > 0) {
        member.update(args, function(err, result) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        });
    }  
});

router.post('/delete', function(req, res, next) {
    var params = req.body;
    console.log('post /member/elete args => ', params)
    member.delete(params, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

router.post('/password', function(req, res, next) {
    console.log('post /member/password args => ', req.body)
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

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

module.exports = router;