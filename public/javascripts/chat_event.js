//var usernameList=new Array("Iraka","Danny","Sadame");
var localUser;
var localChats=new Array();
var name_list=new Array();
var activeChat=null; // activeChat is a chatbox !

function ChatboxNoEvent(index,title){
	this.box=$("<div></div>").attr("id","chatbox"+index).addClass("chatbox").append(
		$("<div></div>").addClass("chatbox_title").html(title)
	).append(
		$("<div></div>").addClass("chatbox_unread").text(0)
	).append(
		$("<div></div>")
			.addClass("del_friend_box")
			.html("&times;")
			.click(function(e){
				stopBubble(e);
				stopDefault(e);
				var chat=localChats[index];
				console.log(index);
				if(chat.id==null){ // del a friend
					console.log("delfriend"+chat.member[0]);
					socket.emit("deleteFriend",{to:chat.member[0]});
					$("#chatbox"+index).remove();
				}
				else{
					console.log("exitgroup"+chat.id);
					socket.emit("exitGroup",{groupId:chat.id});
					$("#chatbox"+index).remove();
				}

			})
    );
	//this.unread=0;
	this.title=title;
	this.index=index;
}

function Chatbox(index,title){
	var chatbox=new ChatboxNoEvent(index,title);
	chatbox.box.click(function(e){
		//console.log(chatbox.index);
		showDialogBox(chatbox);
	});
	return chatbox;
}

var chat_server="http://chat.liuzceecs.com:3000"
var socket;
function chatInit(){
	//readLocalUser(); // get the local username

	initSocketIO();
	getLocalInfo(settingInit);
	initDialogProcess();

	//settingInit();
}

function settingInit(localInfoData){
    var drop=document.getElementById("input_panel");
	drop.addEventListener("drop",inDragHandle,false);

	$("#user_panel").empty(); // in fact, you shall check the difference between new/old info and change the difference
	$("#dialog_box_title").text("No Dialog Yet");
	$("#setting_panel_wrapper").hide();

	$("<div></div>") // add username
		.text(localUser?localUser.username:"----")
		.attr("id","username_box")
		.click(function(){
			addUserOptions();
			$("#setting_panel_wrapper").fadeIn();
		})
		.appendTo("#user_panel");

	$("<div></div>") // add setting button
		.text("*Settings")
		.attr("id","setting_box")
		.click(function(){
			addMainOptions();
			$("#setting_panel_wrapper").fadeIn();
		})
		.appendTo("#user_panel");

	$("#setting_panel_wrapper").click(function(){ // click to hide settings
		console.log("cover click");
		$("#setting_panel_wrapper").fadeOut("normal",function(){
			$("#setting_panel")
				.css("color","#ffffff")
				.empty();
		});
	});

	initFriendColumn(localInfoData);
}

//======================== user options ============================
function addUserOptions(){
	$("#setting_panel").empty();
	$("<div></div>")
		.text("New Friend")
		.attr("id","NF_box")
		.addClass("option")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").empty();
			addSetNewFriendOptions();
		})
		.appendTo("#setting_panel");
    $("<div></div>")
		.text("New Group")
		.attr("id","NF_box")
		.addClass("option")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").empty();
			addSetNewGroupOptions();
		})
		.appendTo("#setting_panel");

	$("<div></div>")
		.text("Log out")
		.addClass("option")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			window.location.href="\\logout";
		})
		.appendTo("#setting_panel");
}

//======================== main options =============================

function setBG(base64img){
	if(base64img!="https://"){
		$("body")
			.css("background-color","transparent")
			.css("background-image","url('"+base64img+"')");
	}
}

function addMainOptions(){
	$("#setting_panel").empty();

	$("<div></div>")
		.text("Change Background Image")
		.attr("id","BG_box")
		.addClass("option")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").empty();
			addSetBGOptions();
		})
		.appendTo("#setting_panel");

	$("<div></div>")
		.text("Change Password")
		.attr("id","pw_box")
		.addClass("option")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").empty();
			addPWOptions();
		})
		.appendTo("#setting_panel");
}

function addSetBGOptions(){
	$("#setting_panel").text("> Drag an image file here <");
	initFile();
}

//============ File Handler =========================

function initFile(){
	var drop=document.getElementById("setting_panel");
	drop.addEventListener("dragenter",dragHandle,false);
	drop.addEventListener("dragleave",dragHandle,false);
	drop.addEventListener("dragover",dragHandle,false);
	drop.addEventListener("drop",dragHandle,false);
}

function dragHandle(e){

	stopBubble(e);
	stopDefault(e);
	if(e.type=="dragenter"){
		$("#setting_panel").text("Release mouse to drop the image");
	}
	if(e.type=="dragleave"){
		$("#setting_panel").text("> Drag an image file here <");
	}
	if(e.type=="drop"){

		$("#setting_panel").text("Uploading Image ...");

		var file=e.dataTransfer.files[0];
		if(!file.type.match(/image*/)){ // not an image
			$("#setting_panel").text("> Drag an image file here <");
			return;
		}

		var drop=document.getElementById("setting_panel");
		drop.removeEventListener("dragenter",dragHandle,false);
		drop.removeEventListener("dragleave",dragHandle,false);
		drop.removeEventListener("dragover",dragHandle,false);
		drop.removeEventListener("drop",dragHandle,false);

		var reader=new FileReader();
		reader.readAsDataURL(file);
		reader.onload=function(){
			//console.log(this.result);
			changeBG(this.result);
		}
	}
}

function sendPicture(content){
	var chat=localChats[activeChat.index];
	var text="*"+content;
	$("#dialog_box").append(new DialogItem(localUser.username,text));
	scrollToDialogBottom();
	console.log(chat);
	sendTextToChat(localUser.username, "", chat, text);
}

function inDragHandle(e){
    console.log("drop")
	stopBubble(e);
	stopDefault(e);
	if(e.type=="drop"){

		var file=e.dataTransfer.files[0];
		if(!file.type.match(/image*/)){ // not an image
			return;
		}

		var drop=document.getElementById("input_panel");

		var reader=new FileReader();
		reader.readAsDataURL(file);
		reader.onload=function(){
			sendPicture(this.result);
		}
	}
}

//============ File Handler end =========================

function addPWOptions(){
	$("<div></div>")
		.text("New Password:")
		.css("display","inline-block")
		.css("margin","20px")
		.appendTo("#setting_panel");
	$("<input><br>")
		.attr("type","password")
		.attr("id","new_password")
		.attr("size","16")
		.attr("maxlength","32")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").css("color","#ffffff");
		})
		.appendTo("#setting_panel");
	$("<div></div>")
		.text("Confirm Password:")
		.css("display","inline-block")
		.css("margin","20px")
		.appendTo("#setting_panel");
	$("<input><br>")
		.attr("type","password")
		.attr("id","confirm_new_password")
		.attr("size","16")
		.attr("maxlength","32")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			$("#setting_panel").css("color","#ffffff");
		})
		.appendTo("#setting_panel");
	$("<div></div>")
		.text("Submit")
		.css({
			"width":"6em",
			"display":"inline-block",
			"border-style":"solid",
			"border-width":"2px",
			"border-color":"#ffffff",
			"margin":"20px",
		})
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			var newpswd=$("#new_password").val();
			var cfmpswd=$("#confirm_new_password").val();
			changePassword(newpswd,cfmpswd);
		})
		.appendTo("#setting_panel");
}

//========================= Friends ========================

function insertChatbox(v,name_){
	var boxtitle="";
	var member=localChats[v].member;
	for(j in member)
		if(member[j]!=localUser.username){
			boxtitle+=member[j]+" ";
		}
	boxtitle=escapeHtml(boxtitle);


	if(name_){
		boxtitle=name_+"<br>"+boxtitle;
	}

	console.log(boxtitle);

	var chatbox=new Chatbox(v,boxtitle);
	//localChats[i].showName=chatbox.text();
	$("#left_column").append(chatbox.box);
}


function initFriendColumn(localInfoData){

	// initialize p2p talks
	var friends=name_list=localInfoData.friends;
	console.log("Cleaning Left Column");
	$("#left_column").children(".chatbox").remove();
	localChats=[];

	console.log("Init by "+friends);
	for(i in friends){
		localChats.push(new Chat(null,new Array(friends[i],localInfoData.username)));
		insertChatbox(localChats.length-1,null);
	}

	for(i in localInfoData.chats){
		socket.emit("getGroup",localInfoData.chats[i]);
		console.log("GetGroupInfo Request id="+localInfoData.chats[i]+" Sent");
	}

	socket.on("groupInfo",function(gData){
		console.log("gData Get:");
		console.log(gData);
		for(i in localChats){
			if(localChats[i].id==gData.id){
				localChats[i]=new Chat(gData.id,gData.member);
				$("#chatbox"+i).remove();
				insertChatbox(i,gData.chatname);
				return;
			}
		}
		localChats.push(new Chat(gData.id,gData.member));
		insertChatbox(localChats.length-1,gData.chatname);
	});

	//set listener
	$("#input_box").keydown(function(event){
		if(event.ctrlKey&&(event.which==13||event.which==10)){
			sendActiveMessage();
			console.log("Send message by key");
		}
	});

	$("#send_button").click(function(event){
		sendActiveMessage();
		console.log("Send message by button");
	});

	$("#add_member_button").click(function(event){
		$("#setting_panel").empty();
		selectGroupMember();
		console.log("Scroll to Bottom");
	});

	$("#to_box_bottom").click(function(event){
		$("#dialog_box_scroll").animate({scrollTop:$("#dialog_box_scroll")[0].scrollHeight},500);
		console.log("Scroll to Bottom");
	});
}

//========================= Friend Handlers ================

function addSetNewFriendOptions(){
	$("<div></div>")
		.text("Friend Name:")
		.css("display","inline-block")
		.css("margin","20px")
		.appendTo("#setting_panel");
	$("<input><br>")
		.attr("type","text")
		.attr("size","16")
		.attr("maxlength","32")
		.attr("id","friend_name")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
		})
		.appendTo("#setting_panel");
	/* $("<textarea></textarea><br>")
		.attr("id","new_friend_message")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
		})
		.val("I'm "+localUser.username+". Nice to meet you!")
		.appendTo("#setting_panel"); */
	$("<div></div>")
		.text("Submit")
		.css({
			"width":"6em",
			"display":"inline-block",
			"border-style":"solid",
			"border-width":"2px",
			"border-color":"#ffffff",
			"margin":"20px",
		})
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			var friendName=$("#friend_name").val();
			var nfMessage=null;//$("#new_friend_message").val();

			inviteFriend(friendName,nfMessage);
		})
		.appendTo("#setting_panel");
}

function addSetNewGroupOptions(){
	$("<div></div>")
		.text("Group Name:")
		.css("display","inline-block")
		.css("margin","20px")
		.appendTo("#setting_panel");
	$("<input>")
		.attr("type","text")
		.attr("size","16")
		.attr("maxlength","32")
		.attr("id","group_name")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
		})
		.appendTo("#setting_panel");
	$("#setting_panel").append("<br>");

	console.log(name_list);

//CHECK BOXED WITH NAMES
	$("#setting_panel").append("Members<br>");
	$("<div></div>")
		.css({
			"width":"12em",
			"height":"12em",
			"font-size":"60%",
			"overflow-y":"auto",
			"border-width": "thin",
			"border-style": "solid none solid none",
			"border-color": "#ffffff",
			"display":"inline-block",
			"text-align":"left"
		})
		.attr("id","group_check_box_panel")
		.appendTo("#setting_panel");
	$("#setting_panel").append("<br>");

    for(i in name_list){

		$("<div></div>")
			.css({
				"font-size":"100%",
				"color":"#a0a0a0"
			})
			.text("+ "+name_list[i])
			.attr("check","0")
			.attr("id","group_check_box_"+i)
			.click(function(e){
				stopBubble(e);
				stopDefault(e);
				//nameChecked[i]=1-i;
				if($(this).attr("check")=="1"){
					$(this)
						.css("color","#a0a0a0")
						.attr("check","0");
				}
				else{
					$(this)
						.css("color","#ffffff")
						.attr("check","1");
				}

				//console.log("nameChecked["+i+"] set "+nameChecked[i]);
			})
			.appendTo("#group_check_box_panel");
    }
	//$("#setting_panel").append("<br>");
	/* $("<textarea></textarea><br>")
		.attr("id","new_friend_message")
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
		})
		.val("I'm "+localUser.username+". Nice to meet you!")
		.appendTo("#setting_panel"); */
	$("<div></div>")
		.text("Submit")
		.css({
			"width":"6em",
			"display":"inline-block",
			"border-style":"solid",
			"border-width":"2px",
			"border-color":"#ffffff",
			"margin":"20px",
		})
		.click(function(e){
			stopBubble(e);
			stopDefault(e);
			friendName=[];
            for(i in name_list){
                if($("#group_check_box_"+i).attr("check")=="1"){
                    friendName.push(name_list[i]);
                }
            }
			newGroup({name:$("#group_name").val(),to:friendName});
		})
		.appendTo("#setting_panel");
}

function selectGroupMember(){
	if(localChats[activeChat.index].id==null)return;
	console.log(name_list);
	$("#setting_panel_wrapper").fadeIn();

//CHECK BOXED WITH NAMES
	$("#setting_panel").append("Choose a member to add:<br>");
	$("<div></div>")
		.css({
			"width":"12em",
			"height":"12em",
			"font-size":"60%",
			"overflow-y":"auto",
			"border-width": "thin",
			"border-style": "solid none solid none",
			"border-color": "#ffffff",
			"display":"inline-block",
			"text-align":"left"
		})
		.attr("id","group_check_box_panel")
		.appendTo("#setting_panel");
	$("#setting_panel").append("<br>");

    for(i in name_list){

		$("<div></div>")
			.css({
				"font-size":"100%",
				"color":"#a0a0a0"
			})
			.attr("member_name",name_list[i])
			.text("+ "+name_list[i])
			.click(function(e){
				stopBubble(e);
				stopDefault(e);
				console.log("Emit add member request:");
				console.log(activeChat);
				var reqData={
					groupId:localChats[activeChat.index].id,
					from:localUser.username,
					to:$(this).attr("member_name")
				};
				console.log(reqData);
				socket.emit("addGroup",reqData);
				$("#setting_panel")
					.empty()
					.html("Your invitation has been sent.<br>");
			})
			.appendTo("#group_check_box_panel");
    }
}

function onReceiveFriendInvitation(data){
	console.log("##Receive Friend Inv:");
	//console.log(data_array);
	$("<div></div>")
		.html(data.from+" wants to add you as friend.")
		.css("margin","20px")
		.appendTo("#setting_panel");
	$("<div></div>")
		.text("Accept")
		.css("display","inline-block")
		.css({
			"width":"6em",
			"display":"inline-block",
			"border-style":"solid",
			"border-width":"2px",
			"border-color":"#ffffff",
			"margin":"20px",
		})
		.click(function(e){
			socket.emit("acceptFriend",{from:data.to,to:data.from});
			//onReceiveFriendInvitation(data_array.slice(1));
			window.location.href="\\chat";
		})
		.appendTo("#setting_panel");
	$("<div></div>")
		.text("Decline")
		.css("display","inline-block")
		.css({
			"width":"6em",
			"display":"inline-block",
			"border-style":"solid",
			"border-width":"2px",
			"border-color":"#ffffff",
			"margin":"20px",
		})
		.click(function(e){
			socket.emit("rejectFriend",{from:data.to,to:data.from});
			//onReceiveFriendInvitation(data_array.slice(1));
			window.location.href="\\chat";
		})
		.appendTo("#setting_panel");

	$("#setting_panel_wrapper").fadeIn();
}

//=========================== socket.IO ================================

function initSocketIO(){
	socket=io.connect(chat_server);
	socket.on("disconnect",function(){
		console.log("Connection Lost");
		/*$("#setting_panel").html("Warning:<br><br>&nbsp;&nbsp;&nbsp;Your connection is lost.<br>&nbsp;&nbsp;&nbsp;System will try to reconnect.");
		$("#setting_panel_wrapper")
			.fadeIn("normal",function(){
				$("#setting_panel").html("Warning:<br><br>&nbsp;&nbsp;&nbsp;Your connection is lost.<br>&nbsp;&nbsp;&nbsp;System will try to reconnect.")
			})
			.click(function(){window.location.href="\\chat";});
	*/});
	socket.on("error",function(){
		console.log("Connection Error");
		/*$("#setting_panel").html("Warning:<br><br>&nbsp;&nbsp;&nbsp;Fatal Error Occurred.<br>&nbsp;&nbsp;&nbsp;System will be navigated to login page.");
		$("#setting_panel_wrapper")
			.fadeIn("normal",function(){
				$("#setting_panel").html("Warning:<br><br>&nbsp;&nbsp;&nbsp;Fatal Error Occurred.<br>&nbsp;&nbsp;&nbsp;System will be navigated to login page.")
			})
			.click(function(){window.location.href="\\logout";});
	*/});
}

function getLocalInfo(callback){
	socket.emit("getInfo",null);
	console.log("GetInfo Request Sent");
	socket.on("info",function(localInfoData){
		console.log(localInfoData);
		localUser=new User(localInfoData.username);
		callback(localInfoData);
		setBG(localInfoData.background);
		recoverMessages(localInfoData.message);
		//recoverGroups(localInfoData.chats);
		recoverFriendInvitation(localInfoData.request);
	});
	//socket.emit("addFriend",{to:"Iraka"}); //debug
	socket.on("friend",function(data){
		onReceiveFriendInvitation(data);
	});
}

/*function readLocalUser(){
	localUser=getUserByUsername(getCookie("username"),"",getCookie("username")).user;
}*/

function initDialogProcess(){
	socket.on("message",onReceiveChat);
}

//========================== Dialog operation ========================

function DialogItem(author, text){
	var messagediv=$("<div></div>").addClass("textpanel");
	var authordiv=$("<div></div>").html("<br/>&nbsp;"+escapeHtml(author)+":&nbsp;").appendTo(messagediv);
	var textdiv=$("<div></div>").addClass("textbox").appendTo(messagediv);
	console.log("Item: "+escapeHtml(text));
	if(text.charAt(0)=='*'){
		appendURL(textdiv,text.substr(1));
	}
	else{
		textdiv.append(escapeHtml(text));
	}
	return messagediv;
}

function showDialogBox(chatbox){
	if(activeChat){
		if(activeChat==chatbox)return;
		activeChat.box.css("background-color","rgba(255,255,255,0.5)");
		activeChat.box.css("color","#000000");
	}
	activeChat=chatbox;
	$("#dialog_box_title").html(chatbox.title);
	$("#chatbox"+chatbox.index).children(".chatbox_unread").text(0);
	activeChat.box.css("background-color","rgba(0,0,0,0.25)");
	activeChat.box.css("color","#ffffff");
	$("#dialog_box").text("");
	var chat=localChats[activeChat.index];
	// only renew contents when user click on box
	// change to get max 20 msgs when shift to this box in standard version
	/*var texts=getChatContents(localUser.username, "", chat.serial, 0, chat.textNum).texts;
	for(i in texts){
		var author=texts[i].author;
		var text=texts[i].content;
		$("#dialog_box").append(new DialogItem(author,text));
	}*/
	console.log(chat.messages);
	for(i in chat.messages){
		appendToDialogBox(chat.messages[i]);
	}

	scrollToDialogBottom(); // may execute BEFORE image loaded and not at bottom, repair with modify recall func
}

function removeChatbox(v){
	//$("#left_column").remove("#chatbox"+v);
}

function sendActiveMessage(){
	if(!activeChat)return;
	var chat=localChats[activeChat.index];
	var text=$("#input_box").val();
	if(text=="")return;
	//console.log("Message Sent!"+text);
	$("#input_box").val("");
	//$("#dialog_box").append(new DialogItem(localUser.username,text));
	//scrollToDialogBottom();
	console.log(chat);
	sendTextToChat(localUser.username, "", chat, text);
}

function appendToDialogBox(message){
	// should be like this
	//var texts=getChatContents(localUser.username, "", serial, localChats[i].textNum, msgNum).texts;

	// THIS is only for debug !!
	//var texts=getChatContents(localUser.username, "", serial, 0, msgNum).texts;


	/*for(j in texts){
		var author=texts[j].author;
		var text=texts[j].content;
		$("#dialog_box").append(new DialogItem(author,text));
	}*/

	$("#dialog_box").append(new DialogItem(message.from,message.text));
	scrollToDialogBottom();
}
