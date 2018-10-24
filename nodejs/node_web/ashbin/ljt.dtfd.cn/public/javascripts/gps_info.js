var displayNumber = 10;
const _status = {
        1 : '<font color="blue">正常</font>',
        0 : '<font color="red">禁用</font>'
    },
    _types = {
        1 : '地埋式',
        2 : '果皮桶'
    }

function get_list(pageIndex) {
    var q = new Query('/gps_info/pages', 'GET', null, pageIndex, displayNumber);
    var params = q.init();    
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        //show_list(json.rows);
        app.DataList = json.rows;
        q.showPagination(json.total, get_list);
    });
}
 
//设置记录信息
function save_record() {
    var q = new Query('/gps_info/set', 'POST', $("#record"));
    var params = q.init();
    console.log(params);
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(hint.save_fail);
            return;
        }
        $("#mod_info").modal('hide');
        bootbox.alert(hint.save_success, function() {
            get_list(1);
        });
    });
}

function add_record() {
    var ctrls = $("#record").serializeArray();
    for (var c in ctrls) {
        ctrls[c].value = '';
    }
    $("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

function get_record(id) {
    var params = {
        id: id
    };

    var q = new Query('/gps_info/single', 'GET', null);
    q.request(params, function(json) {
        if (!json.ok) {
            bootbox.alert(json.msg);
            return;
        }
        var item = json.rows[0];
        //显示记录
        var ctrls = $("#record").serializeArray();
        for (var c in ctrls) {
            console.log(ctrls[c].name);
            $("#"+ctrls[c].name).val(item[ctrls[c].name]);
        }
        $("#mod_info").modal({ backdrop: 'static', keyboard: false });
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: [],
        MsgInfo: '正在加载......',
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

            $("#btnChange").click(function() {
                save_record();
            });
        },
         
        add: function(){
            add_record();
        }
    }
});

app.init();