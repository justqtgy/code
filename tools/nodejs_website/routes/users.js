var express = require('express');
var router = express.Router();

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/


var cb0 = function (req, res, next) {
  console.log('start users');
  next();
}


router.get('/', [cb0], function (req, res, next) {
  console.log('response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.render('users',{message : 'hello everyone'});
});

module.exports = router;
