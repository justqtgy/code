var mssql = require('mssql');
var config = require('../../config/gserver_synth_config');

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

module.exports.execSP = function(spname, params, cb){console.log(params);

	mssql.connect(config, function(err){
		if(err){
			console.log(err);
			cb(err, '')
		}

		var request = new mssql.Request();
		request.verbose = true;
		for(var p in params){
			request.input(params[p].name, params[p].value);
		}

		request.execute(spname, function(err, recordsets, returnValue){
			cb(err, recordsets, returnValue)
		})
	})
}

