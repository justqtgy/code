var displayNumber = 10;
var OrderStatus = {
    '0': '下单',
    '1': '确认订单',
    '-1': '订单已取消'
};

function get_list(pageIndex) {
    var q = new Query('/orders/pages', 'GET', $("#search"), pageIndex, displayNumber);
    var params = q.init();
    // if (!params.begintime || !params.endtime) {
    //     alert('请选择日期');
    //     return;
    // }
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert(json.msg);
            return;
        }
        //show_list(json.rows);
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
    });
}


//删除记录信息
function delete_record(id) {
    $.confirm({
        title: hint.box_title,
        text: hint.confirm_delete,
        onOK: function(result) {
            if (!result) return;

            var params = {
                id: id
            };
            var q = new Query('/orders/delete', 'POST');
            q.request(params, function(json) {
                if (json.ok != 1) {
                    $.alert(hint.delete_fail);
                    return;
                }
                $.alert(hint.delete_success, function() {
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
                that.loadPage();
            });

            $("#more").click(function() {
                var _p = pageOptions.pagination;
                get_list(_p.pageIndex);
            });
        },
        get_status: function(status) {
            return OrderStatus[status];
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