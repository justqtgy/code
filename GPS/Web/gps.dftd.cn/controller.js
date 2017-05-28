var gps_data = require('./routes/gps_data');
var gps_quality = require('./routes/gps_quality');
var oil_vhc_dv = require('./routes/oil_vhc_dv');
var vhc_online = require('./routes/vhc_online');
var oil_ticket = require('./routes/oil_ticket');
var vehicle_status = require('./routes/vehicle_status');
var daily_report = require('./routes/daily_report');
var driver = require('./routes/driver');
var driver_vhc = require('./routes/driver_vhc');
var vehicle = require('./routes/vehicle');
var gps_alarm = require('./routes/gps_alarm');
var traffic = require('./routes/traffic');
var gps_oil = require('./routes/gps_oil');
var gps_point = require('./routes/gps_point');

exports.init_route = function(app) {
    console.log('init_route begin');
    app.use('/oil_vhc_dv', oil_vhc_dv);
    app.use('/vhc_online', vhc_online);
    app.use('/gps_data', gps_data);
    app.use('/gps_quality', gps_quality);
    app.use('/oil_ticket', oil_ticket);
    app.use('/vehicle_status', vehicle_status);
    app.use('/daily_report', daily_report);
    app.use('/driver', driver);
    app.use('/driver_vhc', driver_vhc);
    app.use('/vehicle', vehicle);
    app.use('/gps_alarm', gps_alarm);
    app.use('/traffic', traffic);
    app.use('/gps_oil', gps_oil);
    app.use('/gps_point', gps_point);

    console.log('init_route end');
}