var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

var map;

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
        get_position();
    }).bind("ready.jstree", function(e, data){
        get_position();
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

    var q = new Query('/gps_location/position', 'POST');
    var data_foramt = {
        vids: ids.toString()
    };
    
    var params = q.init(data_foramt);
    q.request(params, function(json) {
       
        // $.each(json.rows, function(i, item){
        //     console.log(item);
        //     showLocation(item);
        // });
        
    });
}

function showMap(lat, lng) {
    $("#mapUrl").attr("src", "position.html?r=" + Math.random() + "&lat=" + lat + "&lng=" + lng);
    $("#map-modal").modal('show');
    return;
}

function showLocation(data) {
    //经度
    var lng = Number(data.lng);
    var lat = Number(data.lat);
    var pos = wgs84togcj02(lng, lat);

    map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 16,
        center: pos
    });
    // 实例化点标记
    var marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: pos, //基点位置
        //offset: new AMap.Pixel(-10, -12), //相对于基点的偏移位置
    });

    //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker.getPosition());
    });

    //逆地理编码
    geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });

    geocoder.getAddress(pos, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var address = result.regeocode.formattedAddress; //返回地址描述

            infoWindow = new AMap.InfoWindow({
                content: address, //使用默认信息窗体框样式，显示信息内容
                offset: new AMap.Pixel(10, -20),
            });
            infoWindow.open(map, map.getCenter());

            map.setFitView();
        }
    });
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