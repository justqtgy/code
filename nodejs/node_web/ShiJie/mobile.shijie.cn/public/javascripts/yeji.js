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

function search(isAll) {
    var q = new Query('/member_stat/yeji', 'GET', $('#search'));
    var params = null;
    if(isAll)
        params = q.init();
    
    q.request(params, function(json) {
        if (!json.ok) {
            $.alert('查询失败：'+json.msg);
            return;
        }
        console.log(json)
        var item = json.result;
        if(item){
            app.Team_Yeji = item.team;
            app.My_Yeji = item.my;
        }        
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        Team_Yeji: {},
        My_Yeji: {},
        MsgInfo: '正在加载......'
    },
    methods: {
        init: function() {
            var that = this;
            search(true);
        },
        find: function() {
            search(false);
        }
    }
});

app.init();