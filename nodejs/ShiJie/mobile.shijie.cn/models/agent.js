var util = require('util');
var db = require('./db');

function agent(model) {

}

module.exports = agent;

agent.add = function(params, callback) {
    var sql = "insert into agent(MemberID, ParentID) values('%s','%s')";
    sql = util.format(sql, params.memberid, params.parentid);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

agent.update = function(params, callback) {
    var sql = "update agent set MemberID = %s, ParentID=%s where id = '%s'";
    sql = util.format(sql, params.memberid, params.parentid, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};

agent.delete = function(params, callback) {
    var sql = "delete from agent where ID = '%s'";
    sql = util.format(sql, params.id);
    db.execSQL(sql, function(err, result) {
        if (err) {
            log.error('Error = ', err);
            return callback(err);
        }
        callback(err, result);
    });
};