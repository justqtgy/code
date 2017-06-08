//获取定位
function get_location() {
    var data_format = { r: Math.random() };
    var ctrls = $('#search').serializeArray();
    for (var c in ctrls) {
        data_format[ctrls[c].name] = ctrls[c].value;
    }

    var carlist = $(".multiselect").val();
    if (carlist.length > 1) {
        alert('只能查询一辆车');
        return;
        // carlist = carlist.join(",");
    }
    carlist = carlist.join(",");
    if (!carlist) {
        alert('请选择车辆');
        return;
    }
    data_format.carlist = carlist;

    $.ajax({
        url: "/gps_last/get_location",
        type: "POST",
        dataType: "json",
        data: data_format,
        beforeSend: function() { $("#loading").show(); },
        complete: function() { $("#loading").hide(); },
        success: function(result) {
            var item = result.rows[0];
            var lng = item.Lng;
            var lat = item.Lat;

            showMap(lng, lat);
        }
    });
}

function showMap(lng, lat) {
    map.centerAndZoom(new BMap.Point(lng, lat), 13);
    map.clearOverlays();
    // var new_point = new BMap.Point(lng, lat);
    // var marker = new BMap.Marker(new_point); // 创建标注
    // map.addOverlay(marker); // 将标注添加到地图中
}