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
    var q = new Query('/gps_alarm/list', 'POST', $("#search"), pageIndex, displayNumber);
    var params = q.init(data_foramt);
    q.request(params, function(json) {
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
        if (app.DataList.length === 0) {
            app.MsgInfo = "没有数据";
        }
    });
}


var app = new Vue({
    el: '#grid',
    data: {
        DataList: [],
        MsgInfo: '正在加载......'
    },
    methods: {
        loadPage: function() {

        },
        init: function() {
            var that = this;
            that.loadPage();
            $("#btnSearch").click(function() {
                event.preventDefault();
                that.DataList.length = 0;
                get_list(1);
            });
        }
    }
});

app.init();