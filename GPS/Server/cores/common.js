var date = require('date-utils')

function common() {}

//字节数组转十六进制字符串
common.bytes2str = function(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i].toString(16);
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}

common.format_time = function(d, t) {
    if (d.length >= 6 && t.length >= 6)
        return '20' + d.substr(4, 2) + "-" + d.substr(2, 2) + "-" + d.substr(0, 2) + " " + t.substr(0, 2) + ":" + t.substr(2, 2) + ":" + t.substr(4, 2);
    else
        return new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
}

module.exports = common