var express = require('express');
var date = require('date-utils')
var router = express.Router();

var daily_report = require('../models/daily_report');

router.get('/', function(req, res, next) {
	var start_date = Date.yesterday().toFormat('YYYY-MM-DD'),
		end_date = Date.yesterday().toFormat('YYYY-MM-DD');
	res.render('daily_report', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = Date.yesterday().toFormat('YYYY-MM-DD'),
		end_date = Date.yesterday().toFormat('YYYY-MM-DD');
	res.render('mobile/m_daily_report', {start_date:start_date, end_date:end_date});
});


/**成本核算 */
router.post('/oil_cost', function(req, res, next) { 
	var start_date = req.body.begintime,
		end_date = req.body.endtime,
		car_list = req.body.carlist;

	daily_report.get_oilcost(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}
		console.log(result)
		res.send({ ok : 0, rows : result });
	});
});


/**油耗信息，暂不用 */
router.post('/oil_used', function(req, res, next) { 
	var start_date = req.body.begintime,
		end_date = req.body.endtime,
		car_list = req.body.carlist;
	
	daily_report.get_oilused(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}
		console.log(result)
		res.send({ ok : 0, rows : result });
	});
});


router.post('/chart', function(req, res, next) { 
	var start_date = req.body.begintime,
		end_date = req.body.endtime,
		car_list = req.body.carlist;
	
	daily_report.get_chart(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});


router.post('/detail', function(req, res, next) { 
	var start_date = req.body.begintime,
		end_date = req.body.endtime,
		car_list = req.body.carlist;
	
	daily_report.get_detail(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});







router.get('/create_report', function(req, res, next) {
	var dt_date = Date.yesterday().toFormat('YYYY-MM-DD');
	
	res.render('create_report', {dtime:dt_date});
});


router.post('/create_report', function(req, res, next) {
	var dtime = req.body.dtime

	daily_report.create_report(dtime, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0 });
	});
});




module.exports = router;
