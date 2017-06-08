var express = require('express');
var router = express.Router();

var gps_quality = require('../models/gps_quality');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('gps_quality', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
	gps_quality.get_count(function(err, result){
		if(err){
			throw err;

		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) {
	var pageIndex = req.query.pageindex;
	var pageSize = req.query.pagesize;
	gps_quality.get_list(pageIndex, pageSize, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	gps_quality.get_single(id, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, rows : result });
	});
});

router.post('/', function(req, res, next) {
	var model = [
		req.body.id,
		req.body.vehicleid,
		req.body.c1,
		req.body.c2,
		req.body.empty,
		req.body.full,
		req.body.init,
		req.body.volume,
		req.body.addtime,
	];
	gps_quality.add(model, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0 });
	});
});

router.delete('/', function(req, res, next) {
	var id = req.body.id;
	gps_quality.delete(id, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0 });
	});
});

module.exports = router;
