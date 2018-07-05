var express = require('express');
var router = express.Router();
var power = require('../models/power');

router.get('/', function(req, res, next) {
	res.render('power');
});

var get_count = function(req, res, next) {
	power.get_count(function(err, result){
		if(err){
			return next(err);
		}
		req.total = result;
		next();
	});
};

router.get('/pages', [get_count], function(req, res, next) {
	var args = req.body;
	power.get_pages(args, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	power.get_single(id, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, rows : result });
	});
});

module.exports = router;
