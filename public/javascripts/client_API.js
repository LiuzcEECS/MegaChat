function User(name){
	this.username=name;

	//if(name=="Iraka")this.chatSerials=new Array(0,1,2,3,4,5);
	//if(name=="Danny")this.chatSerials=new Array(1,2,4,5);
	//if(name=="Sadame")this.chatSerials=new Array(2,5);

	this.bgImg="..\\images\\"+name+".jpg";
}

function Chat(serial,members){
	// null,members: create a null chat of members
	// serial,null: get members by serial

	/*if(Math.random()<0.5){
		this.name=null;
	}
	else{
		this.name="Chat "+serial;
	}*/
	this.id=(serial?serial:null);
	//this.entryCommand="Add "+serial;
	//this.entryValid=0;
	if(members){
		this.member=members;
	}
	else{
		this.member=new Array();
	}

	this.messages=new Array(); // Array of message
	/*if(!serial){
		this.textNum=0;
	}*/

	//this.textNum=5+Math.floor(5*Math.random());
}

function Text(index){
	this.index=index;
	this.author=usernameList[Math.floor(3*Math.random())];
	this.content=(new Array(
		"Hello.",
		"I'm fine",
		"*Totally \"Yes\"",
		"<input type='submit'>",
		"*http://localhost:81/public/images/icon.jpg"
	))[Math.floor(5*Math.random())];
}

//============================ Tool Functions =============================
function escapeHtml(str) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": '&quot;',
        "'": '&#39;',
        "/": '&#x2F;',
		"\n": "<br/>",
		" ":"&nbsp;"
    };
    return String(str).replace(/[&<>"'\/\n ]/g, function (s) {
        return entityMap[s];
    });
}

function getCookie(name){
	if(document.cookie.length<=0)return null; // no cookie
	var c_start=document.cookie.indexOf(name+"=");
	if(c_start<0)return null; // key not found
	c_start+=name.length+1;
	var c_end=document.cookie.indexOf(";",c_start);
	if(c_end<0)c_end=document.cookie.length;
	return unescape(document.cookie.substring(c_start,c_end));
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

function appendURL(textdiv,url_){ // append url visiting result to textdiv
	/*if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(str)){}*/
	console.log("Append IMG");
	textdiv.append("<img src='"+url_+"' alt='Load Image Failed' width='200px'>");

	/*$.ajax({
		url:url_,
		type:"GET",
		complete:function(response){
			if(response.status==200){
				textdiv.append("<img src='"+url_+"' alt='Load Image Failed' width='200px'>");
			}
			else{
				textdiv.append(escapeHtml("*"+url_));
			}
			scrollToDialogBottom();
		}
	});*/
}

function scrollToDialogBottom(){
	var scrollLength=$("#dialog_box_scroll")[0].scrollHeight;
	var scrollTop=$("#dialog_box_scroll")[0].scrollTop;
	var scrollShown=$("#dialog_box_scroll").height();

	console.log("Height:"+scrollLength+" At:"+scrollTop+" WinH:"+scrollShown);
	var atBottom=(scrollLength-(scrollTop+scrollShown)<scrollShown/2); // scroll upwards over half page

	if(atBottom){ // near bottom
		$("#dialog_box_scroll").animate({scrollTop:scrollLength},500); // scroll to bottom
	}
	else{
		console.log("Dialog box NOT scrolled");
	}
}

//============================= Setting APIs ==============================

function changePassword(npswd,cpswd){
	if(npswd.length<6||cpswd.length<6||npswd!=cpswd){
		$("#setting_panel").css("color","#ff0000");
	}
	else{
		console.log("PSWD Sent");
		console.log("encrypted pswd="+SHA256(npswd)+" image="+null);
		$.ajax({
			type:"POST",
			url:"/settings",
			data:{
				password:SHA256(npswd),
				background:null
			},
			success:onReceiveChangePasswordResponse,
			error:function(xhr,status){
				console.log("ERROR: "+xhr+" STATUS="+status);
				$("#setting_panel").empty();
				$("#setting_panel").text("Change Password Failed");
			}
		});
		//onReceiveChangePasswordResponse("1",null);
	}
}

function onReceiveChangePasswordResponse(data,status){
	console.log("Change Password Response Received!");
	console.log("   data="+data+" status="+status);
	$("#setting_panel").empty();
	$("#setting_panel").text(data=="1"?"Your password has been changed":"Change Password Failed");
}

function changeBG(base64img){
	$.ajax({
		type:"POST",
		url:"/settings",
		data:{
			password:null,
			background:base64img
		},
		success:function(data,status){
			console.log("Change BG Response Received!");
			console.log("   data="+data+" status="+status);
			onReceiveChangeBGResponse(data,status,base64img);
		},
		error:function(xhr,status){
			console.log("ERROR: "+xhr+" STATUS="+status);
			$("#setting_panel").empty();
			$("#setting_panel").text("Change BG Failed");
		}
	});
}

function onReceiveChangeBGResponse(data,status,base64img){
	$("#setting_panel").empty();
	if(data=="1"){
		$("#setting_panel").text("Your BG has been changed");
		setBG(base64img);
	}
	else{
		$("#setting_panel").text("Change BG Failed");
	}
}

//============================= Friend System ==============================
function newGroup(groupMsg){
    console.log("Add Group with:")
	console.log(groupMsg);
	if(groupMsg.name==""){
		$("#setting_panel")
            .empty()
            .html("Group name can't be NULL!<br>");
		return;
	}
    try{
		socket.emit("newGroup",groupMsg);
        $("#setting_panel")
            .empty()
            .html("Your invitation has been sent.<br>");
	}catch(err){
		$("#setting_panel")
			.empty()
			.html("Invitation delivery failed.<br>");
	}

}
function inviteFriend(name,msg){ // add: can't add yourself
	console.log("Invite "+name+" with message:");
	console.log(msg);
	try{
		if(name==localUser.username){
			console.log("Self Invitation");
			$("#setting_panel")
				.empty()
				.html("You can't invite yourself to be your friend!<br>");
		}
		else{
			console.log("Emit Friend");
			socket.emit("addFriend",{from:localUser.username,to:name});

			$("#setting_panel")
				.empty()
				.html("Your invitation has been sent.<br>");
		}
	}catch(err){
		$("#setting_panel")
			.empty()
			.html("Invitation delivery failed.<br>");
	}
}

function recoverFriendInvitation(reqs){
	if(reqs&&reqs.length>0){
		onReceiveFriendInvitation({from:reqs[0],to:localUser.username});
	}
}
//============================= Public APIs ===============================

function getUserByUsername(username, id, target){
	// only for test
	for(i in usernameList){
		if(target==usernameList[i])
			return {"status":1,"user":new User(target)};
	}
	return {"status":3,"user":null}; // user not found
}

function getChatBySerial(username, id, serial){
	// only for test
	if(serial<0||serial>5)return {"status":3,"chat":null};
	return {"status":1,"chat":new Chat(serial)};
}

function getChatContents(username, id, serial, start, num){
	// only for test
	var chat=localChats[serial]; // get chat info
	if(!chat)return {"status":3,"texts":null}; // no chat

	// Buggy! What if chat.textNum changed on server? Possibly when receiving new msgs.
	if(start<0||num<0||start+num>chat.textNum)return {"status":4,"texts":null}; // request out of range
	var texts=new Array(num);
	for(var i=0;i<num;i++){
		texts[i]=new Text(i);
	}
	return {"status":1,"texts":texts};
}

//================ receive event ====================
function onReceiveChat(message){
	console.log("New message");
	console.log(message);


	for(i in localChats){
		// a friend chat
		if((message.id==null&&message.from==localChats[i].member[0])||
		   (message.id!=null&& message.id==localChats[i].id)){
			console.log("Find Chat"+i);
			if(activeChat&&i==activeChat.index){ // send to activeChat
				// renew local chat textnum data

				//localChats[i].textNum++;
				appendToDialogBox(message);
				localChats[i].messages.push(message);
				// add info to chat
			}
			else{ // send to other chatbox
				//localChats[i].textNum++;
				localChats[i].messages.push(message);
				var targetChatboxUnread=$("#chatbox"+i).children(".chatbox_unread");
				targetChatboxUnread.text(parseInt(targetChatboxUnread.text())+1);
			}
			break;
		}
	}
	scrollToDialogBottom();
}

function sendTextToChat(username, uid, target, msg){
	// only for test
	//console.log("Send "+text+" To "+serial);
	console.log(target);
	if(target.id==null){
		var pmsg={message:{text:msg,from:localUser.username,id:null},to:target.member[0]};
		console.log("Friend Message Sending:");
		console.log(pmsg);
		socket.emit("pMessage",pmsg);
	}
	else{
		var pmsg={message:{text:msg,from:localUser.username,id:target.id},to:null};
		console.log("Group Message Sending:");
		console.log(pmsg);
		socket.emit("gMessage",pmsg);
	}

	console.log("Message sent!");
	console.log(pmsg);
}

function recoverMessages(msgs){
	console.log(msgs);
	for(i in msgs){
		/*for(k in localChats){
			if(msgs[i].from==localChats[k].member[0]){
				console.log("Find "+k);
				localChats[k].messages.push(msgs[i]);
				var targetChatboxUnread=$("#chatbox"+k).children(".chatbox_unread");
				console.log(parseInt(targetChatboxUnread.text()));
				targetChatboxUnread.text(parseInt(targetChatboxUnread.text())+1);
				break;
			}
		}*/
		onReceiveChat(msgs[i]);
	}

	socket.emit("clearMessage",null);
}
