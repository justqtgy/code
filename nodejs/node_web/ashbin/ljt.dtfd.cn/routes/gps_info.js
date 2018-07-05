var express = require('express');
var router = express.Router();
var gps_info = require('../models/gps_info');
 
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('gps_info', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    gps_info.get_count(function(err, result) {
        if (err) {
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.get('/list', function(req, res, next) {
    var args = req.body;
    console.log('get gps_info list : ', args)
    gps_info.get_list(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    gps_info.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        gps_info.get_single(req.query.pid, function(err, parents) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }

            res.send({ ok: 1, rows: result, parents: parents });
        });
    });
});


router.post('/delete', function(req, res, next) {
    var params = req.body;
    console.log('gps_info delete args = ', params)
    gps_info.delete(params, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;