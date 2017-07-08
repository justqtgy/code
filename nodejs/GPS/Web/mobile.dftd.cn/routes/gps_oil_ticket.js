var express = require('express');
var router = express.Router();
var date = require('date-utils');
var vehicle = require('../models/vehicle');
var gps_oil = require('../models/gps_oil_ticket');

/* GET gps_oil home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_oil_ticket', { start_date: start_date, end_date: end_date });
});


var get_count = function(req, res, next) {
    var args = req.body;
    gps_oil.get_count(args, function(err, result) {
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
    gps_oil.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

router.post('/add', function(req, res, next) {
    if (req.cookies.member) {
        console.log(req.body)
        var params = {
            vehicleID: req.body.vehicleID,
            vehicleNo: req.body.vehicleNo,
            fueltime: req.body.fueltime,
            amount: req.body.amount || 0,
            number: req.body.number || 0,
            price: req.body.price || 0,
            station: req.body.station || ''
        };
        var member = req.cookies.member;

        params.driverid = member.userid;

        gps_oil.add(params, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    }

});

module.exports = router;