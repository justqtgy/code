var express = require('express');
var router = express.Router();
var moment = require('moment');
var last = require('../models/last');

router.get('/', function(req, res, next) {
	last.get_list(function(err, result){
		if(err){
			res.render('last', { result : null });
			return;
		}
		res.render('last', {result : result} );
	});
});

router.get('/list', function(req, res, next) {
	last.get_list(function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, rows : result });
	});
});

router.get('/single', function(req, res, next) {
	var id = req.query.id;
	last.get_single(id, function(err, result){
		if(err){
			res.send({ ok : 0, msg : err });
			return;
		}
		res.send({ ok : 1, rows : result });
	});
});

module.exports = router;
