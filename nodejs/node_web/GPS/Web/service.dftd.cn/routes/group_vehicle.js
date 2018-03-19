var express = require('express');
var router = express.Router();
var Storage = require('dom-storage'),
    sessionStorage = new Storage(null, { strict: true });

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
    var member = req.session.member;
    var keyGroup = member.userid + "_group";
    //var vhc_group = req.session[keyGroup];
    vhc_group = sessionStorage.getItem(keyGroup);
    if (vhc_group) {
        res.send({ error: 0, group: vhc_group });
    } else {
        group_vehicle.get_groupvehicle(member.userid, function(err, result) {
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

            //req.session[keyGroup] = group;
            sessionStorage.setItem(keyGroup, group);

            res.send({ error: 0, group: group });
        });
    }
});

router.get('/tree_group', function(req, res, next) {
    var member = req.session.member;
    var keyGroup = member.userid + "_tree_group";
    //var vhc_group = req.session[keyGroup];
    // var vhc_group = sessionStorage.getItem(keyGroup);
    // if (vhc_group) {
    //     res.send({ error: 0, group: vhc_group });
    // } else {
        group_vehicle.get_groupvehicle(member.userid, function(err, result) {
            //req.session[keyGroup] = group;
            //sessionStorage.setItem(keyGroup, result);

            res.send({ error: 0, rows: result });
        });
    // }
});

router.post('/add', function(req, res, next) {
    var args = req.body;
    group_vehicle.add(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });

        removeMemberGroup(req, res);
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

        removeMemberGroup(req, res);
    });
});

function removeMemberGroup(req, res) {
    var member = req.session.member;
    if (member) {
        var keyGroup = member.userid + "_group";
        sessionStorage.removeItem(keyGroup);
    }
}

module.exports = router;