var express = require('express');
var date = require('date-utils');
var oil_vhc_dv = require('../models/oil_vhc_dv');
var vehicle = require('../models/vehicle');
var router = express.Router();

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('oil_vhc_dv', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('mobile/m_oil_leak', {start_date:start_date, end_date:end_date});
});

router.get('/detail', function(req, res, next) {
	var begintime = Date.today().toFormat('YYYY-MM-DD');
	var endtime = Date.today().toFormat('YYYY-MM-DD');

	var member = req.cookies.member;
    vehicle.get_grouplist(member.userid, member.user_type, function(err, result){
		var carlist = [];
		for(var i in result){
			carlist[i] = result[i].vehicleid;
		}

		oil_vhc_dv.get_detail(begintime, endtime, carlist, function(err, result){
			if(err){
				throw err;
			}

			res.send({ ok : 0,  rows : result });
		});
	});
});

router.get('/chart', function(req, res, next) {
	var begintime = req.query.begintime;
	var endtime = req.query.endtime;
	var carlist = req.query.carlist;
	oil_vhc_dv.get_chart(begintime, endtime, carlist, function(err, result){
		if(err){
			throw err;
		}

		res.send({ ok : 0,  rows : result });
	});
});

var get_count = function(req, res, next) {
	var begintime = req.query.begintime || Date.today();
	var endtime = req.query.endtime || Date.today();
	var carNumber = req.query.carNumber;
	
	oil_vhc_dv.get_count(begintime, endtime, carNumber, function(err, result){
		if(err){
			throw err;
		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) { 
 
	var begintime = req.query.begintime || Date.today();
	var endtime = req.query.endtime || Date.today();
	var pageIndex = req.query.pageindex;
	var pageSize = req.query.pagesize;
	var carNumber = req.query.carNumber;
	console.log(req.query);



	oil_vhc_dv.get_list(begintime, endtime, carNumber, pageIndex, pageSize, function(err, result){
		if(err){
			throw err;
		}
		
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.get('/records', function(req, res, next) {
	var carList = req.query.carlist;
	oil_vhc_dv.get_records(carList, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0, rows : result });
	});
});

module.exports = router;
