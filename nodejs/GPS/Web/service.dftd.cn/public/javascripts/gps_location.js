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

var map = new AMap.Map("container", {resizeEnable: true,   zoom: 9});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
//逆地理编码
var geocoder = new AMap.Geocoder({
    radius: 1000,
    extensions: "all"
});

function showLocation(data) {
    var lnglats = []
    $.each(data, function(i, item){
        //经度
        var lng = Number(item.Lng);
        var lat = Number(item.Lat);
        var pos = wgs84togcj02(lng, lat);
        lnglats.push(pos);
    });

    map.clearMap();
    for(var i=0, marker;i<lnglats.length;i++){
        (function(i){
            // 实例化点标记
            var marker = new AMap.Marker({ //添加自定义点标记
                map: map,
                position: lnglats[i], //基点位置
                icon: "http://webapi.amap.com/images/car.png",
                //offset: new AMap.Pixel(-10, -12), //相对于基点的偏移位置
            });

            geocoder.getAddress(lnglats[i], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    var address = result.regeocode.formattedAddress; //返回地址描述         
                    marker.content = address + '<br/>当前油量：'+ data[i].CurOil;
                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});
                }
            });
        })(i);
    }
    map.setFitView();
}

function markerClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
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
        }
    }
});

app.init();