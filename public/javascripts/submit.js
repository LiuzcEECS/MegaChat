var mode=0; // 0:login 1:register

function keyPressed(e){
	if(event.which==13||event.which==10){
		submit(e);
	}
}

function submit(e){
	var usrn=$("#username").val();
	var pswd=$("#password").val();
	var cfpw=$("#confirm_password").val();
	var ecpw=SHA256(pswd); // Encrypted Password

	$("#login_title").text("Megachat");
	if(pswd.length<6){ // too short a password
		$("#password_text").css("color","#ff0000");
		stopBubble(e);
		stopDefault(e);
		return;
	}
	if(mode==1&&pswd!=cfpw){ // password and confirm_password not match
		$("#confirm_password_text").css("color","#ff0000");
		stopBubble(e);
		stopDefault(e);
		return;
	}

	if(mode==0){
		login(usrn,ecpw);
	}
	if(mode==1){
		signup(usrn,ecpw);
	}

	stopBubble(e);
	stopDefault(e);
}

function onReceiveSubmitResponse(data,status){
	console.log("Submit Response Received!");
	console.log("   data="+data+" status="+status);
	if(data=="1"){
		console.log("Login Successful at client");
		window.location.href=".\\chat";
	}
	else if(data=="2"){ // username or password error
		$("#login_title").text("Username or Password Incorrect");
		$("#username_text").css("color","#ff0000");
		$("#password_text").css("color","#ff0000");
	}
	else if(data=="0"){ // server error
		$("#login_title").text("Server Error");
	}
}

function onReceiveSignupResponse(data,status){
	initColor(); // later...
	console.log("Signup Response Received!");
	console.log("   data="+data+" status="+status);
	if(data=="1"){
		console.log("Login Successful at client");
		window.location.href=".\\chat";
	}
	else if(data=="2"){
		$("#username_text").css("color","#ff0000");
	}
	else if(data=="0"){
		$("#login_title").text("Server Error");
	}
}

function initColor(){
	$("#username_text").css("color","#000000");
	$("#password_text").css("color","#000000");
	$("#confirm_password_text").css("color","#000000");
	$("#login_title").text("Megachat");
}

function changeMode(){
	mode=1-mode;
	console.log("Change Mode="+mode);
	initColor();
	if(mode==0){ // to login
		$("#username_text").text("Username:");
		$("#password_text").text("Password:");
		$("#register").text("Register");
		$("#confirm_password_text").css("display","none");
		$("#confirm_password").val("").css("display","none");
	}
	else{ // to register
		$("#username_text").text("New Username:");
		$("#password_text").text("New Password:");
		$("#register").text("Login");
		$("#confirm_password_text").css("display","inline-block");
		$("#confirm_password").val("").css("display","inline-block");
	}
}
