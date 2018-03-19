/**
 * Created by Administrator on 2017/8/1.
 */
var express = require('express');
var router = express.Router();
var date = require('date-utils');
var cost_check = require('../models/cost_check');

/* GET gps_oil home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD')+' 00:00',
        end_date = new Date().toFormat('YYYY-MM-DD HH24:MI');
    res.render('cost_check', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    cost_check.get_count(args, function(err, result) {
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
    cost_check.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;