const EARTH_RADIUS = 6378137; //赤道半径(单位m)  

function map_helper() {

}
/** 
 * 转化为弧度(rad) 
 * */
function rad(d) {
    return d * Math.PI / 180.0;
}
/** 
 * 基于googleMap中的算法得到两经纬度之间的距离,计算精度与谷歌地图的距离精度差不多，相差范围在0.2米以下 
 * @param lng1 第一点的精度 
 * @param lat1 第一点的纬度 
 * @param lng2 第二点的精度 
 * @param lat2 第二点的纬度 
 * @return 返回的距离，单位km 
 * */
var getDistance = map_helper.getDistance = function(lng1, lat1, lng2, lat2) {
    console.log(lng1, lat1, lng2, lat2)
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    //s = Math.round(s * 10000) / 10000;  
    return s;
}

module.exports = map_helper;