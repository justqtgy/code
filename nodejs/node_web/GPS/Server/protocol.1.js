var gps_alarm = require('./parse/gps_alarm');
var gps_oil = require('./parse/gps_oil');
var gps_point = require('./parse/gps_point');
var gps_data = require('./parse/gps_data');
var gps_online = require('./parse/gps_online');
var gps_quality = require('./parse/gps_quality');
var gps_rubbish = require('./parse/gps_rubbish');
var gps_test = require('./parse/gps_test');
var gps_speed_test = require('./parse/gps_speed_test');
var driver_card = require('./parse/driver_card');
var getCurrentTime = require('./cores/date_now');
var JT808 = require('./parse/JT808');
var bj_oil=require('./parse/bj_oil');
var bj_alarm=require('./parse/bj_alarm');
var bj_quality=require('./parse/bj_quality');
var gps_remote=require('./parse/gps_remote');
var gps_param=require('./parse/gps_param');
var db = require('./models/mssql_helper');
var util = require('util');
var response = require('./parse/response');
var gps_response = require('./parse/gps_response');

/**
 * 解析协议
 */
 
var GPS = [];

function revise1(data){
    var arr=[];
    for( var i = 0; i < data.length/2; i++ ){
        arr.push( '0x'+data.charAt(i*2)+ data.charAt(i*2+1) );
    }
    return arr
}

function revise2(data){
    var arr=[];
    for( var i = 0; i < data.length/2; i++ ){
        arr.push( data.charAt(i*2)+ data.charAt(i*2+1) );
    }
    for(var i=0;i<arr.length;i++){
        if( arr[i]=='7d'){
            arr[i]='7d';
            arr.splice(i+1, 0, '01')
        }
        if( arr[i]=='7e'){
            arr[i]='7d';
            arr.splice(i+1, 0, '02')
        }
    }
    return arr
}

module.exports.parse = function(socket, data) {
    var _data = data.toString().replace('\r', '');
    var list = _data.split(',');
    var REPLY_MSG = '';
	var GPSID='';
	
 
	
	if(_data.substring(0,9)=='socket.io'){
		
		logger.info(_data)

        if( _data.substring(19,20) == '*' && _data.charAt(_data.length-1)=="#" ){

            GPSID=_data.match(/socket.io(\S*)\*/)[1];

            var str=_data.replace('socket.io'+GPSID,'');

            var sql = "select * from GPS_Remote where GPSID ='%s'";

            sql = util.format(sql,GPSID);

            db.execSQL(sql, function(err,result) {

                if (err) {
                    return callback(err, '');
                }
				
                Address = result[0].remoteAddress;

                Port = result[0].remotePort;

                for(var i=0;i<GPS.length;i++){
					
                    if( Address == GPS[i].remoteAddress && Port == GPS[i].remotePort ){
                        GPS[i].write(str)
                    }
					
                }
            });

        }else{
			
            GPSID=_data.substring(9,21);

            var str=_data.replace('socket.io'+GPSID,'');

            var sql = "select * from GPS_Remote where GPSID ='%s'";

            sql = util.format(sql,GPSID);

            var num1 = parseInt(str.length / 2);

            if(num1 >= 0 && num1 <=15){
                num1='0'+num1.toString(16)
            }else{
                num1=num1.toString(16)
            }

            var num2 = parseInt(str.length/2)+4;
			
            if(num2 >= 0 && num2 <= 15){
                num2 = '000'+num2.toString(16);
            }
            if(num2 > 15 && num2 <= 255){
                num2 = '00'+num2.toString(16);
            }
            if(num2 > 255 && num2 <= 4095){
                num2 = '0'+num2.toString(16);
            }

            var _test='8900'+num2+GPSID+'0000'+'f90141'+num1+str;

            var test=revise1(_test);

            var temp='0x00';

            for(var i=0;i<test.length;i++){
                temp=temp^test[i];
            }
            if(temp >= 0 && temp <=15){
                temp='0'+temp.toString(16)
            }else{
                temp=temp.toString(16)
            }


            var buf = new Buffer(100);

            var _str='8900'+num2+GPSID+'0000'+'f90141'+num1+str+temp;
            var info = revise2(_str);
            info.splice(0, 0, "7e");
            info.splice(info.length, 0, "7e");
            console.log(info)
            console.log(info.join(","))

            for(var i = 0; i < info.length; i++) {
                buf[i]='0x'+info[i];
            }

            db.execSQL(sql, function(err,result) {
                console.log(result);
                if (err) {
                    return callback(err, '');
                }
                Address = result[0].remoteAddress;

                Port = result[0].remotePort;

                for(var i=0;i<GPS.length;i++){
					
                    if( Address == GPS[i].remoteAddress && Port == GPS[i].remotePort ){
                        GPS[i].write(buf)
                        logger.info('buf'+buf)
                    }
					
                }
            });

        }
    }
	
    if(list.length === 1){
        if (list[0].indexOf('SSSA') >= 0) {
            gps_test.add_test_data(list);
        }
        if (list[0].indexOf('SSSD') >= 0) {
            gps_test.add_test_data(list);
        }
		if (list[0].indexOf('SSSS') >= 0) {
            gps_test.add_test_data(list);
        }
        if (list[0].indexOf('TTTA') >= 0) {
            gps_speed_test.add_speed_test_data(list);
        }
        if (list[0].indexOf('TTTD') >= 0) {
            gps_speed_test.add_speed_test_data(list);
        }
		if (list[0].indexOf('XXXA') >= 0) {
            gps_test.add_test_data(list);
        }
        if (list[0].indexOf('XXXD') >= 0) {
            gps_test.add_test_data(list);
        }
        if (list[0].indexOf('SSSX') >= 0) {
            gps_speed_test.add_speed_test_data(list);
        }
        if (list[0].indexOf('SSSY') >= 0) {
            gps_speed_test.add_speed_test_data(list);
        }
		//部标协议
		
		//OK or ERROR
        if(list[0].substring(0,6) == '7e0900' && list[0].substring(34,38) =='0000' && list[0].substr(list[0].length-2) == '7e'){
            response.add_response_data(list)
        }
		
        if (list[0].substring(0,10) == '7e02000028' && list[0].substr(list[0].length-2) == '7e') {
            JT808.add_JT808_data(list)
        }
		
		if (list[0].substring(0,10) == '7e00020000' && list[0].substr(list[0].length-2) == '7e') {	
			var remote=list[0].substring(10,22)+','+socket.remoteAddress+','+socket.remotePort;
            var arr=remote.split(',');
            gps_remote.add_remote_data(arr)
        }

		
		if (list[0].substring(0,10) == '7e0900001e' && list[0].indexOf('2a444654445f4f494c')>=0 && list[0].substr(list[0].length-2) == '7e') {
            bj_oil.add_bj_real_oil_data(list)
        }
		
		// ~DFTD_ADD_OIL_OK~
        if (list[0].substring(0,10) == '7e09000026' && list[0].indexOf('2a444654445f4144445f4f494c')>=0 && list[0].substr(list[0].length-2) == '7e') {
            bj_oil.add_bj_add_oil_data(list)

            REPLY_MSG = new Buffer('~DFTD_ADD_OIL_OK~');
            //setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
            //}, 5000)
        }
		
		// ~DFTD_LEAK_OIL_OK~		
        if (list[0].substring(0,10) == '7e09000027' && list[0].indexOf('2a444654445f4c45414b5f4f494c')>=0 && list[0].substr(list[0].length-2) == '7e') {
            bj_oil.add_bj_leak_oil_data(list)

            REPLY_MSG = new Buffer('~DFTD_LEAK_OIL_OK~');
            //setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
            //}, 5000)
        }
		
        if (list[0].substring(0,10) == '7e09000013' && list[0].indexOf('2a444654445f5950')>=0 && list[0].substr(list[0].length-2) == '7e') {
            bj_quality.add_bj_quality_data(list)
        }
		
		
		// ~DFTD_LYBJ_OK~
		if (list[0].indexOf('7e444654445f4c59424a') >= 0) {
            bj_alarm.add_alarm_data(list);
			REPLY_MSG = new Buffer('~DFTD_LYBJ_OK~');
            //setTimeout(function() {
                socket.write(REPLY_MSG);
				logger.info('REPLY = ', REPLY_MSG);
            //}, 5000);
        }
		
		// ~BJ_SERVER_TIME,2017-10-21 08:58:55~
		
		if (list[0].indexOf('7e4745545f424a5f5345525645525f54494d45') >= 0) {
            GPSID=list[0].match(/7e4745545f424a5f5345525645525f54494d45(\d*)7e/)[1];
            REPLY_MSG = new Buffer('~BJ_SERVER_TIME,'+getCurrentTime()+'~');
            //setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG+','+GPSID);
            //}, 5000);
        }		
    }
	
	if(list[0].indexOf('*sensor_para:') >=0 ){
        gps_param.add_gps_param_data(_data)
    }
	
	
	if(_data.substring(0,1)== '*' && _data.indexOf('_OK') >= 0){
        var remoteAddress = socket.remoteAddress;
        var remotePort = socket.remotePort;
        var sql = "select GPSID from gps_remote where remoteAddress='%s' and remotePort='%s'";
        sql = util.format(sql,remoteAddress,remotePort);
        db.execSQL(sql, function(err,result) {
            if (err) {
                return callback(err, '');
            }
            var data=_data+result[0].GPSID;
            gps_response.add_gps_response_data(data)
        });
    }
    

    if (list.length > 1 && _data.substring(0,9)!='socket.io') {

        if (list[0].indexOf('*HQ') >= 0 && list[0].indexOf('I2')<0) {
            gps_data.add_data_tianhe(list);
			var remote=list[1]+','+socket.remoteAddress+','+socket.remotePort;
            var arr=remote.split(',');
            gps_remote.add_remote_data(arr)
        }
		
		//司机卡协议
        if (list[0].indexOf('*HQ') >= 0 && list[2].indexOf('I2') >= 0 && list[6].indexOf('40') >=0) {
            driver_card.add_driverCard_data(list);
        }

        if (list[0].indexOf('*DFTD_LYBJ') >= 0) {
            gps_alarm.add_alarm_data(list);
			REPLY_MSG = '*DFTD_LYBJ_OK#';
			GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
				logger.info('REPLY = ', REPLY_MSG+','+GPSID);
            }, 5000);
        }

        if (list[0].indexOf('*DFTD_OIL') >= 0) {
            gps_oil.add_realoil_data(list);
        }
        if (list[0].indexOf('*DFTD_ADD_OIL') >= 0) {
            gps_oil.add_addoil_data(list);

            REPLY_MSG = '*DFTD_ADD_OIL_OK#';
			GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG+','+GPSID);
            }, 5000)
        }
        if (list[0].indexOf('*DFTD_LEAK_OIL') >= 0) {
            gps_oil.add_leakoil_data(list);

            REPLY_MSG = '*DFTD_LEAK_OIL_OK#';
			GPSID = list[1];
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG+','+GPSID);
            }, 5000);
        }
        if (list[0].indexOf('*DFTD_URGENT_ADD_OIL') >= 0) {
            gps_oil.add_oilUrgentAdd_data(list);
        }
        if (list[0].indexOf('*DFTD_URGENT_LEAK_OIL') >= 0) {
            gps_oil.add_oilUrgentLeak_data(list);
        }
        if (list[0].indexOf('*DFTD_START_A') >= 0) {
            gps_point.add_startpoint_data(list);

            REPLY_MSG = '*DFTD_START_A_OK#';
            var i = 0;
            var int = setInterval(function() {
                i++;
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
                if (i >= 100) {
                    i = 0;
                    clearInterval(int);
                }
            }, 5000);
        }
        if (list[0].indexOf('*DFTD_END_B') >= 0) {
            gps_point.add_endpoint_data(list);

            REPLY_MSG = '*DFTD_END_B_OK#';
            setTimeout(function() {
                socket.write(REPLY_MSG);
                logger.info('REPLY = ', REPLY_MSG);
            }, 5000)
        }

        if (list[0].indexOf('*DFTD_YP') >= 0) {
            gps_quality.add_quality_data(list);
        }

        // if (list[0].indexOf('update') >= 0) {
        //     update_clients(list);
        // }

        gps_online.set_online(list);

        if (list[0].indexOf('*DFTD_LJT') >= 0) {
            gps_rubbish.add_rubbish_data(list);
        }
		
		if (list[0].indexOf('*GET_SERVER_TIME') >= 0) {
            setTimeout(function() {
                REPLY_MSG = getCurrentTime();
                GPSID = list[1].replace('#','');
                socket.write('*SERVER_TIME,'+REPLY_MSG+'#');
                logger.info('REPLY = ','SERVER_TIME,'+REPLY_MSG+','+GPSID);
            }, 5000)
        }

        if (list[0].indexOf('*GET_BJ_SERVER_TIME') >= 0) {
            setTimeout(function() {
                REPLY_MSG = getCurrentTime();
                GPSID = list[1].replace('#','');
                socket.write('~BJ_SERVER_TIME,'+REPLY_MSG+'~');
                logger.info('REPLY = ','BJ_SERVER_TIME,'+REPLY_MSG+','+GPSID);
            }, 5000)
        }
		
		
    }

    /*else {
        if (_data.substring(0, 2) == '59') {
            add_capacity_data(_data);
        }

        if (_data.substring(0, 2) == '7E') {
            gps_data.add_data_bubiao(data);
        }
    }
    */

};