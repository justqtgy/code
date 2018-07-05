var util = require('util');
var utils = require('utility');
var db = require('./db');

function users(model) {

}

module.exports = users;

users.get_info = function(account, callback) {
    var sql = " select * from users where account='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

users.get_count = function(args, callback) {
    var sql = "select count(*) as total from users";
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

users.get_pages = function(args, callback) {
    var pageIndex = parseInt(args.pageIndex);
    var pageSize = parseInt(args.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM users \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, start_id, end_id);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

users.get_single = function(id, callback) {
    var sql = `select * from users where id = ${id}`;
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

users.add = function(args, callback) {
    args.password = utils.md5(args.account.toLowerCase() + '&123456');    
    args.weixin = '';
    var sql = "insert into users(account,password,user_name,weixin_id, mobile, add_time,status, is_admin) values('%s','%s','%s','%s','%s', '%s', GETDATE(),'%s');select @@identity as ID;";
    sql = util.format(sql, args.account, args.password, args.user_name,  args.weixin, args.mobile, args.status, args.is_admin);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

users.update = function(args, callback) {
    var sql = "update users set account='%s', user_name='%s', weixin_id = '%s', mobile='%s', status='%s' where id = '%s'";
    sql = util.format(sql, args.account, args.true_name, args.weixin, args.mobile, args.status, args.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

users.delete = function(args, callback) {
    var sql = "delete from users where ID = '%s'";
    sql = util.format(sql, args.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

users.change_password = function(args, callback) {
    var sql = "Update dbo.users set Password = '%s' where ID = '%s'";
    sql = util.format(sql, args.password, args.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};