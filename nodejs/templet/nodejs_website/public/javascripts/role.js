var displayNumber = 20;

function get_list(pageIndex) {
    var q = new Query('/role/list', 'GET', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    
    q.request(params, function (json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }

        console.log(json.result);
        app.DataList = json.result;
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
        loadPage: function () {
            this.DataList = [];
            setTimeout(function () {
                get_list(1);
            }, 100);
        },
        init: function () { 
            var that = this;
            //that.loadPage();

            $("#btnSearch").click(function () {
                that.loadPage();
            });
        }
    }
});

app.init();