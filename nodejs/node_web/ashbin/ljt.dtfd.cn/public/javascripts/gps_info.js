var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/gps_info/pages', 'GET', null, pageIndex, displayNumber);
    // var params = q.init();
    q.request(null, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        //show_list(json.rows);
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
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
            var q = new Query('/gps_info/delete', 'POST');
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

function add_record() {
    //显示记录
    $("#txtID").val(0);
    // $("#txtAccount").val('');
    // $("#txtPassword").val('');
    // $("#txtTrueName").val('');
    // $("#txtEmail").val('');
    // $("#txtMobile").val('');
    // $("#chkIsAdmin").attr("checked", false);
    $("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: [],
        MsgInfo: '正在加载......',
        _Status : {
            1 : '正常',
            2 : '禁用'
        }
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
                that.loadPage();
            });

            $("#more").click(function() {
                var _p = pageOptions.pagination;
                get_list(_p.pageIndex);
            });
        },
         
        add: function(){
            add_record();
        }
    }
});

app.init();