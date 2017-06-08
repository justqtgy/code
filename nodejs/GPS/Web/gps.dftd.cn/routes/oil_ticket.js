/**
 * 油票
 */
var express = require('express');
var router = express.Router();
var date = require('date-utils');
var nodeExcel = require('excel-export');
var oil_ticket = require('../models/oil_ticket');
var oil_vhc_dv = require('../models/oil_vhc_dv');
var vehicle = require('./vehicle');

router.get('/', function(req, res, next) {
	var start_date = Date.yesterday().toFormat('YYYY-MM-DD'),
		end_date = Date.yesterday().toFormat('YYYY-MM-DD');
	res.render('oil_ticket', {start_date:start_date, end_date:end_date});
});

router.get('/m_fuel', function(req, res, next) {
	var today = new Date().toFormat('YYYY-MM-DD');
	vehicle.get_my_vehicle(req,res, function(result){
		res.render('mobile/m_fuel_up', {today:today, vehicle : result});
	});	
});

router.get('/m_check', function(req, res, next) {
	var start_date = Date.yesterday().toFormat('YYYY-MM-DD'),
		end_date = Date.yesterday().toFormat('YYYY-MM-DD');
	res.render('mobile/m_oil_ticket', {start_date:start_date, end_date:end_date});
});

router.get('/m_mylist', function(req, res, next) {
	res.render('mobile/m_my_ticket');
});


router.post('/check_ticket', function(req, res, next) {
	var start_date = req.body.begintime,
		end_date = req.body.endtime,
		car_list = req.body.carlist;
	oil_ticket.get_checkticket(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}

		if(result.length>0){
			var oil_sum1 = result[0].sum_1,
				oil_sum2 = result[0].sum_2;
			if(oil_sum1 == oil_sum2){
				res.send({ok : 0, type : 1 ,oil_sum1 : oil_sum1, oil_sum2 : oil_sum2});
			}
			else{
				oil_ticket.get_ticket_detail(start_date, end_date, car_list, function(err, result){
					if(err){
						throw err;
					}

					res.send({ ok : 0, type : 2, rows : result });
				})
			}
		}else{
			res.send({ok : 0, type : 1 ,oil_sum1 : 0, oil_sum2 : 0});
		}			
	})
	
});


var get_count = function(req, res, next) {
	oil_ticket.get_count(function(err, result){
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
	oil_ticket.get_list(pageIndex, pageSize, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

router.get('/mylist', function(req, res, next) {
	if(req.cookies.member){
		var member = req.cookies.member;
		var driverid = member.userid;

		oil_ticket.get_mylist(driverid, function(err, result){
			if(err){
				throw err;

			}
			res.send({ ok : 0, rows : result });
		});
	}	
});

router.post('/add', function(req, res, next) {
	if(req.cookies.member){		
		var params = req.body;
		var member = req.cookies.member;
		
		params.driverid=member.userid;

		oil_ticket.add(params, function(err, result){
			if(err){
				throw err;

			}
			res.send({ ok : 0 });
		});
	}
	
});

router.delete('/', function(req, res, next) {
	var id = req.body.id;
	oil_ticket.delete(id, function(err, result){
		if(err){
			throw err;
		}
		res.send({ ok : 0 });
	});
});

router.get('/excel', function(req, res, next){
	var conf ={};
  // uncomment it for style example  
  // conf.stylesXmlFile = "styles.xml";
    conf.cols = [{caption:'车牌号', type:'string'},
				 {caption:'时间', type:'string'},
				 {caption:'状态', type:'string'},
				 {caption:'油票', type:'number'},
				 {caption:'系统加油量', type:'number'},
				 {caption:'差值', type:'number'}				
				];
	conf.rows = [];
	
	var start_date = req.query.begintime,
		end_date = req.query.endtime,
		car_list = req.query.carlist;
		
	oil_ticket.get_ticket_detail(start_date, end_date, car_list, function(err, result){
		if(err){
			throw err;
		}
		for(var i in result){			
			var item = result[i];
			var _info = '';
			if(item.online == 0){			
				_info = '设备异常';
			}else{
				if(item.oil_self>0 && item.oil_sys>0 && Math.abs(item.oil_diff) > 15){
					_info = '多报油票';
				}

				if(item.oil_self>0 && item.oil_sys==0){
					_info = '虚报油票';
				}

				if(item.oil_self == 0 && item.oil_sys>15){
					_info = '漏输油票';
				}
			}		
			
			var row = [];
			row.push(item.carnumber);
			row.push(item.createdate);	
			row.push(_info);				
			row.push(item.oil_self);
			row.push(item.oil_sys);
			row.push(item.oil_diff);

			conf.rows.push(row)
		}

		var result = nodeExcel.execute(conf);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "oil_ticket.xlsx");
		res.end(result, 'binary');
	})
});

module.exports = router;
