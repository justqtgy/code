var db = require('./mssql_helper');
var util = require('util');

function stat_online() {

};

module.exports = stat_online

stat_online.get_count = function(args, callback) {
    db.execSQL('select count(*) as total from stat_online', function(err, result) {
        if (err) {
            console.log(err);
            throw err
        }

        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }

        callback(err, total);
    });
}

stat_online.get_list = function(args, callback) {
    var pageIndex = parseInt(args.pageIndex);
    var pageSize = parseInt(args.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by id desc) as rid  from stat_online)  " +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, start_id, end_id);
    console.log(sql);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err
        }

        callback(err, rows);
    });
}

stat_online.get_info = function(agrs, callback) {
    var sql = "select top 1 * from stat_online where CreateDate ='%s' and GprsID = '%s'";
    sql = util.format(sql, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err
        }

        callback(err, rows);
    });
}

stat_online.add_record = function(agrs, callback) {
    var sql = "insert into stat_online values('%s', '%s', '%s', '%s', '%s', %s);SELECT @@IDENTITY as ID;";
    sql = util.format(sql, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err
        }

        callback(err, result);
    });
}

stat_online.update_record = function(agrs, callback) {
    var sql = "update stat_online set UpdateTime = '%s', Online = %s where CreateDate = '%s' and GprsID='%s'";
    sql = util.format(sql, args.update_time, args.online, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err
        }

        callback(err, result);
    });
}