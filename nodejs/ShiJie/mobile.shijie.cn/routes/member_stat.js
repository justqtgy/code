var express = require('express');
var router = express.Router();
var date = require('date-utils');
var member_stat = require('../models/member_stat');


router.get('/stat', function(req, res, next) {
    var member = req.cookies.member;
    member_stat.get_single(member.userid, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }

        res.send({ ok: 1, rows: rows });
    });
});


module.exports = router;