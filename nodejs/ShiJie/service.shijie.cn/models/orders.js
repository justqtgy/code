var util = require('util');
var db = require('./db');

function orders(model) {

}

module.exports = orders

orders.get_count = function(params, callback) {
    var sql = "select count(*) as total from Orders";
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        callback(err, total);
    });
};

orders.get_pages = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM Orders \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

orders.get_single = function(id, callback) {
    var sql = "select * from Orders where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err)
        }
        callback(err, rows);
    });
};

orders.add = function(params, callback) {
    var sql = "insert into Orders(OrderNo,MemberID,Number,Price,AddTime,Status) values('%s','%s','%s','%s','%s','%s')";
    sql = util.format(sql, params.OrderNo, params.MemberID, params.Number, params.Price, params.AddTime, params.Status);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.update = function(params, callback) {
    var sql = "update Orders set OrderNo='%s', MemberID='%s', Number='%s', Price='%s', AddTime='%s', Status='%s' where id = '%s'";
    sql = util.format(sql, params.OrderNo, params.MemberID, params.Number, params.Price, params.AddTime, params.Status, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.delete = function(params, callback) {
    var sql = "delete from Orders where ID = '%s'";
    sql = util.format(sql, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};