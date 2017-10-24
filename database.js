var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./megachat.db');

//User Table
//get
getNameByChatId = function(chatid,callback,req,res){
    var name;
    db.get("SELECT ChatName FROM Chats WHERE ChatId = ?",[chatid],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a == null)   name = "";
            else    name = a.ChatName;
            callback(name, req, res);
        }
    });
}
getMemberByChatId = function(chatid,callback,req,res){
    var member;
    db.get("SELECT MemberUser FROM Chats WHERE ChatId = ?",[chatid],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a == null)   member = "";
            else    member = a.MemberUser;
            callback(member, req, res);
        }
    });
}
getMessageByUsername = function(username,callback,req,res){
    var offlineinfo;
    db.get("SELECT offlineinfo FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a == null)   offlineinfo = "";
            else    offlineinfo = a.offlineinfo;
            callback(offlineinfo, req, res);
        }
    });
}

getPasswordByUsername = function(username, callback, req, res){ 
    var password;
    db.get("SELECT Password FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a == null)   password = "";
            else    password = a.Password;
            callback(password, req, res);
        }
    });
    }
getInformationByUsername = function(username, callback, req, res){
    db.get("SELECT Username,Userid,BG,FriendList,ChatList,offlineinfo,Request,RequestSent FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            callback(a, req, res);
        }
    });
    }
getInformationByChatId = function(chatId, callback,req,res){
    var MemberUser;
    var ChatName;
    db.get("SELECT MemberUser,ChatName FROM Chats WHERE ChatId = ?",[chatId],function(err,a){
        if(err){
            throw err;
        }
        else{
            MemberUser = a.MemberUser;
            ChatName = a.ChatName;
            callback(MemberUser,ChatName, req, res);
        }
    });

    
}
getFriendsByUsername = function(username,callback,req,res){
    var friends;
    db.get("SELECT FriendList FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            friends = a.FriendList;
            callback(friends, req, res);
        }
    });
    }
getRequestByUsername = function(username,callback,req,res){
    var flag = 1;
    var request;
    db.get("SELECT Request FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            request = a.Request;
            callback(request, req, res);
        }
    });
    }

getChatsByUsername = function(username, callback, req, res){
    var chats;
    db.get("SELECT ChatList FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            chats  = a.ChatList;
            callback(chats, req, res);
        }
    });
    }

getIdByUsername = function(username, callback, req, res){
    var userid;
    db.get("SELECT Userid FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            userid = a.Userid;
            callback(userid, req, res);
        }
    });
}
getRequestSentByUsername = function(username, callback, req, res){
    var requestsent;
    db.get("SELECT RequestSent FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            requestsent = a.RequestSent;
            callback(requestsent, req, res);
        }
    });
}
//is
isExistUsername = function (username,data,callback,req,res){
    var flag = 1;
    db.get("SELECT Username FROM User WHERE Username = ?",[username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a == null){
                flag = 0;
            }
            callback(flag, data, req, res);
        }
    });
}
//register
regNewUser = function(username,password,callback,req,res){
    db.run("insert into User (Username,Password) values(?,?)",[username,password],function(err,a){
        if(err){
            throw err;
        }
        else{
            callback(req,res);
        }
    });
}

//set
setPasswordByUsername = function(username,password,callback,req,res){
    var flag = 1;
    db.run("update User set Password = ? where Username = ?",[password,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setBgByUsername = function(username,bg,callback,req,res){
    var flag = 1;
    db.run("update User set BG = ? where Username = ?",[bg,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setFriendsByUsername = function(username,friendlist,callback,req,res){
    var flag = 1;
    db.run("update User set FriendList = ? where Username = ?",[friendlist,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setRequestByUsername = function(username,request,callback,req,res){
    var flag = 1;
    db.run("update User set Request = ? where Username = ?",[request,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setRequestSentByUsername = function(username,requestsent,callback,req,res){
    var flag = 1;
    db.run("update User set RequestSent = ? where Username = ?",[requestsent,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setMessageByUsername = function(username,message,callback,req,res){
    var flag = 1;
    db.run("update User set offlineinfo = ? where Username = ?",[message,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setChatsByUsername = function(username,chats,callback,req,res){
    var flag = 1;
    db.run("update User set ChatList = ? where Username = ?",[chats,username],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(username,flag,req,res);
    });

}
setNameByChatId = function(chatid,name,callback,req,res){
    var flag = 1;
    db.run("update Chats set ChatName = ? where ChatId = ?",[name,chatid],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}
setMemberByChatId = function(chatid,member,callback,req,res){
    var flag = 1;
    db.run("update Chats set MemberUser = ? where ChatId = ?",[member,chatid],function(err,a){
        if(err){
            throw err;
        }
        else{
            if(a==null){
                flag = 0;
            }
        }
        callback(flag,req,res);
    });
}

//new
newChat = function(name,memberuser,callback,req,res){
    var chatid;
    db.run("insert into Chats (ChatName,MemberUser) values(?,?)",[name,JSON.stringify(memberuser)],function(err,a){
        if(err){
            throw err;
        }
        else{ 
             db.get("SELECT ChatId FROM Chats WHERE ChatName = ?",[name],function(err,a){
              if(err){
                     throw err;
                }       
              else{
                     chatid = a.ChatId;
                    callback(chatid, req, res);
                }
             });

        }
    });
    
}
module.exports = {
    getNameByChatId,
    getMemberByChatId,
    getMessageByUsername,
    getInformationByUsername,
    getFriendsByUsername,
    getRequestByUsername,
    getRequestSentByUsername,
    getChatsByUsername,
    getPasswordByUsername,
    getInformationByChatId,
    getIdByUsername,
    isExistUsername,
    regNewUser,
    setPasswordByUsername,
    setBgByUsername,
    setFriendsByUsername,
    setRequestByUsername,
    setRequestSentByUsername,
    setMessageByUsername,
    setNameByChatId,
    setChatsByUsername,
    setMemberByChatId,
    newChat
}

