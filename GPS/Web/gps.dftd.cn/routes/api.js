/**
*手机端路由接口
*需要加签名验证
*/

var express = require('express');
var router = express.Router();

var fuel_up = require('../models/oil_ticket');

var char = ['0','1','2','3','4','5','6','7','8','9']

router.get('/', function(req, res, next){
  res.render('api');
});

/**
 *登录接口：账号,密码
 */
router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *注册接口：账号,密码,登录时间
 */
router.post('/regedit', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *短信验证接口：手机号,验证码
 */
router.post('/post_sms', function(req, res, next) {
  res.send('respond with a resource');
});

/**
*随机生成短信数据
*/
function post_random_num(req, res, next){
	var rnd_num = '';
	for(var n=0; n<6; n++){
		var id = Math.floor(Math.random()*10);
		rnd_num += char[id];
	}
	req.rnd_num = rnd_num;
	next();
}
/**
 *短信验证接口：手机号
 *调用：{url}/api/send_sms
 */
router.post('/send_sms', [post_random_num], function(req, res, next) {
	var _num = req.rnd_num;
	/*写入数据库*/
	
	
	res.send({ok : 1, number : _num} );
});


/**
 *加油接口:用于增加司机输入的升数和金额
 */
router.post('/fuel_up', function(req, res, next) {  
  var model = {
		id : req.body.id || 0,
		vehicleid : req.body.vehicleid,
		driverid : req.body.driverid||0,
		number : req.body.number,
		price : req.body.price,
		amount : req.body.amount,
		station : req.body.station,
		fueltime : req.body.fueltime,		
    };
  
	fuel_up.add(model, function(err, result){
		if(err){
			throw err;

		}
		res.send({ ok : 0 });
	});  
});

/**
 *油票接口:查看油票信息
 */
router.post('/oil_ticket', function(req, res, next) {
  res.send('respond with a resource');
});


/**
 *油耗接口:查看一段时间内的用油成本
 */
router.post('/oil_used', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *油箱油量接口:查看油箱剩余的油量
 */
router.post('/oil_rest', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *查询更换机油接口
 */
router.post('/oil_change', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 *查询空气格接口
 */
router.post('/air_cell', function(req, res, next) {
  res.send('respond with a resource');
});




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
