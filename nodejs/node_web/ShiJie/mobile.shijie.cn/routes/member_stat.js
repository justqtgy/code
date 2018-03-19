var express = require('express');
var router = express.Router();
var async = require('async');
var date = require('date-utils');
var member_stat = require('../models/member_stat');


router.get('/stat', function(req, res, next) {
    var member = req.cookies.sj_member;
    member_stat.get_single(member.userid, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }

        res.send({ ok: 1, rows: rows });
    });
});



router.get('/yeji', function(req, res, next) {
    var args = req.query;
    console.log('get /member/list args => ', args);

    var member = req.cookies.sj_member;
    var result = {};

    async.waterfall([
        cb => {
            member_stat.get_team(member.userid, function(err, rows) {
                if (err) {
                    return cb(err)
                }
                result.team = rows[0]
                cb(null)
            })
        },
        cb => {
            member_stat.get_single(member.userid, function(err, rows) {
                if (err) {
                    return cb(err)
                }

                result.my = rows[0]
                cb(null)
            });
        }
    ], function(err) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, result: result });
    })
});


module.exports = router;