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
};

common.format_time = function(d, t) {
    if (d.length >= 6 && t.length >= 6)
        return '20' + d.substr(4, 2) + "-" + d.substr(2, 2) + "-" + d.substr(0, 2) + " " + t.substr(0, 2) + ":" + t.substr(2, 2) + ":" + t.substr(4, 2);
    else
        return new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
};

common.PrefixInteger = function(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

// common.changeLocation = function(value) {
//     var temp = value.toString();
//     var arr = temp.split('.');
//     if (arr.length != 2) return 0;

//     var du = arr[0];
//     temp = (Number('0.' + arr[1]) * 60).toString();
//     arr = temp.split('.');
//     if (arr.length != 2) return 0;

//     var fen = arr[0];
//     temp = (Number('0.' + arr[1]) * 60).toString();
//     var miao = temp.replace('.', '');

//     var point = du + '.' + fen + miao;
//     return Number(point).toFixed(6);
// };
/**
 * double t = ddmm.mmmmm（纬度原始数据）
int  a = (int)(t/100); // 纬度的整数部分
double b = (t - a*100)/60.0;		//纬度的小数部分
 */
common.changeLocation = function(value) {
    var temp = value.toString();
    var arr = temp.split('.');
    if (arr.length != 2) return 0;

    var v1 = arr[0];
    var v2 = 100 * parseFloat('0.' + arr[1]) / 60;
    var point = Number(v1) + Number(v2);
    console.log('==========================>', point)
    return Number(point).toFixed(6);
};

module.exports = common;