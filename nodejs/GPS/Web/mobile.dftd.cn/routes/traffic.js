var express = require('express');
var router = express.Router();
var date = require('date-utils')
var vehicle = require('../models/vehicle');
var traffic = require('../models/traffic');
 
router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
		end_date = new Date().toFormat('YYYY-MM-DD  HH24:MI:SS');
	res.render('traffic', {start_date:start_date, end_date:end_date});
});

router.get('/m_index', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
		end_date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
	res.render('mobile/m_traffic', {start_date:start_date, end_date:end_date});
});

router.post('/list', function(req, res, next) { 
	console.log('get traffic data =======>', req.body)
	var begintime = req.body.begintime || Date.today();
	var endtime = req.body.endtime || Date.today();
	var carlist = req.body.carlist;
    traffic.get_list(begintime, endtime, carlist, function(err, result){
		if(err){
			throw err;
		}
		console.log('get traffic result ======>', result);
		res.send({ ok : 0,  rows : result });
	});
});

module.exports = router;
