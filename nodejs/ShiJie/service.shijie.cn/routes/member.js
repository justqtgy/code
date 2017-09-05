﻿var express = require('express');
var router = express.Router();

var member = require('../models/member');

router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('member', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
    member.get_count(function(err, result) {
        if (err) {
            return next(err);
        }
        req.total = result;
        next();
    });
};

router.get('/list', function(req, res, next) {
    var args = req.body;
    console.log('get member list : ', args)
    member.get_list(args, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1, total: req.total, rows: result });
    });
});

router.get('/single', function(req, res, next) {
    var id = req.query.id;
    member.get_single(id, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        member.get_single(req.query.pid, function(err, parents) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }

            res.send({ ok: 1, rows: result, parents: parents });
        });
    });
});

router.post('/set', function(req, res, next) {
    var args = req.body
    console.log('args================',args)
    args.Status = args.Status == 'on' ? 1: 0
    if(args.ID && args.ID>0){
        member.update(args, function(err, result) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        });
    }else{
        member.add(args, function(err, result) {
            if (err) {
                res.send({ ok: 0, msg: err });
                return;
            }
            res.send({ ok: 1 });
        });
    }
});

router.post('/delete', function(req, res, next) {
    var params = req.body;
    member.delete(params, function(err, result) {
        if (err) {
            res.send({ ok: 0, msg: err });
            return;
        }
        res.send({ ok: 1 });
    });
});

module.exports = router;
