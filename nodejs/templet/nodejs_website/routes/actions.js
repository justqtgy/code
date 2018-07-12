/**
 * 
 */
var express = require('express');
var router = express.Router();
var actions = require('../models/actions');

router.get('/', async function(req, res, next) {
    res.render('actions');
});

router.get('/single', async function(req, res, next) {
    logHelper.info('req param =>', req.param);

    try {
        let id = req.param.id;
        let result = await actions.get_single(id);
        res.send({ ok: 1, result: result });
    } catch (error) {
        logHelper.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.get('/list', async function(req, res, next) {
    let args = req.param;
    logHelper.info('req param =>', args);

    try {
        let count = await actions.get_count(args);
        let result = await actions.get_list(args);
        res.send({ ok: 1, result: result, count : count });
    } catch (error) {
        logHelper.error('error =>', req.param);
        res.send({ ok: 0, msg : error });
    }
});

router.post('/add', async function(req, res, next) {
    let args = req.param;
    logHelper.info('req param =>', args);
    try {        
        let result = await actions.add(args);
        //res.send({ok : 1, result: result});
        res.send({ ok: 1, result: result.insertId });
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});

router.post('/set', async function(req, res, next) {
    let args = req.param;
    logHelper.info('req param =>', args);

    try {
        let result = await actions.add(args);
        res.send({ok : 1, result: result});
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});


router.post('/delete', async function(req, res, next) {
    let args = req.param;
    logHelper.info('req param =>', args);

    try {
        let result = await actions.delete(args);
        res.send({ ok: 1, result: result });
    } catch (error) {
        res.send({ ok: 0, msg : error });
    }
});

module.exports = router;