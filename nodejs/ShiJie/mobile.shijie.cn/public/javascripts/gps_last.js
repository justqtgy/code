var pageOptions = {
    displayNumber: 20,
    pagination: {}
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
    var q = new Query('/gps_last/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);
    q.request(params, function(json) {
        //console.log(json.rows)
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
        if (app.DataList.length === 0) {
            app.MsgInfo = "暂无数据";
        }
        $("#more").show();
        pageOptions.pagination = q.showPagination(json.total, pageIndex);
        var _p = pageOptions.pagination;
        if (_p.pageIndex <= 0) {
            $("#more").hide();
        }
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
        DataList: [],
        MsgInfo: '正在加载......'
    },
    methods: {
        loadPage: function() {
            this.DataList.length = 0;
            setTimeout(function() {
                get_list(1);
            }, 100)
        },
        init: function() {
            $(".begin-time").hide();
            $(".end-time").hide();
            var that = this;
            that.loadPage();


            $(".btn-primary").click(function() {
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