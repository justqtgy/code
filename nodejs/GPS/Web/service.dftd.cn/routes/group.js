var express = require('express');
var router = express.Router();
var date = require('date-utils');
var group = require('../models/group');

/* GET group home page. */
router.get('/', function(req, res, next) {
    var start_date = new Date().add({ days: -10 }).toFormat('YYYY-MM-DD'),
        end_date = new Date().toFormat('YYYY-MM-DD');
    res.render('group', { start_date: start_date, end_date: end_date });
});

router.get('/list', function(req, res, next) {
    var args = req.body;
    console.log('==================================', args)
    group.get_list(args, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return res.send({ ok: 0, msg: err });
        }
        console.log(rows)
        res.send({ ok: 1, rows: rows });
    });
});

module.exports = router;