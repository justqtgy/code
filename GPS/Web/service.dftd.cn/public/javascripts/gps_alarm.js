var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/gps_alarm/list', 'GET', pageIndex, displayNumber);
    var params = q.init();
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
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });
        },
        init: function() {
            //$(document).ajaxStop($.unblockUI);
            var that = this;
            that.loadPage();
            $("#btnSearch").click(function() {
                get_list(1);
            });
        }
    }
});

app.init();