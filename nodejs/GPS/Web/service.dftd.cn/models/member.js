var db = require('../models/mssql_helper');
var util = require('util');

function member(model) {

}

module.exports = member;

member.get_info = function(account, callback) {
    var sql = " select id, [监控员名称] as useraccount, [监控员密码] as password, 1 as boss, user_type from gserver_synth.dbo.[user] where [监控员名称]='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};