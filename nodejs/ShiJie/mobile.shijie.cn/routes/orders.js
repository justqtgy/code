var express = require('express');
var router = express.Router();
var async = require('async');
var orders = require('../models/orders');
var member_stat = require('../models/member_stat');

router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('orders', { start_date: start_date, end_date: end_date });
});

router.get('/list', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('orders', { start_date: start_date, end_date: end_date });
});

router.get('/join', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    var member = req.cookies.member;
    orders.isExists(member.userid, function(err, counts) {
        if (counts > 0) {
            //res.render('pricing', { start_date: start_date, end_date: end_date });
            res.redirect('pricing');
        } else {
            res.render('join', { start_date: start_date, end_date: end_date });
        }
    });
});

router.get('/pricing', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('pricing', { start_date: start_date, end_date: end_date });
});


var get_count = function(req, res, next) {
    var args = req.query;
    console.log(args);
    orders.get_count(args, function(err, result) {
        if (err) {
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.get('/pages', [get_count], function(req, res, next) {
    var args = req.query;
    orders.get_pages(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    orders.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, rows: result });
    });
});

router.post('/save', function(req, res, next) {
    var args = req.body,
        member = req.cookies.member;
    args.memberid = member.userid;

    async.waterfall([
        function(cb) {
            orders.add(args, function(err, result) {
                if (err) {
                    return cb(err);
                }
                var ret = result[0].ID;
                cb(null, ret);
            });
        },
        function(ret, cb) {
            args.id = ret;
            args.order_no = 'SJ-' + PrefixInteger(ret, 8);

            orders.createOrderNo(args, function(err, result) {
                if (err) {
                    return cb(err);
                }
                cb(null);
            });
        }
    ], function(err) {
        if (err) {
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    orders.changeStatus(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});


router.post('confirm', function(req, res, next) {
    var params = req.body;
    console.log('orders confirm req body :', params);
    async.waterfall([
            function(cb) {
                orders.changeStatus(params.id, function(err, result) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null);
                });
            },
            function(cb) {
                member_stat.get_single(params.memberid, function(err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result[0].length);
                });
            },
            function(exist, cb) {
                if (exists > 0) {
                    member_stat.init(params, function(err, result) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null);
                    });
                } else {
                    member_stat.update(params, function(err, result) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null);
                    });
                }
            }
        ],
        function(err) {
            if (err) {
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        }
    );
});

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

module.exports = router;