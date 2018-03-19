var express = require('express');
var router = express.Router();
var gps_sending = require('../models/gps_sending');

/* GET gps_sending home page. */
router.get('/', function(req, res, next) {
    res.render('gps_sending');
});

router.post('/list',function(req, res, next) {
    var args = req.body;
    gps_sending.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, rows: rows });
    });
});

module.exports = router;


