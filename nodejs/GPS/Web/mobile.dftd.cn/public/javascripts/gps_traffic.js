var displayNumber = 10;

function get_list(pageIndex) {
    var vehicleList = $(".multiselect").val();
    if (!vehicleList) {
        alert('请选择车辆......');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var q = new Query('/gps_traffic/list', 'POST', $("#search"), pageIndex, displayNumber);
    var params = q.init(data_foramt);
    if (!params.begintime || !params.endtime) {
        alert('请选择日期');
        return;
    }
    $("#btnSearch").attr("disabled", "disabled");
    q.request(params, function(json) {
        app.DataList = app.DataList.concat(json.rows);
        $("#btnSearch").removeAttr("disabled");
        $("#searchModal").removeClass('active');
    });
}

function showTraffic(id) {
    event.preventDefault();
    $("#mapUrl").attr("src", "replay.html?r=" + Math.random() + "&id=" + id);
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
            $("#btnSearch").click(function() {
                event.preventDefault();
                get_list(1);
            });
        }
    }
});

app.init();