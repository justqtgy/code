var sql = require('mssql');
var iconv = require('iconv-lite');
var db = require('./mssql_helper');
var util = require('util');

function dao() {

}

dao.add_gps_data = function(args, callback) {
    var sql = `
        insert into gps_data(gps_id, sn, num, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2,
             power, alarm, status, lng, lat, high, speed, direct, dist_id, distance, gps_time, add_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
             %s, %s, %s, '%s', '%s', %s, %s, %s, %s, %s, '%s', GETDATE())
        ;SELECT @@IDENTITY as ret_id;`;
    sql = util.format(sql, args.gps_id,args.sn,args.num,args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.power, args.alarm, args.status, args.lng, args.lat, args.high, args.speed, args.direct, args.dist_id, args.distance, args.gps_time);
    db.execSQL(sql, function(err, result) {
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
}

dao.get_gps_last = function(gps_id, callback) {
    var sql = "select * from gps_last where gps_id='%s'";
    sql = util.format(sql, gps_id);
    db.execSQL(sql, function(err, result){
        if (err) {
            return callback(err, '');
        }

        callback(err, result);
    });
}

dao.add_gps_last = function(args) {
    var sql = `
        insert into gps_last(gps_id, sn, num, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2,
             power, lng, lat, dist_id, distance, gps_time, alarm_info, add_time, update_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
             %s, '%s', '%s', %s, %s, '%s', %s, GETDATE(), GETDATE())
        ;SELECT @@IDENTITY as ret_id;`;
    sql = util.format(sql, args.gps_id,args.sn,args.num,args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.power, args.lng, args.lat, args.dist_id, args.distance, args.gps_time, args.alarm_info);
    db.execSQL(sql, function(err, result){
        if (err) {
            logger.error('Error = ', err);
        }
    });
}

dao.set_gps_last = function(args) {
    var sql = `
        update gps_last 
        set one_zl = %s, one_rl=%s, one_c1=%s, one_c2=%s, 
                two_zl=%s, two_rl=%s, two_c1=%s, two_c2=%s,
                power=%s, lng ='%s', lat='%s', dist_id=%s, distance=%s, gps_time='%s', 
                alarm_info = %s, update_time=GETDATE()
        where gps_id='%s'
    `;
    sql = util.format(sql, args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.power, args.lng, args.lat, args.dist_id, args.distance, args.gps_time, args.alarm_info, args.gps_id);
    db.execSQL(sql, function(err, result){
        if (err) {
            logger.error('Error = ', err);
        }
    });
}

dao.add_gps_alarm = function(args) {
    var sql = `
        insert into gps_alarm(gps_id, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2,
            lng, lat,  gps_time, alarm_info, add_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s, %s, '%s', '%s', '%s', %s, GETDATE())
        ;SELECT @@IDENTITY as ret_id;`;
    sql = util.format(sql, args.gps_id, args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.lng, args.lat, args.gps_time, args.alarm_info);
    db.execSQL(sql, function(err, result) {
        if (err) {
            logger.error('Error = ', err);
        }
    });
}

dao.add_gps_power = function(args) {
    var sql = `
        insert into gps_power(gps_id, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2,
            power, lng, lat,  gps_time, add_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s, %s, 
             %s, '%s', '%s', '%s', GETDATE())
        ;SELECT @@IDENTITY as ret_id;`;
    sql = util.format(sql, args.gps_id, args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.power, args.lng, args.lat, args.gps_time);
    db.execSQL(sql, function(err, result) {
        if (err) {
            logger.error('Error = ', err);
        }
    });
}

dao.add_gps_capacity = function(args) {
    var sql = `
        insert into gps_capacity(gps_id, one_zl, one_rl, one_c1, one_c2, two_zl, two_rl, two_c1, two_c2,
             lng, lat,  gps_time,add_time)
            values('%s', %s, %s, %s, %s, %s, %s, %s, %s, '%s', '%s', '%s', GETDATE())`;
    sql = util.format(sql, args.gps_id, args.one_zl,args.one_rl,args.one_c1,args.one_c2,args.two_zl, args.two_rl, args.two_c1, args.two_c2,
            args.lng, args.lat, args.gps_time);
    db.execSQL(sql, function(err, result) {
        if (err) {
            logger.error('Error = ', err);
        }
    });
}

module.exports = dao;