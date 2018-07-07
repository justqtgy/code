var util = require('util');
var db = require('./db');

function capacity(model) {

}

module.exports = capacity

capacity.get_count = function(params, callback) {
    var sql = `select count(*) as total from gps_capacity 
			where add_time>='%s' and add_time<dateadd(day, 1, '%s')`;
	sql = util.format(sql, params.begin_time, params.end_time);
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

capacity.get_pages = function(params, callback) {
    var pageIndex = parseInt(params.page);
	var pageSize = parseInt(params.size);
	var start_id = (pageIndex - 1) * pageSize + 1;
	var end_id = pageIndex * pageSize;
    var sql = `
		;WITH t AS( 
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* 
            FROM gps_capacity 
            where add_time>='%s' and add_time<dateadd(day, 1, '%s')
		) 
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s `;
    sql = util.format(sql, params.begin_time, params.end_time, start_id, end_id);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

capacity.get_single = function(id, callback) {
    var sql = "select * from gps_capacity where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err)
        }
        callback(err, rows);
    });
};
