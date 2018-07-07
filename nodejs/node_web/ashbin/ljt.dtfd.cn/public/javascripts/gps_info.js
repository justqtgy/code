var displayNumber = 10;

function get_list(pageIndex) {
    var q = new Query('/gps_info/pages', 'GET', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    if (!params.begintime || !params.endtime) {
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
            $(".date-picker").datepicker({
                autoclose: 1,
                todayHighlight: 1
            });

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
         
        get_do: function(id, status) {
            var _do = '';
            switch (status) {
                case 0:
                    _do = "<a href='javascript:void(" + id + ")' onclick='delete_record(" + id + ")'>取消订单</a>";

            }
            return _do;
        },
    }
});

app.init();