var db = require('./mssql_helper');
var util = require('util');

function gps_driver(model) {

};

module.exports = gps_driver

gps_driver.get_count = function(callback) {
    db.execSQL('select count(*) as total from driver', function(err, result) {
        if (err) {
            throw err
        }
        var total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        callback(err, total);
    });
}

gps_driver.get_list = function(pageIndex, pageSize, callback) {
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from driver) select * from t where rid between " + start_id + " and " + end_id;
    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            throw err
        }
        callback(err, rows);
    });
}

gps_driver.get_single = function(account, callback) {
    var sql = "select * from driver where UserAccount='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            throw err
        }
        callback(err, rows);
    });
}

gps_driver.add = function(account, password, callback) {
    var params = [
        { name: "CarNumber", value: account },
        { name: "Password", value: password }
    ];

    db.execSP("cp_driver_add", params, function(err, recordsets, returnValue) {
        if (err) {
            throw err
        }
        callback(err, returnValue);
    });
}