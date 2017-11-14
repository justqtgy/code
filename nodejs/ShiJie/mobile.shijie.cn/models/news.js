/**
 *  发布消息
 */
var util = require('util');
var db = require('./db');

function news() {

}

module.exports = news;


news.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from news where addtime >='%s' and addtime<dateadd(day, 1, '%s') ";
    sql = util.format(sql, params.begintime, params.endtime);
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

news.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select*, row_number() over(order by id desc) as rid  " +
        " from news  where addtime >='%s' and addtime<dateadd(day, 1, '%s'))  " +
        " select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}


news.get_single = function(id, callback) {
    var sql = "select * from news where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
}