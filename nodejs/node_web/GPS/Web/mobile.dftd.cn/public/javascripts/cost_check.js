/**
 * Created by Administrator on 2017/7/24.
 */
var pageOptions = {
    displayNumber: 10,
    pagination: {}
}

function get_list(pageIndex) {
    var vehicleList = $(".multiselect").val();
    console.log(vehicleList)
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var q = new Query('/gps_section/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);
    $("#btnSearch").attr("disabled", "disabled");
    q.request(params, function(json) {
        $("#btnSearch").removeAttr("disabled");
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
            var that = this;
            that.loadPage();

            $("#btnSearch").click(function(event) {
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