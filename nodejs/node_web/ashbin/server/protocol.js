var gps_data = require('./parse/gps_data');


/**
 * 解析协议
 */

module.exports.parse = function(socket, data) {
    var _data = data.toString().replace('\r', '');    
        _data = _data.toUpperCase();

    if (_data.substring(0, 2) == '7E' && _data.indexOf('2A444654445F4C4A54') > 0) {
        gps_data.add_data(_data);
    }
};

