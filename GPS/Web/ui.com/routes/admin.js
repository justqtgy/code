var express = require('express');
var router = express.Router();
var admin = require('../models/admin');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index');
});

router.get('/index', function(req, res, next) {
  res.render('admin/index');
});

var get_count = function(req, res, next) {
	admin.get_count(function(err, result){
		if(err){
			throw err;
		}
		req.total = result;
		next();
	});
};

router.get('/list', [get_count], function(req, res, next) {   
    var params = req.query;
    admin.get_list(params, function(err, rows){
        if(err){
            throw err;
        }

        console.log('get result ============>', rows);
        res.send({ ok : 1, total : req.total, rows : rows });
    });
});

module.exports = router;
