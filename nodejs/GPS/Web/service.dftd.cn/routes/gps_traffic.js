var express = require('express');
var router = express.Router();
var date = require('date-utils');
var gps_traffic = require('../models/gps_traffic');

/* GET gps_traffic home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_traffic', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    gps_traffic.get_count(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return next();
        }
        req.total = result;
        next();
    });
};

router.post('/list', [get_count], function(req, res, next) {
    var args = req.body;
    gps_traffic.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;