var displayNumber = 20;
//获取记录列表
function get_list(pageIndex){
	var data_format = {
		pageindex : pageIndex,
		pagesize : displayNumber,
		r:Math.random()
	};

	$.ajax({
		url : "/orderlist/list",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {
			$("#tt tbody").find("tr.newrow").remove();
			//显示记录
			$.each(json.Data, function(i, item) {
				$("<tr class='newrow'></tr>").append(
					"<td>" + item.ID+ "</td>" + 
					"<td>" + item.OrderNo+ "</td>" + 
					"<td>" + item.MemberID+ "</td>" + 
					"<td>" + item.Number+ "</td>" + 
					"<td>" + item.Price+ "</td>" + 
					"<td>" + item.AddTime+ "</td>" + 
					"<td>" + item.Status+ "</td>" + 
					"<td><a href='#' onclick='get_record("+item.ID+")'><i title='查看' class='fa fa-list'></i></a>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href='#' onclick='delete_record("+item.ID+")'><i title='删除' class='fa fa-remove'></i></a></td>"
				).appendTo($("#tt tbody"));
			});
			if (!$("#Pagination").html()) {
				$("#Pagination").page({ total: json.TotolRecord, pageSize : displayNumber }).on("pageClicked", function (event, pageIndex) { get_list(pageIndex+1); });
			}
		}
	});
}

//获取记录信息
function get_record(id){
	var data_format = {
		id : id
	};

	$.ajax({
		url : "/orderlist/single",
		type : "GET",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(json) {
			//显示记录
			$("#txtID").val(json.ID)
			$("#txtOrderNo").val(json.OrderNo)
			$("#txtMemberID").val(json.MemberID)
			$("#txtNumber").val(json.Number)
			$("#txtPrice").val(json.Price)
			$("#txtAddTime").val(json.AddTime)
			$("#txtStatus").val(json.Status)
			$("#mod_info").modal({ backdrop: 'static', keyboard: false });
		}
	});
}

//添加记录信息
function set_record(){
	var data_format = { 
		id : $("#txtID").val(),
		orderno : $("#txtOrderNo").val(),
		memberid : $("#txtMemberID").val(),
		number : $("#txtNumber").val(),
		price : $("#txtPrice").val(),
		addtime : $("#txtAddTime").val(),
		status : $("#txtStatus").val()
	};

	$.ajax({
		url : "/orderlist",
		type : "POST",
		dataType : "json",
		data : data_format,
		beforeSend : function() { $("#loading").show(); },
		complete : function() { $("#loading").hide(); },
		success : function(value) {
			if (!value) {
				bootbox.alert(hint.save_fail);
				return;
			}
			$("#mod_info").modal('hide');
			bootbox.alert(hint.save_success, function () { 
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
		title:hint.box_title,
		message:hint.confirm_delete,
		callback:function (result) {
			if (!result) return;
			var data_format = {
				id : id
			};

			$.ajax({
				url : "/orderlist",
				type : "DELETE",
				dataType : "json",
				data : data_format,
				beforeSend : function() { $("#loading").show(); },
				complete : function() { $("#loading").hide(); },
				success : function(value) {
					if (!value) {
						bootbox.alert(hint.delete_fail);
						return;
					}
					bootbox.alert(hint.delete_success, function () { 
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
	$("#txtID").val("");
	$("#txtOrderNo").val("");
	$("#txtMemberID").val("");
	$("#txtNumber").val("");
	$("#txtPrice").val("");
	$("#txtAddTime").val("");
	$("#txtStatus").val("");
}

