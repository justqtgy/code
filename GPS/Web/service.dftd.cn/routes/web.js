var express = require('express');
var router = express.Router();

/* GET web home page. */
router.get('/', function(req, res, next) {
  res.render('web/index');
});

router.get('/index', function(req, res, next) {
  res.render('web/index');
});

module.exports = router;
