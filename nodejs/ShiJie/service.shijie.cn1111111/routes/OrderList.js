var express = require('express');
var router = express.Router();

var orderlist = require('../models/OrderList');

router.get('/', function(req, res, next) {
	res.render('orderlist');
});

var get_count = function(req, res, next) {
	orderlist.get_count(function(err, result){
		if(err){
			return next(err);
		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) {
	var args = req.body;
	orderlist.get_list(args, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, total : req.total, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	orderlist.get_single(id, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, rows : result });
	});
});

router.post('/', function(req, res, next) {
	var args = req.body
	orderlist.add(args, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1 });
	});
});

router.delete('/', function(req, res, next) {
	var id = req.body.id;
	orderlist.delete(id, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1 });
	});
});

module.exports = router;
