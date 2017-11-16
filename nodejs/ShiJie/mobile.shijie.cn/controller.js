var member = require('./routes/member');
var news = require('./routes/news');

exports.init_route = function(app) {
    console.log('init_route begin');
    
    app.use('/member', member);
    app.use('/news', news);
    app.use('/orders', require('./routes/orders'));
    app.use('/orders_log', require('./routes/orders_log'));
    app.use('/sms', require('./routes/sms'));

    console.log('init_route end');
}