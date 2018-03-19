/**
 * Created by Administrator on 2017/8/4.
 */
var express = require('express');
var router = express.Router();
var date = require('date-utils');
var Storage = require('dom-storage'),
    sessionStorage = new Storage(null, { strict: true });
var gps_rubbish = require('../models/gps_rubbish');

router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_rubbish', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    gps_rubbish.get_count(args, function(err, result) {
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
    gps_rubbish.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return;
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

router.get('/GPSIDList', function(req, res, next) {
    var member = req.session.member;
    var keyGroup = member.userid + "_group";
    var gps_group = sessionStorage.getItem(keyGroup);
    if (gps_group) {
        res.send({ error: 0, group: gps_group });
    } else {
        gps_rubbish.get_GPSIDList(member.userid, function(err, result) {
            var group = '';
            for (var i in result) {
                var item = result[i];
                group += "<option value=\"" + item.GPSIDList + "\" >" + item.GPSIDList + "</option>";
            }
            sessionStorage.setItem(keyGroup, group);
            res.send({ error: 0, group: group });
        });
    }
});
module.exports = router;