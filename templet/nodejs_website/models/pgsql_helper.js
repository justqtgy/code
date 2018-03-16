var pg = require('pg');

var pool;

// 数据库配置
// var config = { 
//     user:"postgres",
//     database:"ghost",
//     password:"123456",
//     port:5432,
    
//     // 扩展属性
//     max:20, // 连接池最大连接数
//     idleTimeoutMillis:3000, // 连接最大空闲时间 3s
// }

function pgsql_helper(config){
    pool = new pg.Pool(config);
}

pgsql_helper.prototype.exec = async function(sql, params){
    var connect = await pool.connect();
    try{
        var result = await connect.query(sql, params);
        connect.release();
        return result;
    }
    catch(error){
        throw error;
    }
}


// // 查询
// pgsql_helper.prototype.exec_sql = function(sql, params){
//     pool.connect(function(err, client, done) {
//         if(err) {
//           return console.error('数据库连接出错', err);
//         }
//         // 简单输出个 Hello World
//         //client.query('SELECT $1::varchar AS OUT', ["Hello World"], function(err, result) {
//         client.query(sql, params, function(err, result) {
//           done();// 释放连接（将其返回给连接池）
//           if(err) {
//             return console.error('查询出错', err);
//           }
//           console.log(result.rows[0].out); //output: Hello World
//         });
//     });    
// }

module.exports = pgsql_helper;