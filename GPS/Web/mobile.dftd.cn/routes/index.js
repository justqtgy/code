var express = require('express');
var router = express.Router();
var users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/m_b_index', function(req, res, next) {
  var member = req.cookies.member;
  if(member.boss > 0){
      res.render('mobile/m_b_index', { title: 'dftd' });
  }      
  else{
      res.redirect('/users/login?url=/m_d_index');
  }
      
});

router.get('/m_d_index', function(req, res, next) {
  var member = req.cookies.member;
  if(member.boss > 0)
      res.redirect('/users/login?url=/m_b_index');
  else
      res.render('mobile/m_d_index', { title: 'dftd' });
});

router.get('/m_maintenance', function(req, res, next) {
  res.send('开发中....');
});


router.get('/group', function(req, res, next) {
  res.render('control/_group', { title: 'dftd' });
});

module.exports = router;
