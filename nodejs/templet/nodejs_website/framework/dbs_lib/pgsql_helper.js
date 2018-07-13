var pg = require('pg');

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

// function pgsql_helper(dbconfig){
//     this.config = dbconfig;
// }

// pgsql_helper.prototype.exec = async function(sql, params){    
//     try{
//         var pool = new pg.Pool(config);
//         var connect = await pool.connect();
//         var result = await connect.query(sql, params);
//         connect.release();
//         return result;
//     }
//     catch(error){
//         throw error;
//     }
// }

class pgsql_helper{
    constructor(dbconfig){
        this.config = dbconfig;
    }

    async exec(sql, params){
        logger.info('sql =>', sql, params);
        try{
            var pool = new pg.Pool(this.config);
            var connect = await pool.connect();
            var result = await connect.query(sql, params);
            connect.release();
            return result;
        }
        catch(error){
            throw error;
        }
    }
}

module.exports = pgsql_helper;