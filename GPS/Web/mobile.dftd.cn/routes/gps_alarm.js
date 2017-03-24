var express = require('express');
var router = express.Router();

var gps_alarm = require('../models/gps_alarm');

router.get('/', function(req, res, next) {
	var start_date = new Date().toFormat('YYYY-MM-DD'),
		end_date = new Date().toFormat('YYYY-MM-DD');
	res.render('gps_alarm', {start_date:start_date, end_date:end_date});
});

var get_count = function(req, res, next) {
    var params = req.query;
	gps_alarm.get_count(params, function(err, result){
		if(err){
			throw err;

		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) {
    var params = req.query;
    console.log(req.query);
	gps_alarm.get_list(params, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0, total : req.total, rows : result });
	});
});

module.exports = router;
