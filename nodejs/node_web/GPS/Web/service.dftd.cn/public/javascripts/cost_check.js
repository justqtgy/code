/**
 * Created by Administrator on 2017/8/1.
 */
var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/cost_check/list', 'POST', $("#search"), pageIndex, displayNumber);
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


var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        loadPage: function() {
            $(".form_datetime").datetimepicker({
                autoclose: 1,
                todayHighlight: 1,
                weekStart: 1,
                language:'zh-CN',
                minuteStep:5,
                fromat:'yyyy-MM-dd HH:mm',
                kind:'dtkTime'
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