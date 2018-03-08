const mysql = require('mysql');

exports.sql_escape = function sql_escape(args){
    for(let key in args){
        args[key] = mysql.escape(args[key]);
    }
    return args
}


 