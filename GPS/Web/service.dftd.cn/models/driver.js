var db = require('../models/mssql_helper');
var util = require('util');

function driver(model) {

}

module.exports = driver;

driver.get_count = function(callback) {
    db.execSQL('select count(*) as total from gserver_data.dbo.driver', function(err, result) {
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

driver.get_list = function(pageIndex, pageSize, callback) {
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = ";with t as (select *, row_number() over(order by addtime desc) as rid from gserver_data.dbo.driver) select * from t where rid between " + start_id + " and " + end_id;
    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

driver.get_single = function(account, callback) {
    var sql = "select * from gserver_data.dbo.driver where UserAccount='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows, fileds) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

driver.add = function(account, password, callback) {
    var params = [
        { name: "CarNumber", value: account },
        { name: "Password", value: password }
    ];

    db.execSP("gserver_data.dbo.cp_driver_add", params, function(err, recordsets, returnValue) {
        if (err) {
            return callback(err);
        }
        callback(err, returnValue);
    });
}