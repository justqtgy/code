var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/group/list', 'GET');
    q.request(null, function(json) {
        var data = [];
        json.rows.forEach(function(item) {
            if (item.ParentID.toString() === "0") {
                data.push({ "id": item.ID, "parent": "#", "text": item.GroupName, "linker": item.Linker, "phone": item.Phone, "address": item.Address, "remark": item.Remark });
            } else {
                data.push({ "id": item.ID, "parent": item.ParentID, "text": item.GroupName, "linker": item.Linker, "phone": item.Phone, "address": item.Address, "remark": item.Remark });
            }
        });
        showTreeGroup(data);
    });
}

function showTreeGroup(data) {
    $('#tree_group').jstree({
        "core": {
            "themes": {
                "responsive": false
            },
            "check_callback": true,
            'data': data
        },
        "types": {
            "default": {
                "icon": "fa fa-folder icon-state-warning icon-lg"
            },
            "file": {
                "icon": "fa fa-file icon-state-warning icon-lg"
            }
        },
        "plugins": ["types", "search", "state"]

    }).bind("select_node.jstree", function(e, data) {
        //if (data.node.children.length === 0) {
        node = data.node;
        var item = data.node.original;
        get_record(item);
         
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
        init: function() {
            $("#status").bootstrapSwitch();
        },
    }
});

app.init();