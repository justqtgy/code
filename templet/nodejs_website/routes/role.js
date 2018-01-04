var express = require('express');
var router = express.Router();
var role = require('../models/role');

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

router.get('/add', async function(req, res, next){
    try{
        var args = {
            role_name : 'test',
            remark : 'test'
        }
        let result = await role.add(args)
        //res.send({ok : 1, result: result});
        res.send({ok : 1, result: result.insertId});        
    }
    catch(error){
        res.send({ok : 0, error : error});
    }
});

module.exports = router;
