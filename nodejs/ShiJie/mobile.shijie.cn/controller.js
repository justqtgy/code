var member = require('./routes/member');
var news = require('./routes/news');

exports.init_route = function(app) {
    console.log('init_route begin');
    
    app.use('/member', member);
    app.use('/news', news);

    console.log('init_route end');
}