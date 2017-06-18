var displayNumber = 10;

function get_list() {
    var q = new Query('/group/list', 'GET');
    q.request(null, function(json) {
        var data = [];
        json.rows.forEach(function(item) {
            if (item.ParentID.toString() === "0") {
                data.push({ "id": item.ID, "parent": "#", "text": item.GroupName, "linker": item.Linker, "phone": item.Phone, "address": item.Address, "remark": item.Remark, "enabled": item.IsEnabled });
            } else {
                data.push({ "id": item.ID, "parent": item.ParentID, "text": item.GroupName, "linker": item.Linker, "phone": item.Phone, "address": item.Address, "remark": item.Remark, "enabled": item.IsEnabled });
            }
        });
        showTreeGroup(data);
    });
}

function searchTreeGroup() {
    //在文本框中输入值查询
    $("#tree_group").jstree(true).search($("#q").val());
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
        var item = data.node.original;
        showGroupInfo(item);
        //getGroupVehicle(item.id);
        //getGroupMember(item.id);
        //}
    });
}

function showGroupInfo(item) {
    $("#hidID").val(item.id);
    $("#hidParentID").val(item.parent);
    $("#txtGroupName").val(item.text);
    $("#txtGroupName").attr('readonly', true);
    $("#txtLinker").val(item.linker);
    $("#txtLinker").attr('readonly', true);
    $("#txtPhone").val(item.phone);
    $("#txtPhone").attr('readonly', true);
    $("#txtAddress").val(item.address);
    $("#txtAddress").attr('readonly', true);
    $("#txtRemark").val(item.remark);
    $("#txtRemark").attr('readonly', true);
    $("#chkEnabled").attr('checked', item.enabled ? true : false);
    $("#chkEnabled").attr('readonly', true);
}

function clearGroupItem(add) {
    if (add) {
        $("#hidID").val('0');
        //$("#hidParentID").val('0');
        $("#txtGroupName").val('');
        $("#txtLinker").val('');
        $("#txtPhone").val('');
        $("#txtAddress").val('');
        $("#txtRemark").val('');
        $("#chkEnabled").prop('checked', true);
    }

    $("#txtGroupName").attr('readonly', false);
    $("#txtLinker").attr('readonly', false);
    $("#txtPhone").attr('readonly', false);
    $("#txtAddress").attr('readonly', false);
    $("#txtRemark").attr('readonly', false);
    $("#chkEnabled").attr('readonly', false);
}

function getGroupVehicle(groupID) {
    var params = {
        group_id: groupID
    };
    var q = new Query('/group_vehicle/list', 'GET');
    q.request(params, function(json) {
        app.VehicleList = json.rows;
    });
}

function getGroupMember(groupID) {
    var params = {
        group_id: groupID
    };
    var q = new Query('/group_member/list', 'GET');
    q.request(params, function(json) {
        app2.MemberList = json.rows;
    });
}

function get_except_vehicle() {
    var text = $("#vehiclelist").html();
    if (text) {
        $("#mod_vehicle").modal('show');
    } else {
        var params = {
            group_id: $("#hidID").val()
        };

        var q = new Query('/group_vehicle/except_list', 'GET');
        q.request(params, function(json) {
            $("#vehiclelist").html(json.list);
            $('#vehiclelist').multiselect({ nonSelectedText: '请选择', enableFiltering: true, includeSelectAllOption: true, selectAllText: '全部选择', enableClickableOptGroups: true, buttonWidth: 150, maxHeight: 300 });
            $("#mod_vehicle").modal('show');
        });
    }
}

function get_except_member() {
    var text = $("#memberlist").html();
    if (text) {
        $("#mod_member").modal('show');
    } else {
        var params = {
            group_id: $("#hidID").val()
        };
        var q = new Query('/group_member/except_list', 'GET');
        q.request(params, function(json) {
            $("#memberlist").html(json.list);
            $('#memberlist').multiselect({ nonSelectedText: '请选择', enableFiltering: true, includeSelectAllOption: true, selectAllText: '全部选择', enableClickableOptGroups: true, buttonWidth: 150, maxHeight: 300 });
            $("#mod_member").modal('show');
        });
    }
}

function deleteGroup() {
    bootbox.setLocale("zh_CN");

    var id = $("#hidID").val();
    if (id <= 0) {
        return bootbox.alert('<font color=red>请选择需要删除的工作组</font>');
    }

    bootbox.confirm({
        title: hint.box_title,
        message: hint.confirm_delete,
        callback: function(result) {
            if (!result) return;
            var params = {
                id: id
            };
            var q = new Query('/group/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    get_list();
                });
            });
        }
    });
}

var app1 = new Vue({
    el: '#grid1',
    data: {
        VehicleList: [],
    },
});

var app2 = new Vue({
    el: '#grid2',
    data: {
        MemberList: []
    },
});

var app = new Vue({
    methods: {
        init: function() {
            var that = this;
            //$(".form-actions").hide();
            $(".icon-cloud-upload").parent().click(function() {
                clearGroupItem(true);
                $(".form-actions").show();
            });
            $(".icon-wrench").parent().click(function() {
                clearGroupItem(false);
                $(".form-actions").show();
            });
            $(".icon-trash").parent().click(function() {
                deleteGroup();
            });

            $("#vehicle_new").click(function() {
                get_except_vehicle();
            });

            $("#member_new").click(function() {
                get_except_member();
            });

            $("#saveGroup").click(function() {

            });

            $("#saveVehicle").click(function() {

            });

            $("#saveMember").click(function() {

            });

            get_list();
        }
    }
});

app.init();