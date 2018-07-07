var displayNumber = 10;
var editor;

function get_list(pageIndex) {
    var q = new Query('/last/pages', 'POST', $("#search"), pageIndex, displayNumber);
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

//获取记录信息
function get_record(id) {
    var params = {
        id: id
    };

    var q = new Query('/last/single', 'GET');
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }

        var item = json.rows[0];
        //显示记录
        $("#txtID").val(item.ID);
        $("#txtTitle").val(item.Title);
        editor.setData(item.Content);
        $("#mod_info").modal({ backdrop: 'static', keyboard: false });
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
            CKEDITOR.replace('txtContent');
            editor = CKEDITOR.instances.txtContent;

            get_list(1);
        },
        init: function() {
            var that = this;
            that.loadPage();

            $("#btnSearch").click(function() {
                get_list(1);
            });
           
        },
        show_modal: function(id) {
          
        },
    }
});

app.init();