/**
 * 
 */
var express = require('express');
var router = express.Router();
var user_role = require('../models/user_role');

router.get('/', async function(req, res, next) {
    res.send('user_role');
});

router.get('/single', async function(req, res, next) {
    logger.info('req param =>', req.param);

    try {
        let id = req.param.id;
        let result = await user_role.get_single(id);
        res.send({ ok: 1, result: result });
    } catch (error) {
        logger.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.get('/list', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let count = await user_role.get_count(args);
        let result = await user_role.get_list(args);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logger.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.post('/add', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);
    try {        
        let result = await user_role.add(args);
        //res.send({ok : 1, result: result});
        res.send({ ok: 1, result: result.insertId });
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});

router.post('/set', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let result = await user_role.update(args);
        res.send({ok : 1, result: result});
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});


router.post('/delete', async function(req, res, next) {
    let args = req.param;
    logger.info('req param =>', args);

    try {
        let result = await user_role.delete(args);
        res.send({ ok: 1, result: result });
    } catch (error) {
        res.send({ ok: 0, msg: error });
    }
});

module.exports = router;