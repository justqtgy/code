$("#send").click(function(){   
    var txt1 = $("#GPSID").val();
    var txt2 = $("#data").val();
	$("#result").html('')
	var now = getCurrentTime();
    var txt = txt1+txt2;
    console.log(txt);
	
    if($("#GPSID").val()==''){
        alert("请输入10位或12位GPSID");
        return
    }
    if($("#data").val()==''){
        alert("请输入数据");
        return
    }
    var socket = io.connect('http://120.24.68.95:7777');
	//向服务器发消息
    socket.emit("data", {content:txt});
    //从服务器获得消息
    socket.on("message", function(msg){
        alert('服务器回复：'+txt1+','+txt2+','+msg)
    });
	
	$("#reply").unbind('click').click(function(){
		if($("#GPSID").val()==''){
			alert("请输入10位或12位GPSID");
			return
		}
		if($("#data").val()==''){
			alert("请输入数据");
			return
		}
        var q = new Query('/gps_sending/list', 'POST', $("#selector"), txt1, txt2);
        var params = q.init();
        q.request(params, function(json) {
            var data = json.rows;
            var reply=data[0].Reply;
			//console.log(now)
			var time = data[0].AddTime;
			time = time.replace('T',' ').replace('.000Z','');
			//console.log(time)
			//console.log(new Date(now) - new Date(time))
            if(new Date(now) - new Date(time) < 0){
                if(reply.indexOf('5F4552524F52') >=0){
                    document.getElementById("result").innerHTML=
                        "<br /><p style='word-wrap:break-word'>"+data[0].Reply+"</p>"+
                        "<p>&nbsp;&nbsp;设备号："+data[0].GPSID+"</p>"+
                        "<p>&nbsp;&nbsp;车牌号："+data[0].VehicleNo+"</p>"+
                        "<p>&nbsp;&nbsp;结果："+'ERROR'+"</p>"+
						"<p>&nbsp;&nbsp;发送时间："+now+"</p>"+
                        "<p>&nbsp;&nbsp;回复时间："+time+"</p>"
                };
                if(reply.indexOf('5f4f4b') >=0){
                    document.getElementById("result").innerHTML=
                        "<br /><p style='word-wrap:break-word'>"+data[0].Reply+"</p>"+
                        "<p>&nbsp;&nbsp;设备号："+data[0].GPSID+"</p>"+
                        "<p>&nbsp;&nbsp;车牌号："+data[0].VehicleNo+"</p>"+
                        "<p>&nbsp;&nbsp;结果："+'OK'+"</p>"+
						"<p>&nbsp;&nbsp;发送时间："+now+"</p>"+
                        "<p>&nbsp;&nbsp;回复时间："+time+"</p>"
                }
                if(reply.indexOf('_OK') >=0){
                    document.getElementById("result").innerHTML=
                        "<br /><p style='word-wrap:break-word'>"+data[0].Reply+"</p>"+
                        "<p>&nbsp;&nbsp;设备号："+data[0].GPSID+"</p>"+
                        "<p>&nbsp;&nbsp;车牌号："+data[0].VehicleNo+"</p>"+
                        "<p>&nbsp;&nbsp;结果："+'OK'+"</p>"+
						"<p>&nbsp;&nbsp;发送时间："+now+"</p>"+
                        "<p>&nbsp;&nbsp;回复时间："+time+"</p>"
                }
            }
        });
    })
})