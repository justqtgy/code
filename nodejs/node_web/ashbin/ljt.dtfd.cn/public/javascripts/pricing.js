function loadPricing() {
    $.getJSON("/config/pricing.json", function(result) {
        app.objPricing = result;
        app.myPricing = result['tanhua'];
    });
}

function postOrders(type) {
    var q = new Query('/orders/save', 'POST');
    var params = app.objPricing[type]
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        bootbox.alert('下单成功', function() {

        })
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
        join: function(type) {
            bootbox.confirm({
                title: '提示',
                message: '确定要下单吗？',
                buttons: {
                    cancel: { label: "取消" },
                    confirm: { label: '确定' }
                },
                callback: function(result) {
                    if (result) {
                        postOrders(type);
                    }
                }
            })
        }
    }
});

app.init();