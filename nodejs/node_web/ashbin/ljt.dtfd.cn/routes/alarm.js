var express = require('express');
var router = express.Router();
var moment = require('moment');
var alarm = require('../models/alarm');

router.get('/', function(req, res, next) {
	var start_date = new moment().add(-10, 'days').format('YYYY-MM-DD'),
        end_date = new moment().format('YYYY-MM-DD');
	res.render('alarm', { start_date: start_date, end_date: end_date });
});

var get_count = function(req, res, next) {
	var args = req.query;
	alarm.get_count(args, function(err, result){
		if(err){
			return next(err);
		}
		req.total = result;
		next();
	});
};

router.get('/pages', [get_count], function(req, res, next) {
	var args = req.query;
	alarm.get_pages(args, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	alarm.get_single(id, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, rows : result });
	});
});

module.exports = router;
