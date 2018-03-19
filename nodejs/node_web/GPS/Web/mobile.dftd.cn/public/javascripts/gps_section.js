
var pageOptions = {
    displayNumber: 10,
    pagination: {}
}

$(".btn-negative").attr("disabled", "disabled");

var localStorage = window.localStorage;

//开始按钮
$(".btn-positive").click(function(event){
    event.preventDefault();
    var vehicleList = $(".multiselect").val();
    var begintime=new Date(getCurrentTime()).toFormat('YYYY-MM-DDTHH24:MI');
    if (!vehicleList) {
        alert('请选择车辆');
        return
    }else{
        localStorage.setItem("begintime", begintime);
        localStorage.setItem("vehicleList", vehicleList);
        $(":input[name='begintime']").val(begintime);
        $(":input[name='endtime']").val("");
		localStorage.removeItem("endtime")
    }
    $(".btn-negative").removeAttr("disabled");
})
//结束按钮
$(".btn-negative").click(function(event){
    event.preventDefault();
    var vehicleList = $(".multiselect").val();
    var endtime=new Date(getCurrentTime()).toFormat('YYYY-MM-DDTHH24:MI');
    if (!vehicleList) {
        alert('请选择车辆');
        return
    }else {
        localStorage.setItem("endtime", endtime);
        $(":input[name='endtime']").val(endtime)
    }
})


function get_list(pageIndex) {
    var vehicleList = $(".multiselect").val();
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var q = new Query('/gps_section/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);
    if (!params.begintime) {
        alert('请选择开始');
        return;
    }
    if (!params.endtime) {
        alert('请选择结束');
        return;
    }
    $("#btnSearch").attr("disabled", "disabled");
    q.request(params, function(json) {
        $("#btnSearch").removeAttr("disabled");
        app.DataList = app.DataList.concat(json.rows);
        $("#searchModal").removeClass('active');
        if (app.DataList.length === 0) {
            app.MsgInfo = "暂无数据";
        }
        $("#more").show();
        pageOptions.pagination = q.showPagination(json.total, pageIndex);
        var _p = pageOptions.pagination;
        if (_p.pageIndex <= 0) {
            $("#more").hide();
        }
    });
}


var app = new Vue({
    el: '#grid',
    data: {
        DataList: [],
        MsgInfo: '请点击搜索框继续'
    },
    methods: {
        startPage:function(){
            var begintime=localStorage.getItem("begintime");
            if(begintime){
                $(".btn-negative").removeAttr("disabled");
            }
            $(".pull-right").click(function(event){
                event.preventDefault();
                $("#mulVehicle option").removeAttr("selected");
                var vehicleList =localStorage.getItem("vehicleList");
                if(vehicleList!=null){
                    vehicleList=vehicleList.split(",");
                    for(var i=0;i<vehicleList.length;i++){
                        for(var j=0;j<$('#mulVehicle optgroup option').length;j++){
                            if($('#mulVehicle optgroup option').eq(j).val()==vehicleList[i]){
                                $('#mulVehicle optgroup option').eq(j).prop("selected","true");
                                $('#mulVehicle').multipleSelect()
                            }
                        }
                    }
                }
            })
            $(":input[name='begintime']").val(localStorage.getItem("begintime"));
            $(":input[name='endtime']").val(localStorage.getItem("endtime"));
            $("#more").hide();
        },
        loadPage: function() {
			this.DataList.length = 0;
            setTimeout(function() {
                get_list(1);
            }, 100)
        },
        init: function() {
            var that = this;
            that.startPage();
            $("#btnSearch").click(function(event) {
                event.preventDefault();
                that.loadPage();
            });

            $("#more").click(function(event) {
                event.preventDefault();
                var _p = pageOptions.pagination;
                get_list(_p.pageIndex);
            });
        }
    }
});

app.init();