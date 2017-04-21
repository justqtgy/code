var db = require('./mssql_helper');
var util = require('util');

function stat_online() {

};

module.exports = stat_online

stat_online.get_info = function(args, callback) {
    var sql = "select top 1 * from stat_online where CreateDate ='%s' and GprsID = '%s'";
    sql = util.format(sql, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            throw err
        }

        callback(err, rows);
    });
}

stat_online.add_record = function(args, callback) {
    var sql = "insert into stat_online values('%s', '%s', '%s', '%s', '%s', %s);SELECT @@IDENTITY as ID;";
    sql = util.format(sql, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err
        }

        callback(err, result);
    });
}

stat_online.update_record = function(args, callback) {
    var sql = "update stat_online set UpdateTime = '%s', Online = %s where CreateDate = '%s' and GprsID='%s'";
    sql = util.format(sql, args.update_time, args.online, args.create_date, args.gprs_id);

    db.execSQL(sql, function(err, result) {
        if (err) {
            throw err
        }

        callback(err, result);
    });
}