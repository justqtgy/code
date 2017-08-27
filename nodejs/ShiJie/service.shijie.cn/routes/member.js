var express = require('express');
var router = express.Router();

var member = require('../models/Member');

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

router.get('/list', [get_count], function(req, res, next) {
    var args = req.body;
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
        res.send({ ok: 1, rows: result });
    });
});

router.post('/', function(req, res, next) {
    var args = req.body
    member.add(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

router.delete('/', function(req, res, next) {
    var id = req.body.id;
    member.delete(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;