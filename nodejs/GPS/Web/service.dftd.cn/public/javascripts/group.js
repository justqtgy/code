var displayNumber = 10;

function get_list() {
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
        getGroupVehicle(item.id);
        getGroupMember(item.id);
        $("#vehiclelist").html('');
        getExceptVehicle(item.id);
        $("#memberlist").html('');
        getExceptMember(item.id);
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

function renderGroupItem(add) {
    if (add) {
        var pid = $("#hidID").val();
        $("#hidParentID").val(pid);
        $("#hidID").val('0');
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

    $(".form-actions").show();
}

function getGroupVehicle(groupID) {
    var params = {
        group_id: groupID
    };
    var q = new Query('/group_vehicle/list', 'GET');
    q.request(params, function(json) {
        app1.VehicleList = json.rows;
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

function getExceptVehicle(groupID) {
    var text = $("#vehiclelist").html();
    if (!text) {
        var params = {
            group_id: groupID
        };

        var q = new Query('/group_vehicle/except_list', 'GET');
        q.request(params, function(json) {
            $("#vehiclelist").html(json.list);
            $('#vehiclelist').multiselect({ nonSelectedText: '请选择', enableFiltering: true, includeSelectAllOption: true, selectAllText: '全部选择', enableClickableOptGroups: true, buttonWidth: 150, maxHeight: 300 });

        });
    }
}

function getExceptMember(groupID) {
    var text = $("#memberlist").html();
    if (text.length === 0) {
        var params = {
            group_id: groupID
        };
        var q = new Query('/group_member/except_list', 'GET');
        q.request(params, function(json) {
            console.log(json);
            $("#memberlist").append(json.list);
            $('#memberlist').multiselect({ nonSelectedText: '请选择', enableFiltering: true, includeSelectAllOption: true, selectAllText: '全部选择', enableClickableOptGroups: true, buttonWidth: 150, maxHeight: 300 });

        });
    }
}

// validation 
var handleValidation = function() {
    var form = $('#record');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);

    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "", // validate all fields including form hidden input
        rules: {
            groupName: {
                maxlength: 50,
                required: true
            }
        },

        invalidHandler: function(event, validator) { //display error alert on form submit              
            success.hide();
            error.show();
        },

        errorPlacement: function(error, element) { // render error placement for each input type
            var icon = $(element).parent('.input-icon').children('i');
            icon.removeClass('fa-check').addClass("fa-warning");
            icon.attr("data-original-title", error.text()).tooltip({ 'container': 'body' });
        },

        highlight: function(element) { // hightlight error inputs
            $(element)
                .closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group   
        },

        unhighlight: function(element) { // revert the change done by hightlight

        },

        success: function(label, element) {
            var icon = $(element).parent('.input-icon').children('i');
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            icon.removeClass("fa-warning").addClass("fa-check");
        },

        submitHandler: function(form) {
            success.show();
            error.hide();
            form.submit(); // submit the form
        }
    });

    $("#saveGroup").click(function() {
        if ($('#record').validate().form()) {
            var q = new Query('/group/set', 'POST', $("#record"));
            var params = q.init();
            q.request(params, function(json) {
                if (!json.ok) {
                    bootbox.alert(hint.save_fail);
                    return;
                }

                bootbox.alert(hint.save_success, function() {
                    location.reload();
                });
            });
        }
    });
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
                    location.reload();
                });
            });
        }
    });
}


function saveGroupVehicle() {
    var vehicleList = $("#vehiclelist").val();
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    var groupID = $("#hidID").val();
    var params = {
        groupID: groupID,
        vehicleList: vehicleList.toString()
    };
    var q = new Query('/group_vehicle/add', 'POST');
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }

        bootbox.alert(hint.save_success, function() {
            getGroupVehicle(groupID);
        });
    });
}

function deleteGroupVehicle(id) {
    bootbox.setLocale("zh_CN");
    bootbox.confirm({
        title: hint.box_title,
        message: hint.confirm_delete,
        callback: function(result) {
            if (!result) return;
            var params = {
                id: id
            };
            var q = new Query('/group_vehicle/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    var groupID = $("#hidID").val();
                    getGroupVehicle(groupID);
                });
            });
        }
    });
}


function saveGroupMember() {
    var memberList = $("#memberlist").val();
    if (!memberList) {
        alert('请选择人员');
        return;
    }
    var groupID = $("#hidID").val();
    var params = {
        groupID: groupID,
        memberList: memberList.toString()
    };
    var q = new Query('/group_member/add', 'POST');
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }

        bootbox.alert(hint.save_success, function() {
            getGroupMember(groupID);
        });
    });
}

function deleteGroupMember(id) {
    bootbox.setLocale("zh_CN");
    bootbox.confirm({
        title: hint.box_title,
        message: hint.confirm_delete,
        callback: function(result) {
            if (!result) return;
            var params = {
                id: id
            };
            var q = new Query('/group_member/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    var groupID = $("#hidID").val();
                    getGroupMember(groupID);
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
            handleValidation();
            //$(".form-actions").hide();
            $(".icon-cloud-upload").parent().click(function() {
                renderGroupItem(true);
            });
            $(".icon-wrench").parent().click(function() {
                renderGroupItem(false);
            });
            $(".icon-trash").parent().click(function() {
                deleteGroup();
            });

            $("#vehicle_new").click(function() {
                $("#mod_vehicle").modal('show');
            });

            $("#member_new").click(function() {
                $("#mod_member").modal('show');
            });

            $("#saveVehicle").click(function() {
                saveGroupVehicle();
            });

            $("#saveMember").click(function() {
                saveGroupMember();
            });

            get_list();
        }
    }
});

app.init();