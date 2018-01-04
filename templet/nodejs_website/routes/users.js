var express = require('express');
var router = express.Router();
var utils = require('utility');
var MSG = require('../config/tips');
var users = require('../models/users');

router.get('/', async function(req, res, next) {
    res.send('users');
});

router.get('/single', async function(req, res, next) {
    logHeper.info('req param =>', req.param);

    try {
        let id = req.param.id;
        let result = await users.get_single(id);
        res.send({ ok: 1, result: result });
    } catch (error) {
        logHeper.error('error =>', req.param);
        res.send({ ok: 0, msg: error });
    }
});

router.get('/list', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let count = await users.get_count(args);
        let result = await users.get_list(args);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logHeper.error('error =>', req.param);
        res.send({ ok: 0, msg: error });
    }
});

router.post('/add', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);
    try {        
        let result = await users.add(args);
        //res.send({ok : 1, result: result});
        res.send({ ok: 1, result: result.insertId });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

router.post('/set', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let result = await users.add(args);
        res.send({ok : 1, result: result});
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

router.post('/delete', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let result = await users.delete(args);
        res.send({ ok: 1, result: result });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

router.post('/password', async function(req, res, next){
    let args = req.param;
    logHeper.info('req param = >', args);

    try{
        let result = await users.change_password(args);
        res.send({ok:1, result: result});
    } 
    catch(error){
        logHeper.error('error => ', error);
        res.send({ok:0, msg: error});
    }
});

router.post('/login', async function(req, res, next){
    let args = req.param;
    logHeper.info('req param = >', args);
    try{
        let result = await users.get_single(args.accout);
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
        logHeper.error('error => ', error);
        res.send({ok:0, msg: error});
    }
});

router.post('/logout', async function(req, res, next){
    let args = req.param;
    logHeper.info('req param = >', args);
    res.clearCookie("__user");
    res.redirect('/users/login');      
});

router.get('/check_login', function(req, res) {
    if (req.cookies.__user) {
        var member = req.cookies.__user;
        res.send({ member: member });
    }
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
