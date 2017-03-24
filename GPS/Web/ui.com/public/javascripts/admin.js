var displayNumber = 1;
//获取记录列表
// function get_list(pageIndex){
// 	var data_format = {
// 		pageindex : pageIndex,
// 		pagesize : displayNumber,
// 		r:Math.random()
// 	};
     
// 	var ctrls = $('#search').serializeArray();        
// 	for(var c in ctrls){
// 		data_format[ctrls[c].name]=ctrls[c].value;
// 	}
                
// 	$.ajax({
// 		url : "/admin/list",
// 		type : "GET",
// 		dataType : "json",
// 		data : data_format,
// 		beforeSend : function() { $("#loading").show(); },
// 		complete : function() { $("#loading").hide(); },
// 		success : function(json) {
// 			app.DataList = json.rows;
// 			show_pager(json.total, pageIndex);
// 		}
// 	});
// }

// function show_pager(total, pageIndex){
// 	if(total==0){
// 		$('.pagination2').empty();
// 		return;
// 	}
// 	var options = {
// 		bootstrapMajorVersion:3,
// 		currentPage: pageIndex,
// 		numberOfPages:15,
// 		totalPages: Math.ceil(total/displayNumber),
// 		onPageClicked:function(event, originalEvent, type, page){
// 			get_list(page);
// 		}
// 	}
// 	$('.pagination2').bootstrapPaginator(options);
// }


function get_list(pageIndex){
	var q = new Query('/admin/list', 'GET', pageIndex, displayNumber);			
	var params = q.init();
	q.request(params, function(json){
		app.DataList = json.rows;					
		q.showPagination(json.total, get_list);                                  
	});				
}


var app = new Vue({
	el : '#grid',
	data : {
		DataList : [],
		DataList2 : []
	},
	methods : {
		loadPage : function(){			
			$(".form_datetime").datepicker({ format: 'yyyy-mm-dd' });
		},
		init : function(){			
			var that = this;
			that.loadPage();
			$("#btnSearch").click(function(){
				get_list(1);
            });   
		}
	}
});

app.init();