var util = require('util');
var db = require('./db');

function member_stat(model) {

}

module.exports = member_stat;


member_stat.get_single = function(memberid, callback) {
    var sql = "select * from MemberStat where MemberID = %s";
    sql = util.format(sql, memberid);
    db.execSQL(sql, function(err, rows) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, rows);
    });
};

member_stat.init = function(params, callback) {
    var sql = "insert into MemberStat(MemberID, TotalMoney, LastMoney, LastTime) values(%s, 0, 0, GETDATE())";
    sql = util.format(sql, params.member_id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

member_stat.update = function(params, callback) {
    var sql = "update MemberStat set  TotalMoney=TotalMoney+%s, LastMoney=%s where Memberid = %s";
    sql = util.format(sql, params.last_money, params.last_money, params.member_id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};