var express = require('express');
var router = express.Router();
var date = require('date-utils');
var gps_last = require('../models/gps_last');

/* GET home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('upgrade', { start_date: start_date, end_date: end_date });
});


module.exports = router;