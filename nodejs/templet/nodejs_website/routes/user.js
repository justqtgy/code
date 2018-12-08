var express = require('express');
var router = express.Router();
var utils = require('utility');
var MSG = require('../config/tips');
var user = require('../models/user');

//用户管理首页
router.get('/', async function(req, res, next) {
    res.render('user');
});

//登录
router.get('/login', async function(req, res, next) {
    res.render('login');
});

//获取用户信息
router.get('/single', async function(req, res, next) {
    logger.info('req param =>', req.param);

    try {
        let id = req.param.id;
        let result = await user.get_single(id);
        res.send({ ok: 1, result: result });
    } catch (error) {
        logger.error('error =>', req.param);
        res.send({ ok: 0, msg: error });
    }
});

//获取用户列表
router.get('/list', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let count = await user.get_count(args);
        let result = await user.get_list(args);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logger.error('error =>', req.param);
        res.send({ ok: 0, msg: error });
    }
});

//添加用户
router.post('/add', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);
    try {        
        let result = await user.add(args);
        //res.send({ok : 1, result: result});
        res.send({ ok: 1, result: result.insertId });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

//修改用户信息
router.post('/set', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let result = await user.add(args);
        res.send({ok : 1, result: result});
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

//删除用户信息
router.post('/delete', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let result = await user.delete(args);
        res.send({ ok: 1, result: result });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

//修改密码页面
router.get('/password', (req, res, next)=>{
    res.render('/password');
});

//修改密码
router.post('/password', async function(req, res, next){
    let args = req.param;
    logger.info('req param = >', args);

    try{
        let result = await user.change_password(args);
        res.send({ok:1, result: result});
    } 
    catch(error){
        logger.error('error => ', error);
        res.send({ok:0, msg: error});
    }
});

//登录
router.post('/login', async function(req, res, next){
    let args = req.body;
    logger.info('req param = >', args);
    try{
        let result = await user.get_single(args.username);
        if(!result){
            res.send({ok:0, msg:MSG.EMPTY_ACCOUNT})
            return;
        }

        let userid = result[0].ID;
        let account = result[0].account; 
        let isAdmin = 1;//result[0].IsAdmin ? 1 : 0;
        let password = args.password;
        password = utils.md5(account.toLowerCase() + '&' + password);

        if(password != result[0].password){
            res.send({ok:0, msg:MSG.ERROR_PASSWORD});
            return;
        }

        var __user = { userid: userid, account: account, isadmin: isAdmin };
        res.cookie('__user', __user, { maxAge: 3600000, httpOnly: true, path: '/' });
        res.send({ok:1});
    }
    catch(error){
        logger.error('error => ', error);
        res.send({ok:0, msg: error});
    }
});

//登出
router.get('/logout', async function(req, res, next){
    let args = req.param;
    logger.info('req param = >', args);
    res.clearCookie("__user");
    res.redirect('/user/login');      
});

//检查用户是否登录
router.get('/check_login', function(req, res) {
    if (req.cookies.__user) {
        var member = req.cookies.__user;
        res.send({ member: member });
    }
});













var cb0 = function (req, res, next) {
  console.log('start user');
  next();
}


router.get('/', [cb0], function (req, res, next) {
  console.log('response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.render('user',{message : 'hello everyone'});
});

module.exports = router;
