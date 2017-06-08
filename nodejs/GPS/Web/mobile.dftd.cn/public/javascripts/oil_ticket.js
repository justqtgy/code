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
 
	$.ajax({
		url : "/oil_ticket/check_ticket",
		type : "POST",
		dataType : "json",
		data : data_format,
		//beforeSend : function() { $("#loading").show(); },
		//complete : function() { $("#loading").hide(); },
		success : function(result) {
			$("#oil_sum").hide();
            $("#oil_detail").hide();
            if(result.ok == "0"){                        
                if(result.type==1){
                    $("#oil_sum").show();     
                    $("#sp_oil1").text(result.oil_sum1.toFixed(2));
                    $("#sp_oil2").text(result.oil_sum2.toFixed(2));
                }else{                            
                    get_detail(result);
                    $("#oil_detail").show();
                }
                
            }
		}
	});
}

var get_detail = function(result){
	$("#grid tbody").find("tr.newrow").remove();
	//显示记录               
	$.each(result.rows, function(i, item) {
		var _class=' label-info';
		var _status = '正常';
		var _info = '';
		if(item.online == 0){
			_class=_class+' label-danger';
			_status = '设备异常';
		}else{
			if(item.oil_self>0 && item.oil_sys>0 && Math.abs(item.oil_diff) > 15){
				_class=_class+' label-warning';
				_status = '油票异常：多报油票';
				_info = '多报油票';
			}

			if(item.oil_self>0 && item.oil_sys==0){
				_class=_class+' label-warning';
				_status = '油票异常：虚报油票';
				_info = '虚报油票';
			}

			if(item.oil_self == 0 && item.oil_sys>15){
				_class=_class+' label-warning';
				_status = '油票异常：漏输油票';
				_info = '漏输油票';
			}
		}
		
		$("<tr class='newrow'></tr>").append(                                   
			"<td>" + item.carnumber+ "</td>"+
			"<td>" + item.createdate+ "</td>"+
			"<td><span class='label "+_class+"'>" + _status + "</span></td>"+
			"<td>" + item.oil_self.toFixed(2)+ "</td>"+
			"<td>" + item.oil_sys.toFixed(2)+ "</td>"+
			"<td>" + _info + item.oil_diff.toFixed(2)+ "</td>"
					
		).appendTo($("#grid tbody"));
	});               
}

//获取记录列表
function get_excel(){
	var params ='';       
	var ctrls = $('#search').serializeArray();        
	for(var c in ctrls){
		params +="&"+ctrls[c].name+"="+ctrls[c].value		
	}
                
	var carlist = $(".multiselect").val();
	if (carlist) {
		carlist = carlist.join(",");
	}
	if(!carlist){
		alert('请选择车辆');
		return;
	}
	params += "&carlist="+carlist
 
	
	var url = "/oil_ticket/excel?r="+Math.random()+params;
	console.log(url);
	location.href = url;
	
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
