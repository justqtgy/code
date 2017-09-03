var util = require('util');
var db = require('./db');

function OrderLog(model){
	this.id = model.id;
	this.memberid = model.memberid;
	this.content = model.content;
	this.status = model.status;
	this.addtime = model.addtime;
}

module.exports = OrderLog

OrderLog.get_count = function(params, callback){
	var sql = "select count(*) as total from OrderLog";
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

OrderLog.get_list = function(params, callback){
	var pageIndex = parseInt(params.pageIndex);
	var pageSize = parseInt(params.pageSize);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM OrderLog \
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

OrderLog.get_single = function(id,callback){
	var sql = "select * from OrderLog where ID = %s";
	sql = util.format(sql, id); 
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err)
		}
		callback(err, rows);
	});
};

OrderLog.add = function(params, callback){
	var sql = "insert into OrderLog(MemberID,Content,Status,AddTime) values('%s','%s','%s','%s')";
	sql = util.format(sql, params.MemberID,params.Content,params.Status,params.AddTime);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

OrderLog.update = function(params, callback){
	var sql = "update OrderLog set MemberID='%s', Content='%s', Status='%s', AddTime='%s' where id = '%s'";
	sql = util.format(sql, params.MemberID, params.Content, params.Status, params.AddTime,params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

OrderLog.delete = function(params,callback){
	var sql = "delete from OrderLog where ID = '%s'";
	sql = util.format(sql, params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

