var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

function load_tree(){
    // var groupVehicle=null;    
    
    // if(window.sessionStorage){
    //     groupVehicle = sessionStorage.getItem("tree_group_vehicle");
    //     if(groupVehicle){
    //         showTreeGroup(groupVehicle);
    //     }
    // }
    // if(!groupVehicle){
        
        $.get('/group_vehicle/tree_group',function(result){ 
            var data = []    
            result.rows.forEach(function(item) {
                if (item.Level.toString() === "0") {                    
                    data.push({ "vid": item.GroupID, "text": item.GroupName, "children" : [] });
                } else {
                    var index = data.length-1;
                    data[index]["children"].push({"vid" : item.VehicleID, "text" : item.VehicleNo})
                }
            });

            var _treeData = [{
                "id": 0, 
                "text": "车辆信息", 
                "state": {  
                    "opened": true,          //展示第一个层级下面的node  
                },  
                "children" : data
            }]  

            showTreeGroup(_treeData);
        })
    // }
}

function showTreeGroup(data) {
    console.log(data)
    $('#tree_group').jstree({
        "core": {
            "themes": {
                "theme": "classic",  
                "dots": true,  
            },

            "check_callback": true,
            'data': data
        },
        "plugins": ["dnd","json_data", "checkbox"]

    }).bind("select_node.jstree", function(e, data) {
        // if (data.node.id > 0) {
        //     node = data.node;
        //     var item = data.node.original;
        //     console.log(item);
        //     get_record(item);
        //     $(".form-actions").hide();
        // }
    });
}

function get_list(pageIndex) {
    var q = new Query('/gps_last/list', 'POST', $("#search"), pageIndex, displayNumber);

    var vehicleList = $(".multiselect").val();
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var params = q.init(data_foramt);
    q.request(params, function(json) {
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
    });
}

function showMap(lat, lng) {
    $("#mapUrl").attr("src", "position.html?r=" + Math.random() + "&lat=" + lat + "&lng=" + lng);
    $("#map-modal").modal('show');
    return;
}

var app = new Vue({
    el: '#tree_group',
    data: {
        DataList: []
    },
    methods: {
        init: function() {
            var that = this;
            load_tree();          
        }
    }
});

app.init();