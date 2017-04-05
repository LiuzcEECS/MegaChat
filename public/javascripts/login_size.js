function setFontSize(){
	var opw=document.body.clientWidth/50;
	var minw=(opw>16?opw:16);

	$("#input_area").css("font-size",minw);
	$("#input_area input").css("font-size",minw);
	$("#submit_button").css("font-size",minw*1.85);
	$("#login_title").css("font-size",minw*2);

	$("#login_div").css("left",(opw<15?opw/3*5:25)+"%");
	$("#br1").html(opw<10?"<br>":"&emsp;&emsp;");
	$("#br2").html(opw<10?"<br>":"&emsp;&emsp;");
}
