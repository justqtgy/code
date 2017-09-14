// ﻿var member = require('./routes/member');
// var orders = require('./routes/orders');

exports.init_route = function(app) {
    console.log('init_route begin');


    app.use('/member', require('./routes/member'));
    app.use('/orders', require('./routes/orders'));


    console.log('init_route end');
};
