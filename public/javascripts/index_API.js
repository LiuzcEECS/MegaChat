function login(usernameText,encryptedPassword){
	console.log("type = Login");
	console.log("POST USRN="+usernameText+" ENCRPSWD="+encryptedPassword);
	$.post(
		"/login",
		{
			username:usernameText,
			password:encryptedPassword
		},
		onReceiveSubmitResponse
	);
}

function signup(usernameText,encryptedPassword){
	console.log("type = Sign Up");
	console.log("POST USRN="+usernameText+" ENCRPSWD="+encryptedPassword);
	$.post(
		"/signup",
		{
			username:usernameText,
			password:encryptedPassword
		},
		onReceiveSignupResponse
	);
}

function setCookie(name,username,exdays){
	var exdate=new Date();
	exdate.setTime(exdate.getTime()+exdays*24*60*60*1000);
	var cstr=name+"="+escape(username)+";expires="+exdate.toGMTString()+";path=/";
	document.cookie=cstr;
}

function stopBubble(e){
	if (e&&e.stopPropagation){
		e.stopPropagation();
	}
	else{
		window.event.cancelBubble=true;
	}
}

function stopDefault(e){
	if (e&&e.preventDefault){
		e.preventDefault();
	}
	else{
		window.event.returnValue=false;
	}
	return false;
}
