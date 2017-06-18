var express = require('express');
var router = express.Router();

var group_vehicle = require('../models/group_vehicle');

router.get('/list', function(req, res, next) {
    var args = req.query;
    group_vehicle.get_list(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        console.log('result================', result)
        res.send({ ok: 1, rows: result });
    });
});

router.get('/except_list', function(req, res, next) {
    var args = req.query;
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

router.post('/', function(req, res, next) {
    var args = req.body;
    if (args.id) {
        group_vehicle.update(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    } else {
        group_vehicle.add(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    }
});

router.delete('/', function(req, res, next) {
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