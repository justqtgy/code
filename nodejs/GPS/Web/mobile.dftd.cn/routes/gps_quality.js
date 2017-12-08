/**
 * Created by Administrator on 2017/7/29.
 */
var express = require('express');
var router = express.Router();
var date = require('date-utils');
var gps_quality= require('../models/gps_quality');

/* GET gps_last home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_quality', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    gps_quality.get_count(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            next();
            return;
        }
        req.total = result;
        next();
    });
};

router.post('/list', [get_count], function(req, res, next) {
    var args = req.body;
    console.log('args=================', args);
    gps_quality.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            res.send({ ok: 0 });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;