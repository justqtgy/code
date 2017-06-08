var express = require('express');
var date = require('date-utils')
var router = express.Router();

var vhconline = require('../models/vhconline');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('vhc_online', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('mobile/m_vhconline', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
	var begintime = req.query.begintime;
	var endtime = req.query.endtime;
	var carlist = req.query.carlist;
	
	vhconline.get_count(begintime, endtime, carlist, function(err, result){
		if(err){
			throw err;
		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) { console.log(req.total);
	var begintime = req.query.begintime;
	var endtime = req.query.endtime;
	var pageIndex = req.query.pageindex;
	var pageSize = req.query.pagesize;
	var carlist = req.query.carlist;
	vhconline.get_list(begintime, endtime, carlist, pageIndex, pageSize, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.post('/last', function(req, res, next) { 
	var carList = req.body.carlist;
	console.log(carList);
	vhconline.get_last(carList, function(err, result){console.log(err);
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});


module.exports = router;
