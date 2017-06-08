var express = require('express');
var date = require('date-utils')
var router = express.Router();

var vehicle_last = require('../models/vehicle_last');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('vehicle_last', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('mobile/m_vehicle_last', {start_date:start_date, end_date:end_date});
});

router.post('/list', function(req, res, next) { 
	var carList = req.body.carlist;
	 console.log(carList)
	vehicle_last.get_list(carList, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});

module.exports = router;
