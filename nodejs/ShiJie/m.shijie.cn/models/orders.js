var util = require('util');
var db = require('./db');

function orders(model) {

}

module.exports = orders;

orders.get_count = function(params, callback) {
    var sql = "select count(*) as total from Orders";
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
    var beginID = (pageIndex - 1) * pageSize + 1;
    var endID = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM Orders \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, beginID, endID);
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
    var sql = "insert into Orders(OrderNo,MemberID,Number,Price,AddTime,Status) values('0','%s','%s','%s',GETDATE(), 0); SELECT @@IDENTITY as ID;";
    sql = util.format(sql, params.member_id, params.number, params.price);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.changeStatus = function(params, callback) {
    var sql = "update Orders set Status='%s' where id = '%s'";
    sql = util.format(sql, params.order_no, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.createOrderNo = function(params, callback) {
    var sql = "update Orders set OrderNo='%s' where id = '%s'";
    sql = util.format(sql, params.order_no, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

orders.delete = function(id, callback) {
    var sql = "update Orders set Status=-1 where id = '%s'";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};