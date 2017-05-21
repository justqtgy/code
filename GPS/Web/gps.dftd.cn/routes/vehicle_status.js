var express = require('express');
var router = express.Router();
var date = require('date-utils')
var report_vhc = require('../models/report_vhc');


var vehicle_last = require('../models/vehicle_last');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('vhc_status', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('mobile/m_vhc_status', {start_date:start_date, end_date:end_date});
});

router.post('/vhc_status', function(req, res, next) { 
	var carList = req.body.carlist;
	report_vhc.get_vehicle_status(carList, function(err, result){
		if(err){
			console.log(err);
			throw err;
		}

		res.send({ ok : 0,  rows : result });
	});
});

module.exports = router;
