/**
 * 
 */
var util = require('util');
var db = require('../models/mssql_helper');

function gps_oil_add() {

}

module.exports = gps_oil_add;


gps_oil_add.get_count = function(params, callback) {
    console.log(params);
    var sql = " select count(*) as total from (SELECT * FROM GPS_Oil_Add x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Add WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID ) ) y where addtime >='%s' and addtime<dateadd(day, 1, '%s') and vehicleid in (%s)";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList);
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

gps_oil_add.get_list = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;

    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid  from (SELECT * FROM GPS_Oil_Add x WHERE NOT EXISTS ( SELECT * FROM GPS_Oil_Add WHERE AddOil = x.AddOil and PreOil = x.PreOil and ID >x.ID )) y " +
        "where addtime >='%s' and addtime<dateadd(day, 1, '%s')  and vehicleid in (%s))" +
        "select * from t where rid between %s and %s";
    sql = util.format(sql, params.begintime, params.endtime, params.vehicleList, start_id, end_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }

        callback(err, rows);
    });
}