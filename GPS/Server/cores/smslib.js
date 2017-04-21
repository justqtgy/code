var http = require('http');
var qs = require('querystring');
var iconv = require('iconv-lite');

/**
 * 请求第三方模块，发送短信
 * params:
 *  sms 
 *      mobile: 手机号
 *      content:发送消息
 * usage:
 * 
 */
var send_sms_request = module.exports.send_sms_request = function(sms) {
    var data = {
        un: 'szdftd-1',
        pwd: '890423',
        mobile: sms.mobile,
        msg: sms.content
    };

    var content = qs.stringify(data);

    var options = {
        hostname: 'si.800617.com',
        port: 4400,
        path: '/SendSms.aspx?' + content,
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        var str = ''
        res.setEncoding('binary')

        res.on('data', function(chunk) {
            str += chunk
        })

        res.on('end', function() {
            var ret = iconv.decode(new Buffer(str, 'binary'), 'GBK')

            if (ret.indexOf('result=1') >= 0) {
                logger.info('send_sms ok', ret)
            } else {
                logger.error('send_sms err', ret)
            }
        })

    })

    req.on('error', function(e) {
        logger.info(e)
    })

    req.end()
}