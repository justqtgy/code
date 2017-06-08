var express = require('express');
var router = express.Router();

// 特针对于该路由的中间件
router.use((req, res, next)=> {
  console.log('Now Time: ', Date.now());
  next();
});
// 定义网站主页的路由
router.get('/', function(req, res) {
	console.log('get home url: ');
  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about', function(req, res) {
	console.log('get about url: ');
  res.send('About birds');
});

module.exports = router;