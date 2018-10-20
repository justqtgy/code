var express = require('express');
var router = express.Router();
var gps_info = require('../models/gps_info');
 
router.get('/', function(req, res, next) {
    res.render('gps_info');
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

router.get('/pages', [get_count], function(req, res, next) {
    var args = req.query;
    console.log('get gps_info pages: ', args);
    gps_info.get_pages(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});


router.get('/list', function(req, res, next) {
    console.log('get gps_info list ')
    gps_info.get_list(function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    gps_info.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, rows: result });
    });
});


router.post('/set', function(req, res, next) {
    var args = req.body;
    console.log('gps_info set args = ', args)
    if(args.id) {
        gps_info.update(args, function(err, result){
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        })
    } else {
        gps_info.add(args, function(err, result) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        });
        
    }
    
});

module.exports = router;