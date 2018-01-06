var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next){
    let start_date = moment().subtract(10, 'days').format('YYYY-MM-DD'),
        end_date = moment().format('YYYY-MM-DD');
    res.render('logs', { start_date: start_date, end_date: end_date });
});

router.get('/pages', function(req, res, next){

});

module.exports = router;