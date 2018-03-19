var express = require('express');
var router = express.Router();
var date = require('date-utils');
var driver_card = require('../models/driver_card');

/* GET gps_alarm home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('driver_card', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    driver_card.get_count(args, function(err, result) {
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
    driver_card.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;