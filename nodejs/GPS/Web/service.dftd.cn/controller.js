var gps_alarm = require('./routes/gps_alarm');
var gps_point = require('./routes/gps_point');
var gps_oil_data = require('./routes/gps_oil_data');
var gps_oil_add = require('./routes/gps_oil_add');
var gps_oil_leak = require('./routes/gps_oil_leak');
var gps_traffic = require('./routes/gps_traffic');
var gps_last = require('./routes/gps_last');
var group = require('./routes/group');
var vehicle = require('./routes/vehicle');
var member = require('./routes/member');
var group_vehicle = require('./routes/group_vehicle');
var group_member = require('./routes/group_member');

exports.init_route = function(app) {
    console.log('init_route begin');

    app.use('/gps_alarm', gps_alarm);
    app.use('/gps_point', gps_point);
    app.use('/gps_oil_data', gps_oil_data);
    app.use('/gps_oil_add', gps_oil_add);
    app.use('/gps_oil_leak', gps_oil_leak);
    app.use('/gps_traffic', gps_traffic);
    app.use('/gps_last', gps_last);
    app.use('/group', group);
    app.use('/vehicle', vehicle);
    app.use('/member', member);
    app.use('/group_vehicle', group_vehicle);
    app.use('/group_member', group_member);

    console.log('init_route end');
};