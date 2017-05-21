var db = require('./framework/db_gserver_data');
var util = require('util');

function users(model){
	 
};

module.exports = users

users.get_info = function(account,callback){
    var sql = " select id, [监控员名称] as useraccount, [监控员密码] as password, 1 as boss, user_type from gserver_synth.dbo.[user] where [监控员名称]='%s' \
				union all \
				select id, useraccount, password, 0 as boss, 0 as user_type from driver where useraccount='%s'";
    sql = util.format(sql, account, account);
	
	db.execSQL(sql, function(err, rows){
		if(err){
			throw err
		}
		callback(err, rows);
	});
}