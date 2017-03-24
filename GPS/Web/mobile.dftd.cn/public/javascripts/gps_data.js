var displayNumber = 10;
//获取记录列表
function get_list(pageIndex){
	var data_format = {
		pageindex : pageIndex,
		pagesize : displayNumber,
		r:Math.random()
	};

	$.ajax({
		url : "/gps_data/list",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {
			$("#grid tbody").find("tr.newrow").remove();
			//显示记录
			$.each(json.rows, function(i, item) {
				$("<tr class='newrow'></tr>").append(
					"<td>" + item.ID+ "</td>" + 
					"<td>" + item.VehicleID+ "</td>" + 
					"<td>" + item.Version+ "</td>" + 
					"<td>" + new Date(item.GpsTime).toUTCFormat('YYYY-MM-DD HH:MI:SS')+ "</td>" + 
					"<td>" + item.Location+ "</td>" + 
					"<td>" + item.Lng+ "</td>" + 
					"<td>" + item.Lat+ "</td>" + 
					"<td>" + item.Speed+ "</td>" + 
					"<td>" + item.Direct+ "</td>" + 
					"<td>" + item.Status+ "</td>" + 
					"<td>" + item.Temp+ "</td>" + 
					"<td>" + new Date(item.AddTime).toUTCFormat('YYYY-MM-DD HH24:MI:SS')+ "</td>"  
				
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
