var loading = false;
var pageOptions = {
    displayNumber: 20,
    pagination: {}
};

function get_list(pageIndex) {
    var GPSIDList = $(".multiselect").val();
    if (!GPSIDList) {
        alert('请选择设备');
        return;
    }
    GPSIDList = GPSIDList.join(",");
    var data_foramt = {
        GPSIDList: GPSIDList
    };
    var q = new Query('/gps_rubbish/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);
    if (!params.begintime || !params.endtime) {
        alert('请选择日期');
        return;
    }
    q.request(params, function(json) {
        if (json.rows.length > 0)
            app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
        if (app.DataList.length === 0) {
            app.MsgInfo = "暂无数据";
        }
        loading = false;
        pageOptions.pagination = q.showPagination(json.total, pageIndex);
        var _p = pageOptions.pagination;
        if (!_p.more) {
            loading = true;
            $(".weui-loadmore").hide();
        }
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

            $("#btnSearch").click(function() {
                event.preventDefault();
                that.loadPage();
            });

            // $("#more").click(function() {
            //     event.preventDefault();
            //     loading = true;
            //     var _p = pageOptions.pagination;
            //     get_list(_p.pageIndex);
            // });

            $("#grid").infinite().on("infinite", function() {
                if (loading) return;
                loading = true;
                var _p = pageOptions.pagination;
                get_list(_p.pageIndex);
            });
        }
    }
});

app.init();