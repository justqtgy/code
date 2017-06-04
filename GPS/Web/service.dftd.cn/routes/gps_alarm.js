var express = require('express');
var router = express.Router();
var date = require('date-utils');
//var gps_alarm = require('../models/gps_alarm');

/* GET gps_alarm home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_alarm', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.query;
    gps_alarm.get_count(args, function(err, result) {
        if (err) {
            throw err;
        }
        req.total = result;
        next();
    });
};

router.get('/list', [get_count], function(req, res, next) {
    var args = req.query;
    gps_alarm.get_list(args, function(err, rows) {
        if (err) {
            throw err;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;