var util = require('util');
var db = require('./db');

function OrderList(model){
	this.id = model.id;
	this.orderno = model.orderno;
	this.memberid = model.memberid;
	this.number = model.number;
	this.price = model.price;
	this.addtime = model.addtime;
	this.status = model.status;
}

module.exports = OrderList

OrderList.get_count = function(params, callback){
	var sql = "select count(*) as total from OrderList";
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

OrderList.get_list = function(params, callback){
	var pageIndex = parseInt(params.pageIndex);
	var pageSize = parseInt(params.pageSize);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
	var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM OrderList \
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

OrderList.get_single = function(id,callback){
	var sql = "select * from OrderList where ID = %s";
	sql = util.format(sql, id); 
	db.execSQL(sql, function(err, rows){
		if(err){
			return callback(err)
		}
		callback(err, rows);
	});
};

OrderList.add = function(params, callback){
	var sql = "insert into OrderList(OrderNo,MemberID,Number,Price,AddTime,Status) values('%s','%s','%s','%s','%s','%s')";
	sql = util.format(sql, params.OrderNo,params.MemberID,params.Number,params.Price,params.AddTime,params.Status);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

OrderList.update = function(params, callback){
	var sql = "update OrderList set OrderNo='%s', MemberID='%s', Number='%s', Price='%s', AddTime='%s', Status='%s' where id = '%s'";
	sql = util.format(sql, params.OrderNo, params.MemberID, params.Number, params.Price, params.AddTime, params.Status,params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

OrderList.delete = function(params,callback){
	var sql = "delete from OrderList where ID = '%s'";
	sql = util.format(sql, params.ID);
	db.execSQL(sql, function(err, result){
		if(err){
			return callback(err);
		}
		callback(err, result);
	});
};

