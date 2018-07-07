var displayNumber = 10;
var editor;

function get_list(pageIndex) {
    var q = new Query('/power/pages', 'GET', $("#search"), pageIndex, displayNumber);
    var params = q.init();
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
    },
    methods: {
        loadPage: function() {
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });

            get_list(1);
        },
        init: function() {
            var that = this;
            that.loadPage();

            $("#btnSearch").click(function() {
                get_list(1);
            });
           
        },
    }
});

app.init();