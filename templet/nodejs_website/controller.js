
function controller(app){
	console.log('init_route begin');	
	
	app.use('/', require('./routes/index'));
	app.use('/users', require('./routes/users'));
	app.use('/testdb', require('./routes/testdb'));
	
	console.log('init_route end');
}

exports.controller = controller