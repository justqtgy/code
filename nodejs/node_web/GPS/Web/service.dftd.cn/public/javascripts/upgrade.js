var svrAddress = 'http://127.0.0.1:7777';//'http://120.24.68.95:7777'
var socket = null;
var arrDevices = [];

var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

function load_tree(data){
   
        var _treeData = [{
            "gid": '', 
            "text": "在线设备", 
            "state": {  
                "opened": true,          //展示第一个层级下面的node  
            },  
            "children" : data
        }]  

        showTreeGroup(_treeData);
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


function connect_server(){
    socket = io.connect(svrAddress);

    arrDevices =[]
    //向服务器发消息
    socket.emit('online', "get_online");
    //从服务器获得消息
    socket.on("online", function(msg){        
        arrDevices.push({ "gid": msg, "text":msg});
    });
    socket.on("online_end", function(msg){
        load_tree(arrDevices)
    });
}

function send_data(){
    var ids =[]
    var tree = $("#tree_group").jstree();
    var nodes=$("#tree_group").jstree("get_selected"); 
    
    $.each(nodes, function(i, n) { 
        var item = tree.get_node(n);
        if(item.original.gid && item.original.text){
            ids.push(item.original.text)
        }
    }); 
    if(ids.length==0) {
        return alert('请选择要升级的设备');
    }


	//向服务器发消息
    socket.emit("upgrade", ids);
    //从服务器获得消息
    socket.on("upgrade_begin", function(msg){        
        $("#msg").append('服务器回复：'+msg)
    });

    socket.on("upgrade_end", function(msg){        
        $("#msg").append('服务器回复：'+msg)
    });
}

var app = new Vue({
    el: '#tree_group',
    data: {
        DataList: []
    },
    methods: {
        init: function() {

            $("#send").click(function(){ send_data(); });
            $("#connect").click(function(){ connect_server(); });
        }
    }
});

app.init();