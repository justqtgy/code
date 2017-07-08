var express = require('express');
var router = express.Router();
var date = require('date-utils');
var news = require('../models/news');

/* GET gps_traffic home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('news', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    var args = req.body;
    news.get_count(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.post('/list', [get_count], function(req, res, next) {
    var args = req.body;
    news.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, total: req.total, rows: rows });
    });
});

router.post('/single', function(req, res, next) {
    var id = req.body.id;
    news.get_single(id, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1, rows: rows });
    });
});


router.post('/set', function(req, res, next) {
    var member = req.session.member;
    var args = {
        id: req.body.id || 0,
        title: req.body.title,
        content: req.body.content,
        admin_id: member.userid,
        admin_name: member.account,
    };
    console.log(args)
    if (args.id && args.id > 0) {
        news.update(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    } else {
        news.add(args, function(err, result) {
            if (err) {
                log.error('Error = ', err);
                return res.send({ ok: 0, msg: err });
            }
            res.send({ ok: 1 });
        });
    }
});

router.post('/delete', function(req, res, next) {
    var args = req.body;
    news.delete(args, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;