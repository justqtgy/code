var express = require('express');
var router = express.Router();

var gps_oil = require('../models/gps_oil_data');

router.get('/realtime', function(req, res, next) {
    var start_date = new Date().toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('oil_realtime', { start_date: start_date, end_date: end_date });
});

router.get('/get_rt_list', function(req, res, next) {
    var params = req.query;
    console.log(req.query);
    gps_oil.get_rt_list(params, function(err, result) {
        if (err) {
            throw err;

        }
        res.send({ ok: 0, rows: result });
    });
});

module.exports = router;