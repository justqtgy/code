var express = require('express');
var date = require('date-utils')
var router = express.Router();

var gps_data = require('../models/gps_data');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('gps_data', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
	gps_data.get_count(function(err, result){
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
	gps_data.get_list(pageIndex, pageSize, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	gps_data.get_single(id, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});

module.exports = router;
