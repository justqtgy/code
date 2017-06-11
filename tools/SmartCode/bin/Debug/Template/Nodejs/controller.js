
var index = require('./routes/index');
var users = require('./routes/users');
var testdb = require('./routes/testdb');

exports.init_route=function(app){
	console.log('init_route begin');	
	
	app.use('/', index);
	app.use('/users', users);
	app.use('/testdb', testdb);
	
	console.log('init_route end');
}
