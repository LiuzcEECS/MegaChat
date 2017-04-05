var io = require('socket.io')();
var database = require('./database');
var session = require('./app').session;
var list = [];
Array.prototype.remove = function(val){
    var index = this.indexOf(val);
    if(index>-1){
        this.splice(index,1);
    }
}

io.use(function(socket, next){
    session(socket.handshake, {}, next);
})

sendMessage = function(message, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(message);
    res.end();
}

encoding = function(content){
    content = content.replace(/'\'/g,"\\\\");
}

/*
router.use('getUserName', function(req, res, next){
    sendMessage(req.session.user.name, res);
})
router.use('getUserId', function(req, res, next){
    sendMessage(req.session.user.id, res);
})
router.use('getBackground', function(req, res, next){
    sendMessage(database.getBackgroundById(req.body.userId), res);
})
router.use('getFriendsByUserId', function(req, res, next){
    sendMessage(database.getFriendsByUserId(req.body.userId), res);
})
router.use('getChatsByUserId', function(req, res, next){
    sendMessage(database.getChatsByUserId(req.body.userId), res);
})
*/

function remove(f1, f2, key, content, socket, session){
    var callback2 = function(flag, socket, session){
    }
    var callback1 = function(f_list, socket, session){
        if(f_list == null){
            f_list = "[]";
        }
        f_list = JSON.parse(f_list);
        f_list.remove(content);
        f_list = JSON.stringify(f_list);
        f2(key,f_list,callback2,socket,session);
    }
    f1(key, callback1, socket, session);
}

function update(f1, f2, key, content,callback2, socket, session){
    var callback1 = function(f_list, socket, session){
        if(f_list == null){
            f_list = "[]";
        }
        f_list = JSON.parse(f_list);
        if(f_list.indexOf(content) == -1)    f_list.push(content);
        f_list = JSON.stringify(f_list);
        f2(key,f_list,callback2,socket,session);
    }
    f1(key, callback1, socket, session);
}

addFriend = function(from, to, socket, session){
    update(database.getFriendsByUsername, database.setFriendsByUsername, from, to, function(){
        update(database.getFriendsByUsername, database.setFriendsByUsername, to, from,function(){
        if(from in list){
            var socket = list[from].socket;
            console.log("in")
            database.getInformationByUsername(from, getInformationByUsername_callback, socket, socket.handshake.session)
        }
        if(to in list){
            var socket = list[to].socket;
            console.log("fo")
            database.getInformationByUsername(to, getInformationByUsername_callback, socket, socket.handshake.session)
        }

        }, socket, session);
    },socket, session);
}

getInformationByUsername_callback = function(a, socket, session){
    var info = {
        username: a.Username,
        userId: a.UserId,
        background: a.BG,
        friends: JSON.parse(a.FriendList),
        chats: JSON.parse(a.ChatList),
        message: JSON.parse(a.offlineinfo),
        request: JSON.parse(a.Request),
        requestSent: JSON.parse(a.RequestSent)
    };
    //list[session.user.username].friends = info.friends;
    //list[session.user.username].chats = info.message;
    //console.log('info: '+info.username);
    //console.log(socket.handshake.session.user.username)
    socket.emit('info', info);
};

function storeRequest(from, to, socket, session){
    update(database.getRequestByUsername, database.setRequestByUsername, to, from, function(){},socket, session);
}
    
function storeRequestSent(from, to, socket, session){
    update(database.getRequestSentByUsername, database.setRequestSentByUsername, from, to, function(){}, socket, session);
}

function storeMessage(to, message, socket, session){
    update(database.getMessageByUsername, database.setMessageByUsername, to, message, function(){}, socket, session);
}
function isExistUsernameAddFriend_callback(flag, data, req, res){
        var callback1 = function(f_list, req, res){
            if(f_list == null){
                f_list = "[]";
            }
            f_list = JSON.parse(f_list);
            if(f_list.indexOf(data.to) == -1){
                if(list.hasOwnProperty(data.to)){
                    console.log("send")
                    list[data.to].socket.emit('friend', data);
                }
                else{
                    console.log("store")
                    storeRequest(data.from, data.to, req, res);
                }
                storeRequestSent(data.from, data.to, req, res);
            }
        }

        var callback = function(f_list, req, res){
            if(f_list == null){
                f_list = "[]";
            }
            f_list = JSON.parse(f_list);
            if(f_list.indexOf(data.from) == -1){
                if(list.hasOwnProperty(data.to)){
                    console.log("send")
                    list[data.to].socket.emit('friend', data);
                }
                else{
                    console.log("store")
                    storeRequest(data.from, data.to, req, res);
                }
                storeRequestSent(data.from, data.to, req, res);
            }
            else{
                database.getFriendsByUsername(data.from, callback1, req, res);
            }

        }
        if(flag){
            database.getFriendsByUsername(data.to, callback, req, res);
        }
}
function validate(f1, f2, id, name, socket, session){
    var callb = function(f_list, req, res){
        if(f_list.indexOf(name) > -1){
            f2();
        }
    }
    f1(id, callb, socket, session);
}
io.on("connection", function(socket){
    if(socket.handshake.session.user == null){
        socket.emit("disconnect");
    }
    if(!(socket.handshake.session.user.username in list)){
        list[socket.handshake.session.user.username] = new Object();
    }
    list[socket.handshake.session.user.username].socket = socket;
    console.log(socket.handshake.session.user.username + " online");
    //console.log(list)
    socket.on('pMessage', function(data){
        data.message.from = socket.handshake.session.user.username;
        var callback = function(f_list, req, res){
            if(f_list.indexOf(data.to)>-1){
                if(data.to in list){
                    console.log("send " + data.to);
                    console.log(data.message);
                    list[data.to].socket.emit('message', data.message);
                }
                else{
                    console.log("store " + data.to);
                    storeMessage(data.to, data.message, req, res);
                }
            }
            else{
                //return error
            }
        }
        database.getFriendsByUsername(data.message.from, callback, socket, socket.handshake.session)
    })
    socket.on('gMessage', function(data){
        data.from = socket.handshake.session.user.username;
        data.message.from = data.from;
        callback = function(f_list, req, res){
            f_list = JSON.parse(f_list);
            for(var i = 0,len = f_list.length;i<len;i++){
                var f = f_list[i];
                if(f in list){
                    list[f].socket.emit('message', data.message);
                }
                else{
                    storeMessage(f, data.message, req, res);
                }
            }
        }
        database.getMemberByChatId(data.message.id, callback, socket, socket.handshake.session)
    })

    socket.on("getInfo", function(){
        console.log("info");
        database.getInformationByUsername(socket.handshake.session.user.username, getInformationByUsername_callback, socket, socket.handshake.session);
    });

    socket.on("addFriend", function(data){
        console.log("addFri");
        data.from = socket.handshake.session.user.username;
        if(data.from != data.to){
            database.isExistUsername(data.to, data, isExistUsernameAddFriend_callback, socket, socket.handshake.session);
        }
    });

    socket.on('acceptFriend', function(data){
        console.log("accept")
        data.from = socket.handshake.session.user.username;
        remove(database.getRequestSentByUsername, database.setRequestSentByUsername, data.to, data.from, socket, socket.handshake.session);
        remove(database.getRequestByUsername, database.setRequestByUsername, data.from, data.to, socket, socket.handshake.session);
        addFriend(data.from, data.to);
    });

    socket.on('rejectFriend', function(data){
        console.log("reject");
        data.from = socket.handshake.session.user.username;
        remove(database.getRequestSentByUsername, database.setRequestSentByUsername, data.to, data.from, socket, socket.handshake.session);
        remove(database.getRequestByUsername, database.setRequestByUsername, data.from, data.to, socket, socket.handshake.session);
    });
    socket.on('getGroup', function(data){
        var callback = function(member,chatname,req,res){
            var info = {
                "id": data,
                "member": JSON.parse(member),
                "chatname": chatname
                };
            //list[session.user.username].friends = info.friends;
            //list[session.user.username].chats = info.message;
            //console.log(info);
            socket.emit('groupInfo', info);

        }
        database.getInformationByChatId(data,callback,socket,socket.handshake.session)
    });
    
    socket.on('newGroup', function(data){
        console.log("newGroup");
        data.from = socket.handshake.session.user.username;
        data.to.push(data.from);
        var callback1 = function(id, req, res){
            for(var i = 0,len = data.to.length;i<len;i++){
                if(data.to[i] in list)
                {
                    update(database.getChatsByUsername, database.setChatsByUsername, data.to[i], id ,function(content, flag, req, res){
                        database.getInformationByUsername(content, getInformationByUsername_callback, req, res);
                    },list[data.to[i]].socket,list[data.to[i]].socket.handshake.session);
                }
                else{
                    update(database.getChatsByUsername, database.setChatsByUsername, data.to[i], id ,function(){}, socket, socket.handshake.session);
                }

            }
        }
        var callback = function(f_list, req, res){
            var flag = 1;
            for(var i = 0,len = data.to.length;i<len;i++){
                if(f_list.indexOf(data.to[i]) == -1 && data.to[i] != data.from){
                    flag = 0;
                }
            }
            if(flag){
                database.newChat(data.name, data.to, callback1, socket, socket.handshake.session);
            }
            else{
                //return error
            }
        }
        database.getFriendsByUsername(data.from, callback, socket, socket.handshake.session)
    });

    socket.on('addGroup', function(data){
        console.log("addGroup");
        data.from = socket.handshake.session.user.username;
        var callback = function(){
            if(data.to in list){
                var socket_t = list[data.to].socket;
                update(database.getMemberByChatId, database.setMemberByChatId, data.groupId, data.to,function(){
                    update(database.getChatsByUsername, database.setChatsByUsername, data.to, data.groupId,function(){
                        database.getInformationByUsername(data.to, getInformationByUsername_callback, socket_t, socket_t.handshake.session);
                        database.getInformationByUsername(data.from, getInformationByUsername_callback, socket, socket.handshake.session);
                    },socket,socket.handshake.session);
                },socket,socket.handshake.session);
            }
            else{
                update(database.getMemberByChatId, database.setMemberByChatId, data.groupId, data.to,function(){
                    update(database.getChatsByUsername, database.setChatsByUsername, data.to, data.groupId,function(){
                        database.getInformationByUsername(data.from, getInformationByUsername_callback, socket, socket.handshake.session);
                    },socket,socket.handshake.session);
                },socket,socket.handshake.session);
            }
        }
        validate(database.getMemberByChatId, callback,data.groupId,data.from,socket,socket.handshake.session);
    });

    socket.on('setChatName', function(data){
        console.log("chatname");
        data.from = socket.handshake.session.user.username;
        var callback = function(){
            database.setChatname(data.groupId,data.name,function(req,res){},socket,socket.handshake.session);
        }
        validate(database.getMembetByChatId, callback,data.groupId,data.from,socket,socket.handshake.session);
    });

    socket.on('deleteFriend', function(data){
        console.log(data)
        console.log("deleteFri " + data.to);
        data.from = socket.handshake.session.user.username;
        remove(database.getFriendsByUsername,database.setFriendsByUsername,data.from,data.to,socket,socket.handshake.session);
    });
    
    socket.on('deleteMember', function(data){
        console.log("chatname");
        data.from = socket.handshake.session.user.username;
        var callback = function(){
           remove(database.getMembetByChatId,database.setMembetByChatId,data.groupId,data.to,socket,socket.handshake.session);
        }
        validate(database.getMembetByChatId, callback,data.groupId,data.from,socket,socket.handshake.session);
    });

    socket.on('exitGroup', function(data){
        console.log("exitgroup");
        data.from = socket.handshake.session.user.username;
        remove(database.getMemberByChatId,database.setMemberByChatId,data.groupId,data.from,socket,socket.handshake.session);
        remove(database.getChatsByUsername,database.setChatsByUsername,data.from,data.groupId,socket,socket.handshake.session);
    });

    socket.on('clearMessage', function(){
        console.log("clear");
        var callback = function(req, res){};
        database.setMessageByUsername(socket.handshake.session.user.username,"[]",callback,socket,socket.handshake.session);
    });

    socket.on('disconnect', function(){
        console.log(socket.handshake.session.user.username + " offline");
        delete list[socket.handshake.session.user.username];
    });
});

exports.listen = function(_server){
    return io.listen(_server);
};
