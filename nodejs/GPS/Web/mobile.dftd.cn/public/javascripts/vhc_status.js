var displayNumber = 10;
//获取记录列表
function get_list(pageIndex){
	var data_format ={r:Math.random()};        
	var ctrls = $('#search').serializeArray();        
	for(var c in ctrls){
		data_format[ctrls[c].name]=ctrls[c].value;
	}
                
	var carlist = $(".multiselect").val();
	if (carlist) {
		carlist = carlist.join(",");
	}
	if(!carlist){
		alert('请选择车辆');
		return;
	}
	data_format.carlist = carlist;
	console.log(data_format)
	$.ajax({
		url : "/vehicle_status/vhc_status",
		type : "POST",
		dataType : "json",
		data : data_format,
		//beforeSend : function() { $("#loading").show(); },
		//complete : function() { $("#loading").hide(); },
		success : function(result) {
			if(result.ok == "0"){
				$("#grid tbody").find("tr.newrow").remove();
				//显示记录
				$.each(result.rows, function(i, item) {        
					$("<tr class='newrow'></tr>").append(                             
						"<td>" + item.carnumber+ "</td>" +         
						"<td>" + (item.online=='1'?'<span class=\'label label-info\'>正常</span>':'<span class=\'label label-danger\'>异常</span>')+ "</td>" +                            
						"<td>" + item.oil_rest.toFixed(0)+ "</td>" + 
						"<td>" + item.quality_diff.toFixed(0)+ "</td>"                             
					).appendTo($("#grid tbody"));
				});
			}
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
