var express = require('express');
var router = express.Router();
var date = require('date-utils');
var vehicle = require('../models/vehicle');
var gps_point = require('../models/gps_point');

// router.get('/', function(req, res, next) {
//     var start_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
//         end_date = new Date().toFormat('YYYY-MM-DD  HH24:MI:SS');
//     res.render('traffic', { start_date: start_date, end_date: end_date });
// });

router.get('/m_index', function(req, res, next) {
    var start_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
        end_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    res.render('mobile/m_point', { start_date: start_date, end_date: end_date });
});

router.post('/list', function(req, res, next) {
    console.log('get point data =======>', req.body);
    var ctx = req.body;

    gps_point.get_list(ctx, function(err, result) {
        if (err) {
            throw err;
        }
        console.log('get point result ======>', result);
        res.send({ ok: 0, rows: result });
    });
});

module.exports = router;