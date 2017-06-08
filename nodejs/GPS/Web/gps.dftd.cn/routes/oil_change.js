var express = require('express');
var router = express.Router();

var fuel_up = require('../models/fuel_up');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('fuel_up', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
	fuel_up.get_count(function(err, result){
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
	fuel_up.get_list(pageIndex, pageSize, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	fuel_up.get_single(id, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, rows : result });
	});
});

//http://127.0.0.1:3000/fuel_up/add?vehicleid=1&driverid=2&number=3&price=4&amount=12&station=6&fueltime=2016-09-02
router.post('/add', function(req, res, next) {
	var model = {
		id : req.body.id || 0,
		vehicleid : req.body.vehicleid,
		driverid : req.body.driverid||0,
		number : req.body.number,
		price : req.body.price,
		amount : req.body.amount,
		station : req.body.station,
		fueltime : req.body.fueltime,		
    };
  
	fuel_up.add(model, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0 });
	});
});

router.delete('/', function(req, res, next) {
	var id = req.body.id;
	fuel_up.delete(id, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0 });
	});
});

module.exports = router;
