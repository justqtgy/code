
function loadPricing(){
    $.getJSON("/config/pricing.json", function(result) { 
        app.thPricing = result["tanhua"]
        app.byPricing = result["bangyan"]
        app.zyPricing = result["zhuangyuan"]
        app.objPricing = result; 
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
        $.alert('下单成功');
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        thPricing: {},
        byPricing: {},
        zyPricing: {},
        objPricing:{}
    },
    methods: {
        init: function() {
            var that = this;
            loadPricing();
        },
        join:function(type){
            $.confirm({
                title:'提示',
                text:'确定要下单吗？', 
                onOK: function(result){
                    postOrders(type);
                }
            })
        }
    }
});

app.init();
