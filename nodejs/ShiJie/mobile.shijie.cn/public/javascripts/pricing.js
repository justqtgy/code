function loadPricing() {
    $.getJSON("/config/pricing.json", function(result) {
        app.objPricing = result;
        initData();
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
        console.log(json);
        var item = json.rows[0],
            total = item.TotalMoney;
        for (var obj in app.objPricing) {
            var _pricing = app.objPricing[obj];
            if (total >= _pricing.min_value) {
                app.myPricing = _pricing;
            }
        }
    });
}

function postOrders() {
    var q = new Query('/orders/pricing', 'POST');
    var params = app.myPricing;
    console.log(params);
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert(json.msg);
            return;
        }
        $.alert('下单成功', function() {
            location.href = '/orders';
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
        pricing: function() {
            $.confirm({
                title: '提示',
                text: '确定要下单吗？',
                onOK: function(result) {
                    postOrders();
                }
            });
        }
    }
});

app.init();