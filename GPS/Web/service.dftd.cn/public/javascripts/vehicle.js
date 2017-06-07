var displayNumber = 20;
$(function() {

    $("#btnSearch").click(function() { get_list(1); });
    $("#btnOK").click(function() { set_record(); });
});

//获取记录列表
function get_list(pageIndex) {
    var q = new Query('/vehicle/list', 'POST', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    q.request(params, function(json) {
        $("#grid tbody").find("tr.newrow").remove();
        //显示记录
        $.each(json.Data, function(i, item) {
            $("<tr class='newrow'></tr>").append(
                "<td>" + item.ID + "</td>" +
                "<td>" + item.GPSID + "</td>" +
                "<td>" + item.VehicleNo + "</td>" +
                "<td>" + item.Mobile + "</td>" +
                "<td>" + item.Remark + "</td>" +
                "<td><a href='#' onclick='get_record(" + item.ID + ")'><i title='查看' class='fa fa-list'></i></a>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href='#' onclick='delete_record(" + item.ID + ")'><i title='删除' class='fa fa-remove'></i></a></td>"
            ).appendTo($("#grid tbody"));
        });
        q.showPagination(json.total, get_list);
    });
}

//获取记录信息
function get_record(id) {
    var params = {
        id: id
    };
    var q = new Query('/vehicle/single', 'POST');
    q.request(params, function(json) {
        //显示记录
        $("#txtID").val(json.ID);
        $("#txtGPSID").val(json.GPSID);
        $("#txtVehicleNo").val(json.VehicleNo);
        $("#txtMobile").val(json.Mobile);
        $("#txtRemark").val(json.Remark);
        $("#mod_info").modal({ backdrop: 'static', keyboard: false });
    });
}

//添加记录信息
function set_record() {
    var q = new Query('/vehicle/set', 'POST', $("#record"));
    var params = q.init();
    q.request(params, function(json) {
        if (!value) {
            bootbox.alert(hint.save_fail);
            return;
        }
        $("#mod_info").modal('hide');
        bootbox.alert(hint.save_success, function() {
            $("#Pagination").page('destroy');
            get_list(1);
        });

    });
}

//删除记录信息
function delete_record(id) {
    bootbox.setLocale("zh_CN");
    bootbox.confirm({
        title: hint.box_title,
        message: hint.confirm_delete,
        callback: function(result) {
            if (!result) return;
            var data_format = {
                id: id
            };

            var params = {
                id: id
            };
            var q = new Query('/vehicle/delete', 'POST');
            q.request(params, function(json) {
                if (!value) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    $("#Pagination").page('destroy');
                    get_list(1);
                });
            });
        }
    });
}

//弹出Modal
function show_modal() {
    clear_control();
    $("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

//获取记录信息
function clear_control() {
    $("#txtID").val("");
    $("#txtGPSID").val("");
    $("#txtVehicleNo").val("");
    $("#txtMobile").val("");
    $("#txtRemark").val("");
}