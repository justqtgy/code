var gps_alarm = require('./routes/gps_alarm');
var gps_point = require('./routes/gps_point');
var gps_oil_data = require('./routes/gps_oil_data');
var gps_oil_add = require('./routes/gps_oil_add');
var gps_oil_leak = require('./routes/gps_oil_leak');
var gps_oil_ticket = require('./routes/gps_oil_ticket');
var gps_traffic = require('./routes/gps_traffic');
var gps_last = require('./routes/gps_last');
var group_vehicle = require('./routes/group_vehicle');
var member = require('./routes/member');
var news = require('./routes/news');
var cost_check=require('./routes/cost_check');
var gps_quality=require('./routes/gps_quality');
var gps_section=require('./routes/gps_section');
var charge=require('./routes/charge');
var gps_rubbish=require('./routes/gps_rubbish');

exports.init_route = function(app) {
    console.log('init_route begin');
    app.use('/gps_alarm', gps_alarm);
    app.use('/gps_point', gps_point);
    app.use('/gps_oil_data', gps_oil_data);
    app.use('/gps_oil_add', gps_oil_add);
    app.use('/gps_oil_leak', gps_oil_leak);
    app.use('/gps_oil_ticket', gps_oil_ticket);
    app.use('/gps_traffic', gps_traffic);
    app.use('/gps_last', gps_last);
    app.use('/group_vehicle', group_vehicle);
    app.use('/member', member);
    app.use('/news', news);
    app.use('/cost_check',cost_check);
    app.use('/gps_quality',gps_quality);
    app.use('/gps_section',gps_section);
	app.use('/charge',charge);
	app.use('/gps_rubbish',gps_rubbish);

    console.log('init_route end');
}