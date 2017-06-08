var express = require('express');
var router = express.Router();
var vehicle = require('../models/vehicle');
var driver = require('../models/driver');
var driver_vhc = require('../models/driver_vhc');

router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('vehicle', { start_date: start_date, end_date: end_date });
});


router.get_my_vehicle = function(req, res, cb) {
    var list = new Array();

    if (req.cookies.member) {
        var member = req.cookies.member;

        if (req.session[member.userid + "_vehicle"]) {
            list = req.session[member.userid + "_vehicle"];
            cb(list);
            return;
        }
        console.log('get user vehicle...')

        driver_vhc.get_mylist(member.userid, function(err, result) {
            console.log(result);
            for (var i in result) {
                list.push({ "VhcID": result[i].VehicleID, "CarNumber": result[i].CarNumber });
            }
            req.session[member.userid + "_vehicle"] = list;
            cb(list);
        });
    }
};

router.get('/group', function(req, res, next) {
    var member = req.cookies.member;
    var vhc_group = req.session[member.userid + "_group"];
    if (vhc_group) {
        res.send({ error: 0, group: vhc_group });
    } else {
        vehicle.get_grouplist(member.userid, member.user_type, function(err, result) {
            var group = '';
            for (var i in result) {
                var item = result[i];
                if (item.level == 0) {
                    if (!group) {
                        group = "<optgroup label='" + item.groupname + "'>";
                    } else {
                        group += "</optgroup>";
                        group += "<optgroup label='" + item.groupname + "'>";
                    }

                } else {
                    group += "<option value=\"" + item.vehicleid + "\" >" + item.carnumber + "</option>";
                }
            }

            group += "</optgroup>";
            req.session[member.userid + "_group"] = group;

            res.send({ error: 0, group: group });
        });
    }
});

var get_count = function(req, res, next) {
    var args = req.body;
    vehicle.get_count(args, function(err, result) {
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
    vehicle.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

router.post('/single', function(req, res, next) {
    var args = req.body;
    vehicle.get_single(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});


module.exports = router;