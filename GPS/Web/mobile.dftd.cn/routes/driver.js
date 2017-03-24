var express = require('express');
var date = require('date-utils')
var router = express.Router();
var driver = require('../models/driver');

router.get('/', function(req, res, next) {
 	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	
	res.render('driver', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
	driver.get_count(function(err, result){
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
	driver.get_list(pageIndex, pageSize, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});


module.exports = router;
