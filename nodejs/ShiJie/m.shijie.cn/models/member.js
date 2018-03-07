var util = require('util');
var utils = require('utility');
var db = require('./db');

function member(model) {

}

module.exports = member;

member.get_info = function(account, callback) {
    var sql = " select * from member where account='%s'";
    sql = util.format(sql, account);

    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

member.get_count = function(params, callback) {
    var sql = "select count(*) as total from Member";
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

member.get_pages = function(params, callback) {
    var pageIndex = parseInt(params.pageIndex);
    var pageSize = parseInt(params.pageSize);
    var start_id = (pageIndex - 1) * pageSize + 1;
    var end_id = pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM Member \
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

member.get_list = function(params, callback) {
    var sql = ";with t as ( \
					select *, 0 as Level from View_Member where ID=%s \
					union all \
					select m.*, Level+1 from View_Member m inner join t on m.ParentID = t.ID \
				) \
                select * from t where Level<=3";
    if(params.keywords){
        sql += " and TrueName= '"+params.keywords+"'";
    }
    sql = util.format(sql, params.member_id);
    
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

member.get_single = function(id, callback) {
    var sql = "select * from Member where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

member.add = function(params, callback) {
    params.password = utils.md5(params.account.toLowerCase() + '&123456');    
    params.weixin = '';
    var sql = "insert into Member(Account,TrueName,IDCard,WeChatID, Mobile, Password, AddTime,Status) values('%s','%s','%s','%s','%s', '%s', GETDATE(),'%s');select @@identity as ID;";
    sql = util.format(sql, params.account, params.true_name, params.idcard, params.weixin, params.mobile, params.password, params.status);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

member.update = function(params, callback) {
    var sql = "update Member set Account='%s', TrueName='%s', IDCard='%s', WeChatID = '%s', Mobile='%s', Status='%s' where id = '%s'";
    sql = util.format(sql, params.account, params.true_name, params.idcard, params.weixin, params.mobile, params.status, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

member.delete = function(params, callback) {
    var sql = "delete from Member where ID = '%s'";
    sql = util.format(sql, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

member.change_password = function(params, callback) {
    var sql = "Update dbo.Member set Password = '%s' where ID = '%s'";
    sql = util.format(sql, params.password, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};