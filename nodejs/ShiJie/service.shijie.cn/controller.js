﻿var member = require('./routes/member');

exports.init_route = function(app) {
    console.log('init_route begin');


    app.use('/member', member);
    app.use('/orders', require('./routes/orders'))


    console.log('init_route end');
};
