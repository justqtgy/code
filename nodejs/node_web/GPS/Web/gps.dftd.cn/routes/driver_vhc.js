var express = require('express');
var date = require('date-utils')
var router = express.Router();
var vehicle = require('./vehicle');
var driver_vhc = require('../models/driver_vhc');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('driver_vhc', {start_date:start_date, end_date:end_date});
});

router.get('/m_mylist', function(req, res, next) {

	if(req.cookies.member){
		var member = req.cookies.member;
		var driverid = member.userid;

		driver_vhc.get_mylist(driverid, function(err, result){
			if(err){
				throw err;

			}
			res.render('mobile/m_my_vehicle', {vehicle : result[0]});
		});
	}	
});

var get_count = function(req, res, next) {
	driver_vhc.get_count(function(err, result){
		if(err){
			throw err;
		}
		req.total = result;
		next();
	});
};

router.get('/mylist', function(req, res, next) {
    if(req.cookies.member){
		var member = req.cookies.member;
		var driverid = member.userid;

		driver_vhc.get_mylist(driverid, function(err, result){
			if(err){
				throw err;

			}
			res.send({ ok : 0, rows : result });
		});
	}	
});

 

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	driver_vhc.get_single(id, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, rows : result });
	});
});

router.post('/', function(req, res, next) {
	var driverid = req.body.driverid,
        vehicleid = req.body.vehicleid, 
        carnumber = req.body.carnumber;

	driver_vhc.add(driverid, vehicleid, carnumber, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0 });
	});
});

router.post('/update', function(req, res, next) {
	console.log(req.body)
	var id = req.body.id,
        sa_tel = req.body.sa_tel,
		remark = req.body.remark, 
        carnumber = req.body.carnumber;

	driver_vhc.update(id, sa_tel, remark, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0 });
	});
});

module.exports = router;
