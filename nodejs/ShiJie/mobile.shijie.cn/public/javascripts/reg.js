// function checkInfo() {
//     var q = new Query('/member/single', 'POST');
//     var params = q.init();
//     q.request(params, function(json) {
//         if (!json.ok) {
//             $.alert(hint.save_fail);
//             return;
//         }

//         $.alert(hint.save_success, function() {
//             location = '/user/login';
//         });
//     });
// }

function regist() {
    var q = new Query('/member/reg', 'POST', $('#reg-form'));
    var params = q.init();
    if(!params.account){
        return $.toptip('请填写登录账号');
    }
    if(!params.true_name){
        return $.toptip('请填写姓名');
    }
    if(!params.idcard){
        return $.toptip('请填写身份证');
    }
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert('注册账号失败：'+json.msg);
            return;
        }

        $.alert('恭喜您，账号注册成功', function() {
            location = '/users/login';
        });
    });
}

var app = new Vue({
    el: '#grid',
    data: {},
    methods: {
        init: function() {
            var that = this;
           // checkInfo();
        },
        regUser: function() {
            regist();
        }
    }
});

app.init();