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
    var sql = "select count(*) as total from gserver_data.dbo.GroupMember";
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

group_member.get_list = function(params, callback) {
    var sql = "SELECT t1.ID, t1.GroupID, t2.Account, t2.TrueName, t2.ExpireTime, t2.Mobile FROM gserver_data.dbo.GroupMember t1 inner join gserver_data.dbo.Member t2 on t1.Memberid=t2.id WHERE GroupID = %s ";
    sql = util.format(sql, params.group_id);
    console.log(sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_member.get_except_list = function(params, callback) {
    var sql = "select [ID] as MemberID,[Account] from gserver_data.[dbo].[Member] " +
        "except " +
        "select MemberID,[Account] from gserver_data.[dbo].[GroupMember] where GroupID = %s";

    sql = util.format(sql, params.group_id);
    console.log('==============================', sql)
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_member.get_single = function(id, callback) {
    var sql = "select * from gserver_data.dbo.GroupMember where ID = %s";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
};

group_member.add = function(params, callback) {

    var sql = "insert into gserver_data.dbo.GroupMember(GroupID,MemberID,Account) " +
        "select %s, ID as MemberID, Account from  gserver_data.dbo.Member " +
        "where id in (%s)";
    sql = util.format(sql, params.groupID, params.memberList);
    console.log(sql);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};

group_member.delete = function(id, callback) {
    var sql = "delete from gserver_data.dbo.GroupMember where ID = '%s'";
    sql = util.format(sql, id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};