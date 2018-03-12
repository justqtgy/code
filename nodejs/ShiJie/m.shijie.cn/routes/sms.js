var express = require('express');
var router = express.Router();

var sms = require('../models/sms');

router.get('/', function(req, res, next) {
    res.render('sms');
});

var get_count = function(req, res, next) {
    sms.get_count(function(err, result) {
        if (err) {
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.get('/list', [get_count], function(req, res, next) {
    var args = req.body;
    sms.get_list(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    sms.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, rows: result });
    });
});

router.post('/', function(req, res, next) {
    var args = req.body;
    sms.add(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

router.delete('/', function(req, res, next) {
    var id = req.body.id;
    sms.delete(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;