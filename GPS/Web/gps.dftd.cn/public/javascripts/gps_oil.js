var displayNumber = 10;

$(function() {
    $("#btnSearch").click(function() {
        get_list(1);
    });
});

//获取记录列表
function get_list(pageIndex) {
    var data_format = {
        pageindex: pageIndex,
        pagesize: displayNumber,
        r: Math.random()
    };

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
        url: "/gps_oil/get_rt_list",
        type: "GET",
        dataType: "json",
        data: data_format,
        beforeSend: function() { $("#loading").show(); },
        complete: function() { $("#loading").hide(); },
        success: function(json) {
            $("#grid tbody").find("tr.newrow").remove();
            //显示记录
            $.each(json.rows, function(i, item) {
                $("<tr class='newrow'></tr>").append(
                    "<td>" + (i + 1).toString() + "</td>" +
                    "<td>" + item.VehicleNo + "</td>" +
                    "<td>" + item.GPSID + "</td>" +
                    "<td>" + (item.OilStatus == 1 ? "有效" : "无效") + "</td>" +
                    "<td>" + item.CurOil + "</td>" +
                    "<td>" + new Date(item.AddTime).toUTCFormat('YYYY-MM-DD HH24:MI:SS') + "</td>"

                ).appendTo($("#grid tbody"));
            });
            show_pager(json.total, pageIndex);
        }
    });
}

function show_pager(total, pageIndex) {
    if (total === 0) {
        $('.pagination').empty();
        return;
    }
    var options = {
        bootstrapMajorVersion: 3,
        currentPage: pageIndex,
        numberOfPages: 15,
        totalPages: Math.ceil(total / displayNumber),
        onPageClicked: function(event, originalEvent, type, page) {
            get_list(page);
        }
    };
    $('.pagination').bootstrapPaginator(options);
}