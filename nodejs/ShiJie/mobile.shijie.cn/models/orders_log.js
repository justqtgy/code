var util = require('util');
var db = require('./db');

function orders_log(model) {
    this.id = model.id;
    this.memberid = model.memberid;
    this.content = model.content;
    this.status = model.status;
    this.addtime = model.addtime;
}

module.exports = orders_log

orders_log.get_count = function(params, callback) {
    var sql = "select count(*) as total from OrdersLog";
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        callback(err, total);
    });
};

orders_log.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM OrdersLog \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, start_id, end_id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

orders_log.get_single = function(id, callback) {
    var sql = "select * from OrdersLog where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

orders_log.add = function(params, callback) {
    var sql = "insert into OrdersLog(MemberID,Content,Status,AddTime) values('%s','%s','%s','%s')";
    sql = util.format(sql, params.memberid, params.content, params.status, params.add_time);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

orders_log.update = function(params, callback) {
    var sql = "update OrdersLog set MemberID='%s', Content='%s', Status='%s', AddTime='%s' where id = '%s'";
    sql = util.format(sql, params.memberid, params.content, params.status, params.add_time, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

orders_log.delete = function(params, callback) {
    var sql = "delete from OrdersLog where ID = '%s'";
    sql = util.format(sql, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};