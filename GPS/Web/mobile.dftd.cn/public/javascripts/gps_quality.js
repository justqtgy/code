var displayNumber = 10;
//获取记录列表
function get_list(pageIndex){
	var data_format = {
		pageindex : pageIndex,
		pagesize : displayNumber,
		startdate:$("#txtBeginTime").val(),
		enddate:$("#txtEndTime").val(),
		r:Math.random()
	};

	$.ajax({
		url : "/gps_quality/list",
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
					"<td>" + item.C1+ "</td>" + 
					"<td>" + item.C2+ "</td>" + 
					"<td>" + item.Empty+ "</td>" + 
					"<td>" + item.Full+ "</td>" + 
					"<td>" + item.Init+ "</td>" + 
					"<td>" + item.Volume+ "</td>" + 
					"<td>" + item.Quality+ "</td>" + 
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


//获取记录信息
function get_record(id){
	var data_format = {
		id : id
	};

	$.ajax({
		url : "/gps_quality/single",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {
			if(json.rows.length == 0) return;
			//显示记录
			var item = json.rows[0];
			$("#txtID").val(item.ID)
			$("#txtVehicleID").val(item.VehicleID)
			$("#txtC1").val(item.C1)
			$("#txtC2").val(item.C2)
			$("#txtEmpty").val(item.Empty)
			$("#txtFull").val(item.Full)
			$("#txtInit").val(item.Init)
			$("#txtVolume").val(item.Volume)
			$("#txtAddTime").val(item.AddTime)
			$("#mod_info").modal({ backdrop: 'static', keyboard: false });
		}
	});
}

//添加记录信息
function set_record(){
	var data_format = { 
		id : $("#txtID").val(),
		vehicleid : $("#txtVehicleID").val(),
		c1 : $("#txtC1").val(),
		c2 : $("#txtC2").val(),
		empty : $("#txtEmpty").val(),
		full : $("#txtFull").val(),
		init : $("#txtInit").val(),
		volume : $("#txtVolume").val(),
		addtime : $("#txtAddTime").val()
	};

	$.ajax({
		url : "/gps_quality",
		type : "POST",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(value) {
			if (!value) {
				bootbox.alert('记录保存失败');
				return;
			}
			$("#mod_info").modal('hide');
			bootbox.alert('记录保存成功', function () { 
				$("#Pagination").page('destroy'); 
				get_list(1); 
			});
		}
	});
}

//删除记录信息
function delete_record(id){
	bootbox.setLocale("zh_CN");
	bootbox.confirm({
		title:'提示',
		message:'确定要删除该记录吗?',
		callback:function (result) {
			if (!result) return;
			var data_format = {
				id : id
			};

			$.ajax({
				url : "/gps_quality",
				type : "DELETE",
				dataType : "json",
				data : data_format,
				beforeSend : function() { $("#loading").show(); },
				complete : function() { $("#loading").hide(); },
				success : function(value) {
					if (!value) {
						bootbox.alert('删除失败，请确认');
						return;
					}
					bootbox.alert('记录删除成功', function () { 
						$("#Pagination").page('destroy'); 
						get_list(1); 
					});
				}
			});
		}
	});
}

//弹出Modal
function show_modal(){
	clear_control();
	$("#mod_info").modal({ backdrop: 'static', keyboard: false });
}

//获取记录信息
function clear_control(){
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
	$("#txt").val("");
}

