var mssql = require('mssql');
var config = require('../config/config');

module.exports.execSQL = function(sql, cb){
	mssql.connect(config).then(function() {		
		new mssql.Request().query(sql).then(function(result){
				cb(null, result)
			}).catch(function(err) {
				console.log(err);
				cb(err, '')
			});

	}).catch(function(err) {
		console.log(err);
		cb(err, '')
	});	
}

