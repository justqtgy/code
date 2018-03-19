
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
    var begin=new Date(getCurrentTime()).toFormat('YYYY-MM-DDTHH24:MI');
    if (!vehicleList) {
        alert('请选择车辆');
        return
    }else{
        localStorage.setItem("begin", begin);
        localStorage.setItem("vehicleList_charge", vehicleList);
        $(":input[name='begintime']").val(begin);
        $(":input[name='endtime']").val("");
        localStorage.removeItem("end")
    }
    $(".btn-negative").removeAttr("disabled");
});

//结束按钮
$(".btn-negative").click(function(event){
    event.preventDefault();
    var vehicleList = $(".multiselect").val();
    var end=new Date(getCurrentTime()).toFormat('YYYY-MM-DDTHH24:MI');
    if (!vehicleList) {
        alert('请选择车辆');
        return
    }else {
        localStorage.setItem("end", end);
        $(":input[name='endtime']").val(end)
    }
})

//驾照类型
$(".license").change(function(){
    localStorage.setItem("license", $(".license option:selected").val());
});

//车辆类型
$(".car").change(function(){
    localStorage.setItem("car", $(".car option:selected").val());
});



function get_list(pageIndex) {

    var price=$(".price").val();
    var fare = $(".fare").val();
    var license=$(".license option:selected").val();
    var car=$(".car option:selected").val();
    console.log(price,fare,license,car);

    var vehicleList = $(".multiselect").val();
    if (!vehicleList) {
        alert('请选择车辆');
        return;
    }
    vehicleList = vehicleList.join(",");
    var data_foramt = {
        vehicleList: vehicleList
    };
    var q = new Query('/charge/list', 'POST', $("#search"), pageIndex, pageOptions.displayNumber);
    var params = q.init(data_foramt);

    if (!params.begintime) {
        alert('请选择开始');
        return;
    }
    if (!params.endtime) {
        alert('请选择结束');
        return;
    }
    if(price == ""){
        alert('请输入单位油价');
        return;
    }
    if(fare == ""){
        alert('请输入该趟路费');
        return;
    }
    if(license == 1){
        alert('请选择驾照类型');
        return;
    }
    if(car == 1){
        alert('请选择车辆类型');
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

        $.each(json.rows, function(i, item) {
            $("<li class='table-view-cell media'></li>").append(
                "<img class='media-object pull-left' src='images/arrow_icon.png'>"+
                "<div class='media-body'>"+
                item.VehicleNo +
                "<p>油耗：" + Number(Number(item.First_Oil)+Number(item.total)-Number(item.Last_Oil)).toFixed(2)+ "L</p>" +
                "<p>成本：" + parseFloat((Number(Number(item.First_Oil)+Number(item.total)-Number(item.Last_Oil)).toFixed(2) * price +fare) * license * car).toFixed(2) + "元</p>" +
                "<p>时间：" + new Date(item.First_Time).toUTCFormat('YYYY-MM-DD HH24:MI')+ '~'+new Date(item.Last_Time).toUTCFormat('YYYY-MM-DD HH24:MI')+"</p>"+
                "</div>"
            ).appendTo($("#grid .table-view"));
        });
        $("#more").show();
        q.showPagination(json.total, get_list);
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
        MsgInfo: '请点击搜索框'
    },
    methods: {
        startPage:function(){
            var begintime=localStorage.getItem("begin");
            if(begintime){
                $(".btn-negative").removeAttr("disabled");
            }
            $(".pull-right").click(function(event){
                event.preventDefault();
                $("#mulVehicle option").removeAttr("selected");
                var vehicleList =localStorage.getItem("vehicleList_charge");
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
            $(":input[name='begintime']").val(localStorage.getItem("begin"));
            $(":input[name='endtime']").val(localStorage.getItem("end"));
            if(localStorage.getItem("license")){
                $(".license").val(localStorage.getItem("license"));
            }else{
                $(".license").val(1);
            }
            if(localStorage.getItem("car")){
                $(".car").val(localStorage.getItem("car"));
            }else{
                $(".car").val(1);
            }



            $("#more").hide();
        },
        loadPage: function() {
            this.DataList.length = 0;
            setTimeout(function() {
                $("#grid .table-view").html("");
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