var express = require('express');
var router = express.Router();

var gps_oil_data = require('../models/gps_oil_data');
var gps_oil_add = require('../models/gps_oil_add');
var gps_oil_leak = require('../models/gps_oil_leak');

router.get('/m_add_index', function(req, res, next) {
    var start_date = new Date().toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('mobile/m_oil_add', { start_date: start_date, end_date: end_date });
});

router.get('/m_leak_index', function(req, res, next) {
    var start_date = new Date().toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('mobile/m_oil_leak', { start_date: start_date, end_date: end_date });
});

router.get('/realtime', function(req, res, next) {
    var start_date = new Date().toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('oil_realtime', { start_date: start_date, end_date: end_date });
});


router.post('/get_rt_list', function(req, res, next) {
    var params = req.body;
    console.log(req.body);
    gps_oil_data.get_list(params, function(err, result) {
        if (err) {
            throw err;

        }
        res.send({ ok: 0, rows: result });
    });
});

router.post('/get_add_list', function(req, res, next) {
    var params = req.body;
    console.log(req.body);
    gps_oil_add.get_list(params, function(err, result) {
        if (err) {
            throw err;

        }
        res.send({ ok: 0, rows: result });
    });
});

router.post('/get_leak_list', function(req, res, next) {
    var params = req.body;
    console.log(req.body);
    gps_oil_leak.get_list(params, function(err, result) {
        if (err) {
            throw err;

        }
        res.send({ ok: 0, rows: result });
    });
});

module.exports = router;