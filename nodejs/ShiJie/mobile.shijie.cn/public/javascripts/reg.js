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

function regist() {
    var q = new Query('/member/save', 'POST', 'reg-form');
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
    data: {},
    methods: {
        init: function() {
            var that = this;
            checkInfo();
        },
        regUser: function() {
            regist();
        }
    }
});

app.init();