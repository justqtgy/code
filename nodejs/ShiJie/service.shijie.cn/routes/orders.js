var express = require('express');
var router = express.Router();
var async = require('async');
var orders = require('../models/orders');

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

router.get('/my', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('myorders', { start_date: start_date, end_date: end_date });
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
    var args = req.body;
    orders.add(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    orders.delete(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;