var displayNumber = 10;
//获取记录列表
function get_list(pageIndex){
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
		carlist : carlist,
		pageindex : pageIndex,
		pagesize : displayNumber,
		r:Math.random()
	};

	$.ajax({
		url : "/vhc_online/list",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {console.log(json);
					
			$("#grid tbody").find("tr.newrow").remove();
			//显示记录
			$.each(json.rows, function(i, item) {
				$("<tr class='newrow'></tr>").append(
					"<td>" + (i+1)+ "</td>" + 
					"<td>" + item.CarNumber+ "</td>" + 
					"<td>" + item.g_day+ "</td>" + 
					"<td>" + (item.online==0? "<font color='red'>否</font>":"<font color='blue'>是</font>")+ "</td>" + 
					"<td>" + item.lastdaydistance+ "</td>" 				
				).appendTo($("#grid tbody"));
			});			 
	
			show_pager(json.total, pageIndex);
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
