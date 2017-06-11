var db = require('../models/mssql_helper');

var util = require('util');

function member(model) {

}

module.exports = member;

member.get_info = function(account, callback) {
    var sql = " select * from gserver_data.dbo.[member] where Account='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

member.get_count = function(params, callback) {
    var sql = "select count(*) as total from gserver_data.dbo.Member ";
    if (params.account) {
        sql += " WHERE Account like '%" + params.account + "%'";
    }

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
}

member.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var beginID = (pageIndex - 1) * pageSize + 1;
    var endID = pageIndex * pageSize;

    var sql = ";WITH t AS( " +
        "SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* " +
        "FROM gserver_data.dbo.Member ";
    if (params.account) {
        sql += " WHERE Account like '%" + params.account + "%'";
    }
    sql += ") SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, beginID, endID);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

member.get_single = function(id, callback) {
    var sql = "select * from gserver_data.dbo.Member where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
}

member.add = function(params, callback) {
    var sql = "insert into gserver_data.dbo.Member(Account,Password,TrueName,Email,Mobile,AddTime,ExpireTime,IsDelete,WX_OpenID) values('%s','%s','%s','%s','%s',GETDATE(),'%s','%s','%s')";
    sql = util.format(sql, params.account, params.password, params.trueName, params.email, params.mobile, params.expireTime, 0, '');
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

member.update = function(params, callback) {
    var sql = "update gserver_data.dbo.Member set TrueName='%s', Email='%s', Mobile='%s', ExpireTime='%s' where id = '%s'";
    sql = util.format(sql, params.trueName, params.email, params.mobile, params.expireTime, params.id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}

member.delete = function(params, callback) {
    var sql = "Update gserver_data.dbo.Member set IsDelete = 1 where ID = '%s'";
    sql = util.format(sql, params.id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

member.change_password = function(params, callback) {
    var sql = "Update gserver_data.dbo.Member set Password = '%s' where ID = '%s'";
    sql = util.format(sql, params.password, params.id);
    console.log(sql)
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
}