/**
 * Created by Administrator on 2017/8/4.
 */
var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/gps_rubbish/list', 'POST', $("#search"), pageIndex, displayNumber);

    var GPSIDList = $(".multiselect").val();
    if (!GPSIDList) {
        alert('请选择设备');
        return;
    }
    GPSIDList = GPSIDList.join(",");
    var data_foramt = {
        GPSIDList: GPSIDList
    };
    var params = q.init(data_foramt);
    q.request(params,function(json) {
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
    });
}

function showMap(lat, lng) {
    if (out_of_china(lng, lat)) {
        bootbox.alert('当前位置错误');
        return;
    }
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