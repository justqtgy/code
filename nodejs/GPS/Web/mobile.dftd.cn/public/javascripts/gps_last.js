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
        //console.log(json.rows)
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
    });
}

function showMap(lat, lng) {
    event.preventDefault();
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
            $(".begin-time").hide();
            $(".end-time").hide();
        },
        init: function() {
            var that = this;
            that.loadPage();
            $(".icon-search").click(function() {
                event.preventDefault();
                $("#searchModal").addClass('active');
            });
            $(".btn-primary").click(function() {
                event.preventDefault();
                that.DataList.length = 0;
                get_list(1);

                //close removeClass('active');
            });
        }
    }
});

app.init();