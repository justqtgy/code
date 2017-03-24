var displayNumber = 10;
var charts = {};
function create_charts(type, title) {
    $("#div_grid").hide();
 

    var carlist = $(".multiselect").val();
    if (carlist) {
        carlist = carlist.join(",");
    }
    if(!carlist){
        alert('请选择车辆');
        return;
    }

    var data_format = {
        begintime: $("#txtBeginTime").val(),
        endtime: $("#txtEndTime").val(),
        carlist: carlist,
        r: Math.random()
    };

    $.ajax({
        url: "/oil_vhc_dv/chart",
        type: "GET",
        dataType: "json",
        async: false,
        data: data_format,
        success: function (json) {

            var obj_car = [];
            var obj_shichang = [];
            //显示记录
            $.each(json.rows, function (i, item) {
                obj_car[i] = item.Car_Number;
                obj_shichang[i] = item.sum_oildv;
            });

            charts.categories = obj_car;
        
            charts.series = [{ name: '漏油量', color: '#FF8E46', data: obj_shichang }]
        }
    });

    charts.isDraw = true;
    show_charts(type, title, 400);
}
//获取记录列表
function get_list(type, title, carNumber, pageIndex) {
    $("#container").animate({ height: 200 }, 1000);

    if (charts.isDraw) {
        show_charts(type, title, 160);
    }
    charts.isDraw = false;
    $("#div_grid").show();


    var data_format = {
        begintime: $("#txtBeginTime").val(),
        endtime: $("#txtEndTime").val(),
        type: type,
        carNumber:carNumber,
		pageindex : pageIndex,
		pagesize : displayNumber,
		r:Math.random()
	};

	$.ajax({
	    url: "/oil_vhc_dv/list",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {
			$("#grid tbody").find("tr.newrow").remove();
			//显示记录
			$.each(json.rows, function(i, item) {console.log(item)
				$("<tr class='newrow'></tr>").append(
					"<td>" + (i + 1) + "</td>" +
                    "<td>" + item.CarNumber + "</td>" +
					"<td>" + new Date(item.createtime).toUTCFormat('YYYY-MM-DD HH24:MI:SS')+ "</td>" + 					
					"<td>" + item.oil.toFixed(0) + "</td>" +
					"<td>" + item.oildv.toFixed(0) + "</td>" +
					"<td>" + item.lat.toFixed(2) + "</td>" +
					"<td>" + item.lng.toFixed(2) + "</td>" +
					"<td>" + item.cstate+ "</td>" + 				 
					"<td>" + item.veo.toFixed(2) + "</td>" +
					"<td>" + item.totaldistance+ "</td>" + 
					"<td>" + item.distance.toFixed(2) + "</td>" +					 
					"<td>" + item.boil+ "</td>" +
                    "<td>" + getHideString(item.posinfo)+ "</td>" 
					
				).appendTo($("#grid tbody"));
			});
			show_pager(json.total, pageIndex);

			setScroll();
		}
	});
}

function show_pager(total, pageIndex){
    if(total==0){
		$('.pagination').empty();
		return;
	}
	var options = {
		bootstrapMajorVersion:3,
		currentPage: pageIndex,
		numberOfPages:15,
		totalPages: Math.ceil(total/displayNumber),
		onPageClicked:function(event, originalEvent, type, page){
			get_list(page);
		}
	}
	$('.pagination').bootstrapPaginator(options);
}



function show_charts(type, title,h) {
    if (!charts.isDraw) return;
    //BAR CHART
    $('#container').highcharts({
        chart: {
            type: 'column',
            height: h,
            reflow: true
        },
        title: {
            text: title,
        },
        xAxis: {
            categories: charts.categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: title
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            //shared: true,
            //useHTML: true
        },
        credits: { enabled: false },
        plotOptions: {
            column: {
                //pointPadding: 0.2,
                //borderWidth: 0,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function (e) {
							
                            var car_number = e.point.category;
                            if (car_number) {
                                if ($("#Pagination").html()) {
                                    $("#Pagination").page('destroy');
                                }
                                get_list(type, title, car_number, 1);
                            }
							
                        }
                    }
                }

            }
        },
        series: charts.series
    });

}

function setScroll() {
    var boxHeight = 200;
    var boxWidth = $(".box-body").width() ;
    $("#box_list").slimScroll({
        height: boxHeight,
        width:boxWidth,
        alwaysVisible: true,
    });
}
