/*
var Member = require('./routes/Member');
var OrderList = require('./routes/OrderList');
var OrderLog = require('./routes/OrderLog');
var SMS = require('./routes/SMS');
*/

exports.init_route=function(app){
	console.log('init_route begin');
	app.use('/Member', require('./routes/Member'));
	app.use('/OrderList', require('./routes/OrderList'));
	app.use('/OrderLog', require('./routes/OrderLog'));
	app.use('/SMS', require('./routes/SMS'));
	console.log('init_route end');
}
