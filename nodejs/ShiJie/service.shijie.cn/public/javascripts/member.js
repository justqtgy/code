var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

function get_list() {
    var q = new Query('/member/list', 'GET');
    q.request(null, function(json) {
        var data = [];
        // if (json.rows.length > 0) {
        //     var item = json.rows[0];
        //     data.push({ "id": 0, "parent": "#", "text": item.TrueName, "pid": item.Level, "no": item.MemberNo });
        //     data.push({ "id": -1, "parent": 0, "text": "一级代理" });
        //     data.push({ "id": -2, "parent": 0, "text": "二级代理" });
        //     data.push({ "id": -3, "parent": 0, "text": "三级代理" });
        // }

        // json.rows.forEach(function(item) {
        //     if (item.Level > 0) {
        //         data.push({ "id": item.ID, "parent": -item.Level, "text": item.TrueName, "pid": item.ParentID, "no": item.MemberNo });
        //     }
        // });

        json.rows.forEach(function(item) {
            if (item.ParentID.toString() === "0") {
                data.push({ "id": item.ID, "parent": "#", "text": item.TrueName, "level": item.Level, "no": item.MemberNo, "icon": icons[item.Level] });
            } else {
                data.push({ "id": item.ID, "parent": item.ParentID, "text": item.TrueName, "level": item.Level, "no": item.MemberNo, "icon": icons[item.Level] });
            }
        });
        console.log(data)
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
        // "types": {
        //     "default": {
        //         "icon": "fa fa-folder icon-state-warning icon-lg"
        //     },
        //     "file": {
        //         "icon": "fa fa-file icon-state-warning icon-lg"
        //     }
        // },
        "contextmenu": {
            "items": {
                "create": null,
                "rename": null,
                "remove": null,
                "ccp": null,
                "add": {
                    "label": "添加下级代理",
                    "action": function(data) {
                        var inst = jQuery.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        if (obj.original.level == 3) {
                            return bootbox.alert('已经是第三级代理，无法添加');
                        }
                        add_record();

                        $("#txtParentID").val(obj.id);
                        $("#txtParentName").val(obj.text);

                        $(".form-actions").show();
                    }
                },
                "edit": {
                    "label": "修改代理信息",
                    "action": function(data) {
                        $(".form-actions").show();
                    }
                },
                "delete": {
                    "label": "删除代理信息",
                    "action": function(data) {
                        var inst = jQuery.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        if (obj.children.length > 0) {
                            return bootbox.alert('该代理有下级代理，不能删除');
                        }
                        console.log(obj)
                        delete_record(obj.id);
                    }
                }
            }
        },
        "plugins": ["contextmenu", "dnd", "search", "state"]

    }).bind("select_node.jstree", function(e, data) {
        if (data.node.id > 0) {
            node = data.node;
            var item = data.node.original;
            console.log(item);
            get_record(item);
            $(".form-actions").hide();
        }
    });
}

//获取记录信息
function get_record(item) {
    console.log(item)
    var params = {
        id: item.id,
        pid: item.parent
    };

    $("#txtParentID").val(item.parent);

    var q = new Query('/member/single', 'GET');
    q.request(params, function(json) {
        console.log(json)
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        var item = json.rows[0];
        var parent = json.parents[0];
        //显示记录
        $("#hidID").val(item.ID);
        $("#txtParentID").val(parent.ID);
        $("#txtParentName").val(parent.TrueName);
        $("#txtMemberNo").val(item.MemberNo);
        $("#txtAccount").val(item.Account);
        $("#txtTrueName").val(item.TrueName);
        $("#txtIDCard").val(item.IDCard);
        $("#txtMobile").val(item.Mobile);
        $("#txtJoinTime").datepicker('setDate', new Date(item.JoinTime).toUTCFormat('YYYY-MM-DD'));
        $("#chkStatus").attr("checked", item.Status);
        // $("#mod_info").modal({ backdrop: 'static', keyboard: false });
    });
}

function add_record() {
    //显示记录
    $("#hidID").val(0);
    $("#txtMemberNo").val('');
    $("#txtAccount").val('');
    $("#txtTrueName").val('');
    $("#txtIDCard").val('');
    $("#txtMobile").val('');
}

//添加记录信息
function set_record() {
    var q = new Query('/member/set', 'POST', $("#record"));
    var params = q.init();
    console.log(params)
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }

        bootbox.alert(hint.save_success, function() {
             location=location;
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
                    location=location;
                });
            });
        }
    });
}

var app = new Vue({
    el: '#detail',
    data: {
        DataList: []
    },
    methods: {
        init: function() {
            $('[name="status"]').bootstrapSwitch({
                onText: "启用",
                offText: "停止"
            });

            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });

            $("#btnSave").click(function(){
                set_record();
            });
            get_list();
        },
    }
});

app.init();
