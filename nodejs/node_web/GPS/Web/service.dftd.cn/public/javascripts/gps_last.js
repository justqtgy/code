var displayNumber = 10;

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
            var that = this;
            that.loadPage();
            $("#btnSearch").click(function() {
                get_list(1);
            });
        }
    }
});

app.init();