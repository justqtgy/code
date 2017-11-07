var express = require('express');
var router = express.Router();

var member = require('../models/member');
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
    console.log('get member list : ', args)
    member.get_list(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    member.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        member.get_single(req.query.pid, function(err, parents) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }

            res.send({ ok: 1, rows: result, parents: parents });
        });
    });
});

router.post('/set', function(req, res, next) {
    var args = req.body
<<<<<<< HEAD
    console.log('member set args = ',args)
    args.Status = args.Status == 'on' ? 1: 0
    if(args.ID && args.ID>0){
=======
    console.log('args================', args)
    args.Status = args.Status == 'on' ? 1 : 0
    if (args.ID && args.ID > 0) {
>>>>>>> bd0a3bf76f333b507b4402e4bbbe28dc77f4eb23
        member.update(args, function(err, result) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        });
<<<<<<< HEAD
    }else{    
        member.add(args, function(err, rows) {
=======
    } else {
        member.add(args, function(err, result) {
>>>>>>> bd0a3bf76f333b507b4402e4bbbe28dc77f4eb23
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
<<<<<<< HEAD
            args.MemberID = rows[0].rid;
            agent.add(args, function(err, result){
=======
            var memberid = result[0].ID;
            member_stat.init(memberid, function(err, result) {
>>>>>>> bd0a3bf76f333b507b4402e4bbbe28dc77f4eb23
                if (err) {
                    res.send({ ok: 0, msg: err });
                    return;
                }

                res.send({ ok: 1 });
<<<<<<< HEAD
            })
            
=======
            });
>>>>>>> bd0a3bf76f333b507b4402e4bbbe28dc77f4eb23
        });
    }
});

router.post('/delete', function(req, res, next) {
    var params = req.body;
    console.log('member delete args = ', params)
    member.delete(params, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
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