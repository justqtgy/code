var db = require('./mssql_helper');
var util = require('util');

function gps_distance() {

};

module.exports = gps_distance

gps_distance.get_count = function(callback) {
    db.execSQL('select count(*) as total from gps_distance', function(err, result) {
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

gps_distance.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by id desc) as rid  from gps_distance)  " +
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