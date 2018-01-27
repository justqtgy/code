/**
 * 
 */
var express = require('express');
var router = express.Router();
var role = require('../models/role');

router.get('/', async function(req, res, next) {
    res.send('role');
});

router.get('/single', async function(req, res, next) {
    logHeper.info('req param =>', req.param);

    try {
        let id = req.param.id;
        let result = await role.get_single(id);
        res.send({ ok: 1, result: result });
    } catch (error) {
        logHeper.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.get('/list', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let count = await role.get_count(args);
        let result = await role.get_list(args);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logHeper.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.post('/add', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);
    try {        
        let result = await role.add(args);
        //res.send({ok : 1, result: result});
        res.send({ ok: 1, result: result.insertId });
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});

router.post('/set', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let result = await role.add(args);
        res.send({ok : 1, result: result});
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});


router.post('/delete', async function(req, res, next) {
    let args = req.param;
    logHeper.info('req param =>', args);

    try {
        let result = await role.delete(args);
        res.send({ ok: 1, result: result });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

module.exports = router;