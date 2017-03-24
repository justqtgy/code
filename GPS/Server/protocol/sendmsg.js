var sms = require('/cores/smslib');

var send_alarm_msg = module.exports.send_alarm_msg = function(data) {
    //写入数据库
    data.typeid = 1;
    gps_data.add_alarm(data, function(err, result) {
        if (err) {
            logger.error('Error = ', err);
        }
        logger.info('Result = ', JSON.stringify(result));
    });
    logger.info('给司机发送报警短信...');
    var sender = {};
    sender.mobile = data.mobile;
    sender.content = data.carnumber + '在' + data.addtime + '出现漏油异常【鼎丰泰达】';
    logger.info(sender);
    sms.send_sms_request(sender);
}

//给服务区发短信
var send_servicearea_msg = module.exports.send_servicearea_msg = function(data) {
    //获取司机设置的服务区号码
    gps_data.get_driver_vhc(data.vehicleid, function(err, result) {
        if (err) {
            logger.error('获取司机信息失败：', err)
            return;
        }
        logger.info('司机设置的服务区信息 = ', result);
        if (result.length > 0 && result[0].SA_Tel) {
            //写入数据库
            var sa_tel = result[0].SA_Tel;
            data.typeid = 2;
            data.mobile = sa_tel;
            gps_data.add_alarm(data, function(err, result) {
                if (err) {
                    logger.error('Error = ', err);
                    return
                }
                logger.info('Result = ', JSON.stringify(result));
            });

            logger.info('给服务区发送短信...');
            var sender = {};
            sender.mobile = sa_tel;
            sender.content = data.carnumber + '在' + data.addtime + '出现漏油异常【鼎丰泰达】';
            logger.info(sender);
            sms.send_sms_request(sender);
        }
    })
}