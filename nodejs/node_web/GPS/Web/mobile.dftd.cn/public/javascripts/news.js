var loading = false;
var pageOptions = {
    displayNumber: 20,
    pagination: {}
};

function get_list(pageIndex) {
    var q = new Query('/news/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init();
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

function showDetail(id) {
    event.preventDefault();
    var params = {
        id: id
    };

    var q = new Query('/news/single', 'GET');
    q.request(params, function(json) {
        console.log(json)
        if (json.rows.length === 0) {
            $("#mapModal .content").html("暂无数据");
        } else {
            var item = json.rows[0];
            $("#mapModal .content").html(item.Content);
        }

        $("#mapModal").addClass('active');
        return;
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        Record: {},
        DataList: [],
        MsgInfo: '正在加载......'
    },
    methods: {
        loadPage: function() {
            this.DataList.length = 0;
            setTimeout(function() {
                get_list(1);
            }, 100);
        },
        init: function() {
            var that = this;
            that.loadPage();

            $("#btnSearch").click(function() {
                event.preventDefault();
                that.loadPage();
            });

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