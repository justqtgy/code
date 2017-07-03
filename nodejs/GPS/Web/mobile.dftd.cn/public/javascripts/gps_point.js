var pageOptions = {
    displayNumber : 20,
    pagination : {}
}

function get_list(pageIndex) {
    var vehicleList = $(".multiselect").val();
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var q = new Query('/gps_point/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);
    if (!params.begintime || !params.endtime) {
        alert('请选择日期');
        return;
    }
    q.request(params, function(json) {
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');

        $("#more").show();
        pageOptions.pagination = q.showPagination(json.total, pageIndex);
        var _p = pageOptions.pagination;
        if(_p.pageIndex<=0){
            $("#more").hide();
        }
    });
}

function showMap(lat, lng) {
    event.preventDefault();
    if (out_of_china(lng, lat)) {
        alert('当前位置错误');
        return;
    }
    $("#mapUrl").attr("src", "position.html?r=" + Math.random() + "&lat=" + lat + "&lng=" + lng);
    $("#mapModal").addClass('active');
    return;
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        loadPage: function() {
            this.DataList.length = 0;            
            setTimeout(function(){            
                get_list(1);    
            }, 100)
        },
        init: function() {
            var that = this;
            that.loadPage();      

            $("#btnSearch").click(function() {
                event.preventDefault();
                that.loadPage();
            });

            $("#more").click(function() {
                event.preventDefault();          
                var _p = pageOptions.pagination;
                get_list(_p.pageIndex);
            });
        }
    }
});

app.init();