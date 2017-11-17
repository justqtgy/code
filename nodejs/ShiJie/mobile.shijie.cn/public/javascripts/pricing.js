function loadPricing() {
    $.getJSON("/config/pricing.json", function(result) {
        app.objPricing = result;
        app.myPricing = result['tanhua'];
        console.log(result)
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
        pricing: function(type) {
            $.confirm({
                title: '提示',
                text: '确定要下单吗？',
                onOK: function(result) {
                    if (result) {
                        postOrders(type);
                    }
                }
            })
        }
    }
});

app.init();