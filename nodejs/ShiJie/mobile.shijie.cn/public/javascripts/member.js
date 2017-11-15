var icons = {
    0: "fa fa-folder icon-state-warning icon-lg",
    1: "fa fa-folder icon-state-warning icon-lg",
    2: "fa fa-folder icon-state-warning icon-lg",
    3: "fa fa-folder icon-state-warning icon-lg"
};

function get_list() {
    var q = new Query('/member/list', 'GET');
    q.request(null, function(json) {
        json.rows.forEach(function(item) {
            switch(item.Level){
                case 1:
                    app.LevelList1.push({ "id": item.ID, "text": item.TrueName, "level": item.Level, "no": item.MemberNo, "icon": icons[item.Level] });
                    break;
                case 2:
                    app.LevelList2.push({ "id": item.ID, "text": item.TrueName, "level": item.Level, "no": item.MemberNo, "icon": icons[item.Level] });
                    break;
                case 3:
                    app.LevelList2.push({ "id": item.ID, "text": item.TrueName, "level": item.Level, "no": item.MemberNo, "icon": icons[item.Level] });
                    break;
            }
            
        });
        
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        Record: {},
        LevelList1: [],
        LevelList2: [],
        LevelList3: [],
        MsgInfo: '正在加载......'
    },
    methods: {
        loadPage: function() {
            get_list();
        },
        init: function() {
            var that = this;
            that.loadPage();

            // $("#btnSearch").click(function() {
            //     event.preventDefault();
            //     that.loadPage();
            // });

            // $("#grid").infinite().on("infinite", function() {
            //     if (loading) return;
            //     loading = true;
            //     var _p = pageOptions.pagination;
            //     get_list(_p.pageIndex);
            // });

            $('#sidebar ul li').click(function(){
                $(this).addClass('active').siblings('li').removeClass('active');
                var index = $(this).index();
                $('.j-content').eq(index).show().siblings('.j-content').hide();
            })
        }
    }
});

app.init();