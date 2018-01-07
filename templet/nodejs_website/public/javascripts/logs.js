var displayNumber = 20;

function get_list(pageIndex) {
    var q = new Query('/logs/pages', 'GET', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    if (!params.begin_time || !params.end_time) {
        alert('请选择日期');
        return;
    }
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        //show_list(json.rows);
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
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
            }, 100);
        },
        init: function() {
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });

            var that = this;
            that.loadPage();

            $("#btnSearch").click(function() {
                that.loadPage();
            });             
        }
    }
});

app.init();