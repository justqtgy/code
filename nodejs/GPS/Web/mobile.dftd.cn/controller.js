
var gps_last = require('./routes/gps_last');


exports.init_route=function(app){
	console.log('init_route begin');
	app.use('/gps_last', gps_last);	 

	console.log('init_route end');
}
