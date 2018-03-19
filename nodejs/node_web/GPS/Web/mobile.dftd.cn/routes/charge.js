/**
 * Created by Administrator on 2017/8/22.
 */
var express = require('express');
var router = express.Router();
var date = require('date-utils');
var charge = require('../models/charge');

router.get('/', function(req, res, next) {
    res.render('charge');
});

var get_count = function(req, res, next) {
    var args = req.body;
    charge.get_count(args, function(err, result) {
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
    charge.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;