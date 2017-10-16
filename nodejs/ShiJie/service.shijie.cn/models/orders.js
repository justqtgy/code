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

orders.isExists = function(userID, callback) {
    var sql = "select count(*) as number from Orders where MemberID = " + userID;
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        var counts = 0;
        if (rows.length > 0) {
            counts = rows[0].number;
        }
        callback(err, counts);
    });
};

/**
 * Status:0，下单，1确认，-1取消
 */
orders.add = function(params, callback) {
    var sql = "insert into Orders(OrderNo,MemberID,Number,Price,AddTime,Status) values('%s','%s','%s','%s',GETDATE(), 0)";
    sql = util.format(sql, params.OrderNo, params.MemberID, params.Number, params.Price);
    console.log('insert orders sql = ', sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.update = function(params, callback) {
    var sql = "update Orders set OrderNo='%s', MemberID='%s', Number='%s', Price='%s', Status='%s' where id = '%s'";
    sql = util.format(sql, params.OrderNo, params.MemberID, params.Number, params.Price, params.Status, params.ID);
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