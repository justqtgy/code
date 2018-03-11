var express = require('express');
var router = express.Router();
var moment = require('moment');
var logs = require('../models/logs');

router.get('/', function(req, res, next){
    let start_date = moment().subtract(10, 'days').format('YYYY-MM-DD'),
        end_date = moment().format('YYYY-MM-DD');
    res.render('logs', { start_date: start_date, end_date: end_date });
});

router.get('/pages', async function(req, res, next){
    let args = req.query;
    logHeper.info('req param =>', args);

    try {
        let count = 100//await logs.get_count(args);
        let result = await logs.get_pages(args);
        console.log('result=============>', result);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logHeper.error('error =>', error);
        res.send({ ok: 0, msg : error });
    }
});

module.exports = router;