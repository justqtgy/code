exports.init_route = function(app) {
    console.log('init_route begin');

    app.use('/member', require('./routes/member'));
    app.use('/member_stat', require('./routes/member_stat'));
    app.use('/orders', require('./routes/orders'));
    app.use('/orders_log', require('./routes/orders_log'));
    app.use('/sms', require('./routes/sms'));

    console.log('init_route end');
}