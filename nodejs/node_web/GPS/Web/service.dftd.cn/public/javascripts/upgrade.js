var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

function load_tree(){
    $.get('/group_vehicle/tree_group',function(result){ 
        var data = []    
        result.rows.forEach(function(item) {
            if (item.Level.toString() === "0") {                    
                data.push({ "gid": item.GroupID, "vid":0, "text": item.GroupName, "children" : [] });
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
}

function showTreeGroup(data) {
    $('#tree_group').jstree({
        "core": {
            "themes": {
                "theme": "classic",  
                "dots": true,  
            },

            "check_callback": true,
            'data': data
        },
        "plugins": ["types","state", "checkbox"],

    }).bind("activate_node.jstree", function(e, data) {

    }).bind("ready.jstree", function(e, data){

    });
}

function get_position() {
    var ids =[]
    var tree = $("#tree_group").jstree();
    var nodes=$("#tree_group").jstree("get_selected"); 
    
    $.each(nodes, function(i, n) { 
        var item = tree.get_node(n);
        if(item.original.vid>0){
            ids.push(item.original.vid)
        }
    }); 
    if(ids.length==0) {
        return showLocation(null);
    }
    var q = new Query('/gps_location/position', 'POST');
    var data_foramt = {
        vids: ids.toString()
    };
    
    var params = q.init(data_foramt);
    q.request(params, function(json) {       
        showLocation(json.rows);
    });
}

function send_data(){
    var txt = 'aaaaaaaaaaaaa';
    var socket = io.connect('http://120.24.68.95:7777');
	//向服务器发消息
    socket.emit("data", {content:txt});
    //从服务器获得消息
    socket.on("message", function(msg){
        alert('服务器回复：'+msg)
    });
}

var app = new Vue({
    el: '#tree_group',
    data: {
        DataList: []
    },
    methods: {
        init: function() {
            var _h = $(document.body).height();
            $(".map").css("height", _h-160);
            load_tree();   
            
            $("#send").click(function(){ send_data(); });
        }
    }
});

app.init();