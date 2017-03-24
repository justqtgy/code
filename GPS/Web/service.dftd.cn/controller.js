var admin = require('./routes/admin');
var game  = require('./routes/game');
var web   = require('./routes/web');

exports.init_route=function(app){
	console.log('init_route begin');
	
	app.use('/admin', admin);
	app.use('/game', game);
	app.use('/web', web);

	console.log('init_route end');
}
