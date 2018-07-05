var util = require('util');
var db = require('./db');

function sms(model){
	this.id = model.id;
	this.memberid = model.memberid;
	this.mobile = model.mobile;
	this.content = model.content;
	this.addtime = model.addtime;
}

module.exports = sms

sms.get_count = function(params, callback){
	var sql = "select count(*) as total from sms";
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}
		callback(err, total);
	});
};

sms.get_list = function(params, callback){
	var pageIndex = parseInt(params.pageIndex);
	var pageSize = parseInt(params.pageSize);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM sms \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
	sql = util.format(sql, iBeginID, iEndID);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err);
		}
		callback(err, rows);
	});
};

sms.get_single = function(id,callback){
	var sql = "select * from sms where ID = %s";
	sql = util.format(sql, id);
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err)
		}
		callback(err, rows);
	});
};

sms.add = function(params, callback){
	var sql = "insert into sms(MemberID,Mobile,Content,AddTime) values('%s','%s','%s','%s')";
	sql = util.format(sql, params.MemberID,params.Mobile,params.Content,params.AddTime);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

sms.update = function(params, callback){
	var sql = "update sms set MemberID='%s', Mobile='%s', Content='%s', AddTime='%s' where id = '%s'";
	sql = util.format(sql, params.MemberID, params.Mobile, params.Content, params.AddTime,params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

sms.delete = function(params,callback){
	var sql = "delete from sms where ID = '%s'";
	sql = util.format(sql, params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};
