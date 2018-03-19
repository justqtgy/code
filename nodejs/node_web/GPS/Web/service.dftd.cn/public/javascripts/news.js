var displayNumber = 10;
var editor;

function get_list(pageIndex) {
    var q = new Query('/news/list', 'POST', $("#search"), pageIndex, displayNumber);
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

    var q = new Query('/news/single', 'GET');
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

function add_record() {
    //显示记录
    $("#txtID").val(0);
    $("#txtTitle").val('');
    editor.setData('');

    $("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

//添加记录信息
function set_record() {

    var q = new Query('/news/set', 'POST', $("#record"));
    var params = q.init();
    var editor = CKEDITOR.instances.txtContent;
    params.content = editor.getData();
    if (!params.title) {
        return bootbox.alert('<font color=red>请输入标题</font>');
    }
    if (!params.content) {
        return bootbox.alert('<font color=red>请填写内容</font>');
    }
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }
        $("#mod_info").modal('hide');
        bootbox.alert(hint.save_success, function() {
            get_list(1);
        });
    });

}

//删除记录信息
function delete_record(id) {
    bootbox.setLocale("zh_CN");
    bootbox.confirm({
        title: hint.box_title,
        message: hint.confirm_delete,
        callback: function(result) {
            if (!result) return;

            var params = {
                id: id
            };
            var q = new Query('/news/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    bootbox.alert(hint.delete_fail);
                    return;
                }
                bootbox.alert(hint.delete_success, function() {
                    get_list(1);
                });
            });
        }
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
            $("#btnOK").click(function() { set_record(); });
        },
        show_modal: function(id) {
            add_record();
        },
    }
});

app.init();