var util = require('util');
var utils = require('utility');
var db = require('./db');

function gps_info(model) {

}

module.exports = gps_info;

gps_info.get_count = function (callback) {
    var sql = "select count(*) as total from gps_info";
    db.execSQL(sql, function (err, result) {
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

gps_info.get_pages = function (params, callback) {
    var pageIndex = parseInt(params.page);
    var pageSize = parseInt(params.size);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY id) AS R_Number,* \
			FROM gps_info \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, start_id, end_id);

    db.execSQL(sql, function (err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

gps_info.get_list = function (callback) {
    var sql = "select * from gps_info";

    db.execSQL(sql, function (err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

gps_info.get_single = function (id, callback) {
    var sql = "select * from gps_info where id = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function (err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

gps_info.add = function (params, callback) {
    var status = params.status ? 1 : 0;
    var sql = "insert into gps_info(gps_id,gps_name,address,remark,status, type) values('%s','%s','%s','%s', %s, %s);select @@identity as ID;";
    sql = util.format(sql, params.gps_id, params.gps_name, params.address, params.remark, status, params.type);

    db.execSQL(sql, function (err, result) {
        if (err) {
            return callback(err)
        }
        callback(err, result);
    });
};

gps_info.update = function (params, callback) {
    var status = params.status ? 1 : 0;
    var sql = "update gps_info set gps_id='%s', gps_name='%s', address='%s', remark='%s', status='%s', type=%s where id = '%s'";
    sql = util.format(sql, params.gps_id, params.gps_name, params.address, params.remark, status, params.type, params.id);

    db.execSQL(sql, function (err, result) {
        if (err) {
            return callback(err)
        }
        callback(err, result);
    });
};