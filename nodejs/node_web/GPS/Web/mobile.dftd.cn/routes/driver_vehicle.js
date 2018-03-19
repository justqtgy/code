var express = require('express');
var router = express.Router();
var utils = require('utility');
var date = require('date-utils');
var driver_vehicle = require('../models/driver_vehicle');

router.post('/list', function(req, res, next) {
    var member = req.cookies.member;
    driver_vehicle.get_list(member.userid, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, rows: rows });
    });
});


module.exports = router;