function checkInfo() {
    var q = new Query('/member/single', 'POST');
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert(hint.save_fail);
            return;
        }

        $.alert(hint.save_success, function() {
            location = '/user/login';
        });
    });
}

function regist(type) {
    var q = new Query('/member/save', 'POST');
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert(hint.save_fail);
            return;
        }

        $.alert(hint.save_success, function() {
            location = '/user/login';
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
            checkInfo();
        }
    }
});

app.init();