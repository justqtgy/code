var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/member/list', 'POST', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        show_list(json.rows);
        q.showPagination(json.total, get_list);
    });
}

function show_list(rows) {
    $("#grid tbody").find("tr.newrow").remove();
    //显示记录
    $.each(rows, function(i, item) {
        $("<tr class='newrow'></tr>").append(
            "<td>" + (i + 1) + "</td>" +
            "<td>" + item.Account + "</td>" +
            "<td>" + item.TrueName + "</td>" +
            "<td>" + item.Email + "</td>" +
            "<td>" + item.Mobile + "</td>" +
            "<td>" + new Date(item.ExpireTime).toUTCFormat('YYYY-MM-DD') + "</td>" +
            "<td>" + item.WX_OpenID + "</td>" +
            "<td>" + (item.IsDelete == 0 ? '<font color=blue>正常</font>' : '<font color=red>已禁用</font>') + "</td>" +
            "<td><a href='#' onclick='get_record(" + item.ID + ")'><i title='查看' class='fa fa-list'></i>查看</a>" +
            "    <a href='#' onclick='show_pswd_modal(" + item.ID + ", \"" + item.Account + "\")'><i title='修改密码' class='fa fa-lock'></i>修改密码</a>" +
            "    <a href='#' onclick='delete_record(" + item.ID + ")'><i title='删除' class='fa fa-remove'></i>删除</a></td>"
        ).appendTo($("#grid tbody"));
    });
}

//获取记录信息
function get_record(id) {
    var params = {
        id: id
    };

    var q = new Query('/member/single', 'GET');
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        var item = json.rows[0];
        //显示记录
        $("#txtID").val(item.ID);
        $("#txtAccount").val(item.Account);
        $("#txtPassword").val(item.Password);
        $("#txtTrueName").val(item.TrueName);
        $("#txtEmail").val(item.Email);
        $("#txtMobile").val(item.Mobile);
        $("#txtExpireTime").datepicker('setDate', new Date(item.ExpireTime).toUTCFormat('YYYY-MM-DD'));
        $("#chkIsAdmin").attr("checked", item.IsAdmin);
        $("#mod_info").modal({ backdrop: 'static', keyboard: false });
    });
}

function add_record() {
    //显示记录
    $("#txtID").val(0);
    $("#txtAccount").val('');
    $("#txtPassword").val('');
    $("#txtTrueName").val('');
    $("#txtEmail").val('');
    $("#txtMobile").val('');
    $("#chkIsAdmin").attr("checked", false);
    $("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

//添加记录信息
function set_record() {
    var q = new Query('/member/set', 'POST', $("#record"));
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }
        $("#mod_info").modal('hide');
        bootbox.alert(hint.save_success, function() {
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

            var params = {
                id: id
            };
            var q = new Query('/member/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    get_list(1);
                });
            });
        }
    });
}

function show_pswd_modal(id, account) {
    $("#txtUserID").val(id);
    $("#txtUserAccount").val(account);
    $("#txtPassword").val('');
    $("#txtConfirmPassword").val('');
    $("#mod_password").modal({ backdrop: 'static', keyboard: false });
}

function change_password() {
    var q = new Query('/member/password', 'POST', $("#password"));
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }

        bootbox.alert(hint.password_success);
        $("#mod_password").modal('hide');
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        loadPage: function() {
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });
            get_list(1);
        },
        init: function() {
            var that = this;
            that.loadPage();
            $("#btnSearch").click(function() {
                get_list(1);
            });
            $("#btnOK").click(function() { set_record(); });
            $("#btnChange").click(function() { change_password(); });
        },
        show_modal: function(id) {
            add_record();
        },
    }
});

app.init();