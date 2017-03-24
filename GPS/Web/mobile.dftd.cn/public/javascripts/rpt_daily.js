var displayNumber = 10;
//获取记录列表
function get_list(pageIndex) {
    var data_format = {
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
        url: "/daily_report/oil_cost",
        type: "POST",
        dataType: "json",
        data: data_format,
        //beforeSend : function() { $("#loading").show(); },
        //complete : function() { $("#loading").hide(); },
        success: function(result) {
            console.log(result)
            if (result.ok == "0") {
                $("#grid tbody").find("tr.newrow").remove();
                //显示记录
                $.each(result.rows, function(i, item) {
                    var _class1 = ' label-info';
                    var _status1 = '正常';
                    var _class2 = ' label-info';
                    var _status2 = '正常';
                    if (item.status < 0) {
                        _class1 = _class1 + ' label-danger';
                        _status1 = '设备异常';
                    }

                    if (item.typeid > 0) {
                        _status2 = '油票异常';
                        _class2 = _class2 + ' label-danger';
                    }
                    if (item.typeid < 0) {
                        _status2 = '—';
                    }

                    $("<tr class='newrow' onclick='show_detail(" + item.vhcid + ");'></tr>").append(
                        "<td>" + item.carnumber + "</td>" +
                        "<td><span class='label " + _class1 + "'>" + _status1 + "</span></td>" +
                        "<td><span class='label " + _class2 + "'>" + _status2 + "</span></td>" +
                        "<td>" + item.oil_used.toFixed(2) + "</td>" +
                        "<td>" + item.avg_price.toFixed(2) + "</td>" +
                        "<td>" + item.total_amount.toFixed(2) + "</td>" +
                        "<td>" + item.total_distance.toFixed(2) + "</td>" +
                        "<td>" + (item.total_distance ? (item.oil_used * 100 / item.total_distance).toFixed(2) : 0) + "</td>"
                    ).appendTo($("#grid tbody"));
                });
            }
        }
    });
}


//弹出Modal
function show_detail(vhcid) {
    var data = {}
    var ctrls = $('#search').serializeArray();
    for (var c in ctrls) {
        data[ctrls[c].name] = ctrls[c].value;
    }
    data.carlist = vhcid;



    $.post('/daily_report/detail', data, function(result) {
        $("#detail tbody").find("tr.newrow").remove();
        //显示记录
        $.each(result.rows, function(i, item) {
            var _class1 = ' label-info';
            var _status1 = '正常';

            var _class2 = '';
            if (item.online == 0) {
                _class1 = _class1 + ' label-danger';
                _status1 = '设备异常';
            }

            if (item.oil_diff > 15) {
                _class2 = 'danger';
            }

            if ($("#lblCarNumber").text() == "")
                $("#lblCarNumber").text(item.carnumber);

            $("<tr class='newrow " + _class2 + "'></tr>").append(
                "<td>" + new Date(item.createdate).toUTCFormat('MM-DD') + "</td>" +
                "<td><span class='label " + _class1 + "'>" + _status1 + "</span></td>" +
                "<td>" + item.oil_sys.toFixed(2) + "</td>" +
                "<td>" + item.oil_self.toFixed(2) + "</td>" +
                "<td>" + item.amount.toFixed(2) + "</td>"

            ).appendTo($("#detail tbody"));
        });

        $("#mod_info").modal({
            backdrop: 'static',
            keyboard: false
        });
    });

}

function show_pager(total, pageIndex) {
    if (total == 0) {
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
    }
    $('.pagination').bootstrapPaginator(options);
}