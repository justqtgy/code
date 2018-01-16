var express = require('express');
var router = express.Router();
var date = require('date-utils');
var gps_last = require('../models/gps_last');

/* GET gps_last home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_location', { start_date: start_date, end_date: end_date });
});

router.post('/list', function(req, res, next) {
    var args = req.body;
    gps_last.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

module.exports = router;