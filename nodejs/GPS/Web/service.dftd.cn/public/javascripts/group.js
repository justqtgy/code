var displayNumber = 10;

function get_list() {
    var q = new Query('/group/list', 'GET');
    q.request(null, function(json) {
        console.log(json.rows);
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
        var tempid = data.node.id;
        if (data.node.children.length === 0) {

        }
    });
}

function getGroupVehicle() {
    var q = new Query('/group_vehicle/list', 'GET');
    q.request(null, function(json) {

    });
}

function getGroupMember() {
    var q = new Query('/group_member/list', 'GET');
    q.request(null, function(json) {

    });
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {

        init: function() {
            var that = this;
            get_list();
        }
    }
});

app.init();