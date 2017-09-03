var util = require('util');
var db = require('./db');

function member(model) {
    this.id = model.id;
    this.memberno = model.memberno;
    this.account = model.account;
    this.truename = model.truename;
    this.idcard = model.idcard;
    this.wexinid = model.wexinid;
    this.mobile = model.mobile;
    this.parentid = model.parentid;
    this.jointime = model.jointime;
    this.addtime = model.addtime;
    this.status = model.status;
}

module.exports = member;

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
    sql = util.format(sql, iBeginID, iEndID);

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
					select *, 0 as Level from Member where MemberNo='0' \
					union all \
					select Member.*, Level+1 from Member inner join t on Member.ParentID = t.ID \
				) \
				select * from t where Level<=3";
    console.log(sql)
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
    var sql = "insert into Member(MemberNo,Account,TrueName,IDCard,WeXinID,Mobile,ParentID,JoinTime,AddTime,Status) values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')";
    sql = util.format(sql, params.MemberNo, params.Account, params.TrueName, params.IDCard, params.WeXinID, params.Mobile, params.ParentID, params.JoinTime, params.AddTime, params.Status);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

member.update = function(params, callback) {
    var sql = "update Member set MemberNo='%s', Account='%s', TrueName='%s', IDCard='%s', WeXinID='%s', Mobile='%s', ParentID='%s', JoinTime='%s', AddTime='%s', Status='%s' where id = '%s'";
    sql = util.format(sql, params.MemberNo, params.Account, params.TrueName, params.IDCard, params.WeXinID, params.Mobile, params.ParentID, params.JoinTime, params.AddTime, params.Status, params.ID);
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
    sql = util.format(sql, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};