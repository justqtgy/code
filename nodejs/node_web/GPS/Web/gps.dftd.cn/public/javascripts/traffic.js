var displayNumber = 10;
//获取记录列表
function get_list(pageIndex) {
    var data_format = { r: Math.random() };
    var ctrls = $('#search').serializeArray();
    for (var c in ctrls) {
        data_format[ctrls[c].name] = ctrls[c].value;
    }

    var carlist = $(".multiselect").val();
    if (carlist) {
        carlist = carlist.join(",");
    }
    if (!carlist) {
        alert('请选择车辆');
        return;
    }
    data_format.carlist = carlist;

    $.ajax({
        url: "/traffic/list",
        type: "POST",
        dataType: "json",
        data: data_format,
        beforeSend: function() { $("#loading").show(); },
        complete: function() { $("#loading").hide(); },
        success: function(result) {
            $("#grid tbody").find("tr.newrow").remove();
            $.each(result.rows, function(i, item) {
                $("<tr class='newrow'></tr>").append(
                    "<td>" + item.carnumber + "</td>" +
                    "<td>" + new Date(item.begin_time).toUTCFormat('YYYY-MM-DD HH:MI:SS') + "</td>" +
                    "<td>" + new Date(item.end_time).toUTCFormat('YYYY-MM-DD HH:MI:SS') + "</td>" +
                    "<td>" + item.distance.toFixed(2) + "</td>" +
                    "<td>" + item.s_oil.toFixed(2) + "</td>"

                ).appendTo($("#grid tbody"));
            });
        }
    });
}


//获取记录列表
function get_excel() {
    var params = '';
    var ctrls = $('#search').serializeArray();
    for (var c in ctrls) {
        params += "&" + ctrls[c].name + "=" + ctrls[c].value
    }

    var carlist = $(".multiselect").val();
    if (carlist) {
        carlist = carlist.join(",");
    }
    if (!carlist) {
        alert('请选择车辆');
        return;
    }
    params += "&carlist=" + carlist


    var url = "/oil_ticket/excel?r=" + Math.random() + params;
    console.log(url);
    location.href = url;
}