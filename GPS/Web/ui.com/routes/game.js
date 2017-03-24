var express = require('express');
var router = express.Router();

/* GET game home page. */
router.get('/', function(req, res, next) {
  res.render('game/index');
});

router.get('/index', function(req, res, next) {
  res.render('game/index');
});

module.exports = router;
