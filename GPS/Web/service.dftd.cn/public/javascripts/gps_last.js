var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/gps_last/list', 'GET', pageIndex, displayNumber);

    var vehicleList = $(".multiselect").val();
    vehicleList = vehicleList.join(",");
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    var data_foramt = {
        vehicleList: vehicleList
    };
    var params = q.init(data_foramt);
    q.request(params, function(json) {
        console.log(json);
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
    });
}

function showMap(lat, lng) {
    $("#mapUrl").attr("src", "/traffic.html?lat=" + lat + "&lng=" + lng);
    return;
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        loadPage: function() {
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });
        },
        init: function() {
            $('.gps_last').addClass("active open");
            var that = this;
            that.loadPage();
            $("#btnSearch").click(function() {
                get_list(1);
            });
        }
    }
});

app.init();