function loadPricing(type) {
    $.getJSON("/config/pricing.json", function(result) {
        app.objPricing = result;
    });
}

function initData() {
    var q = new Query('/member_stat/stat', 'GET');
    q.request(null, function(json) {
        if (!json.ok) {
            $.alert(json.msg);
            return;
        }

        // if (json.rows.length === 0) {
        //     $.alert('系统异常，请稍后重试');
        //     return;
        // }

        var item = json.rows[0],
            total = item.TotalMoney;
        for (var obj in app.objPricing) {
            if (total >= obj.min_value && total < obj.max_value) {
                app.myPricing = obj;
            }
        }
    });
}

function postOrders(type) {
    var q = new Query('/orders/save', 'POST');
    var params = app.objPricing[type];
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert(json.msg);
            return;
        }
        $.alert('下单成功', function() {

        });
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        myPricing: {},
        objPricing: {}
    },
    methods: {
        init: function() {
            var that = this;
            loadPricing();
        },
        pricing: function(type) {
            $.confirm({
                title: '提示',
                text: '确定要下单吗？',
                onOK: function(result) {
                    if (result) {
                        postOrders(type);
                    }
                }
            });
        }
    }
});

app.init();