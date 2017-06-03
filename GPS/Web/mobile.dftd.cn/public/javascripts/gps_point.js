var displayNumber = 10;
//获取记录列表
function get_list(pageIndex) {
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
        url: "/gps_point/list",
        type: "POST",
        dataType: "json",
        data: data_format,
        beforeSend: function() { $("#loading").show(); },
        complete: function() { $("#loading").hide(); },
        success: function(result) {
            $("#grid tbody").find("tr.newrow").remove();
            var totalDistance = 0;
            $.each(result.rows, function(i, item) {
                totalDistance += parseFloat(item.Distance ? item.Distance : 0);
                $("<tr class='newrow'></tr>").append(
                    "<td>" + new Date(item.AddTime1).toUTCFormat('MM-DD HH24:MI:SS') + "</td>" +
                    "<td>" + (item.Distance ? item.Distance.toFixed(2) : 0) + "</td>" +
                    "<td>" + (item.OilUsed ? item.OilUsed.toFixed(2) : 0) + "</td>" +
                    "<td>" + (item.TimeUsed || 0) + "</td>" +
                    //"<td><a href='/map.html?lng1=" + item.Lng1 + "&lng2=" + (item.Lng2 || 0) + "&lat1=" + item.Lat1 + "&lat2=" + (item.Lat2 || 0) + "' target='_blank'>查看</a></td>"
                    "<td><a href='#map-modal' data-toggle=\"modal\"  onclick='showMap(" + item.Lng1 + "," + (item.Lng2 || 0) + "," + item.Lat1 + "," + (item.Lat2 || 0) + ")'>查看</a></td>"
                ).appendTo($("#grid tbody"));
            });
            $("#total_distance").html("<i>里程</i>" + totalDistance.toFixed(2));
        }
    });
}



function showMap(lng1, lng2, lat1, lat2) {
    // var $modal = $('#map-modal');
    // $modal.load('/map.html', '', function() {
    //     $modal.modal();
    // });
    $("#mapUrl").attr("src", "/map.html?lng1=" + lng1 + "&lng2=" + lng2 + "&lat1=" + lat1 + "&lat2=" + lat2 + "");
    return;
}