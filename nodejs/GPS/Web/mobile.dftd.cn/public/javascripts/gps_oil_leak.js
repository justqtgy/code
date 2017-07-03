var displayNumber = 10;

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
    var q = new Query('/gps_oil_leak/list', 'POST', $("#search"), pageIndex, displayNumber);
    var params = q.init(data_foramt);
    if (!params.begintime || !params.endtime) {
        alert('请选择日期');
        return;
    }
    q.request(params, function(json) {
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
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

        },
        init: function() {
            var that = this;
            that.loadPage();
            $(".btn-primary").click(function() {
                event.preventDefault();
                that.DataList.length = 0;
                get_list(1);
            });
        }
    }
});

app.init();