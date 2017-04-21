/*
 *偷油漏油发送短信报警
 *格式如下：*DFTD_LYBJ,ID,phoneNumber# ,如(*DFTD_LYBJ,2000000100,13554766446#)
 */
module.exports.add_alarm_data = async function(data) {
    var now = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    var item = {};
    if (data[0].indexOf('*DFTD_LYBJ') >= 0 && data.length >= 3) {
        item.gprsid = data[1];
        item.mobile = data[2].replace('#', '');
        item.addtime = now;

        try {
            let result = await gps_data.get_carlist(item.gprsid);
            let rows = result.recordsets;
            if (rows.length == 0) {
                logger.error('获取车辆信息失败：该车不存在');
                return;
            }

            item.carnumber = rows[0].CarNumber;
            item.vehicleid = rows[0].VehicleID;

            //发送短信
            send_alarm_msg(item);
            //延时一秒发送服务区短信
            setTimeout(function() {
                send_servicearea_msg(item);
            }, 1000);

        } catch (error) {
            return logger.error('Error = ', err);
        }
    }
}

var send_alarm_msg = async function(data) {
    //写入数据库
    data.typeid = 1;
    try {
        var result = await gps_data.add_alarm(data);
        logger.info('Result = ', result);

        logger.info('给司机发送报警短信...');
        var sender = {};
        sender.mobile = data.mobile;
        sender.content = data.carnumber + '在' + data.addtime + '出现漏油异常【鼎丰泰达】';
        logger.info(sender);
        sms.send_sms_request(sender);
    } catch (error) {
        logger.error('send_alarm_msg = ', error);
    }
}

//给服务区发短信
var send_servicearea_msg = async function(data) {
    try {
        //获取司机设置的服务区号码
        let result = await gps_data.get_driver_vhc(data.vehicleid);
        logger.info('司机设置的服务区信息 = ', result);
        if (result.length > 0 && result[0].SA_Tel) {
            //写入数据库
            var sa_tel = result[0].SA_Tel;
            data.typeid = 2;
            data.mobile = sa_tel;
            result = gps_data.add_alarm(data);
            logger.info('Result = ', JSON.stringify(result));

            logger.info('给服务区发送短信...');
            var sender = {};
            sender.mobile = sa_tel;
            sender.content = data.carnumber + '在' + data.addtime + '出现漏油异常【鼎丰泰达】';
            logger.info(sender);
            sms.send_sms_request(sender);
        }
    } catch (error) {
        logger.error('send_servicearea_msg = ', error)
    }
}