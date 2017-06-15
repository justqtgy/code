var db = require('../models/mssql_helper');
var util = require('util');

function group_member(model) {
    this.id = model.id;
    this.groupid = model.groupid;
    this.memberid = model.memberid;
    this.account = model.account;
}

module.exports = group_member;

group_member.get_count = function(params, callback) {
    var sql = "select count(*) as total from GroupMember";
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
}

group_member.get_list = function(params, callback) {
    var iBeginID = (params.pageIndex - 1) * params.pageSize + 1;
    var iEndID = params.pageIndex * pageSize;
    var sql = " \
		;WITH t AS( \
			SELECT ROW_NUMBER() OVER (ORDER BY ID DESC) AS R_Number,* \
			FROM GroupMember \
		) \
		SELECT * FROM t WHERE R_Number BETWEEN %s AND %s ";
    sql = util.format(sql, iBeginID, iEndID);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_member.get_single = function(id, callback) {
    var sql = "select * from GroupMember where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err)
        }
        callback(err, rows);
    });
};

group_member.add = function(params, callback) {
    var sql = "insert into GroupMember(GroupID,MemberID,Account) values('%s','%s','%s')";
    sql = util.format(sql, params.GroupID, params.MemberID, params.Account);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

GroupMember.update = function(params, callback) {
    var sql = "update GroupMember set GroupID='%s', MemberID='%s', Account='%s' where id = '%s'";
    sql = util.format(sql, params.GroupID, params.MemberID, params.Account, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

group_member.delete = function(params, callback) {
    var sql = "delete from GroupMember where ID = '%s'";
    sql = util.format(sql, params.ID);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};