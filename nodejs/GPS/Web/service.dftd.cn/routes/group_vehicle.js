﻿var express = require('express');
var router = express.Router();

var group_vehicle = require('../models/group_vehicle');

router.get('/list', function(req, res, next) {
    var args = req.query;
    group_vehicle.get_list(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, rows: result });
    });
});

router.post('/except_list', function(req, res, next) {
    var args = req.body;
    group_vehicle.get_except_list(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        var list = '';
        for (var i in result) {
            var item = result[i];
            list += "<option value=\"" + item.VehicleID + "\" >" + item.VehicleNo + "</option>";
        }
        res.send({ ok: 1, list: list });
    });
});

router.get('/group', function(req, res, next) {
    var member = req.cookies.member;
    var vhc_group = req.session[member.userid + "_group"];
    if (vhc_group) {
        res.send({ error: 0, group: vhc_group });
    } else {
        group_vehicle.get_groupvehicle(member.userid, member.isadmin, function(err, result) {
            var group = '';
            for (var i in result) {
                var item = result[i];
                if (item.Level == 0) {
                    if (!group) {
                        group = "<optgroup label='" + item.GroupName + "'>";
                    } else {
                        group += "</optgroup>";
                        group += "<optgroup label='" + item.GroupName + "'>";
                    }

                } else {
                    group += "<option value=\"" + item.VehicleID + "\" >" + item.VehicleNo + "</option>";
                }
            }

            group += "</optgroup>";

            req.session[member.userid + "_group"] = group;

            res.send({ error: 0, group: group });
        });
    }
});

router.post('/add', function(req, res, next) {
    var args = req.body;
    group_vehicle.add(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });

});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    group_vehicle.delete(id, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;