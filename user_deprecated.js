var users = []

function addUser(sessionId, userId, username){
    if(userId in users == False){
        user[userId] = {
            sessionId: sessionId,
            userId: userId,
            username: username,
            socket: null
        };
    }
    else{
        users[userId].username = username;
        users[userId].sessionId = username;
    }
}

function getUsersList(list){
    var results = []
    for(var i = 0, len = list.length; i < len; i++){
        if(list[i] in users){
            results.push(users[list[i]])
        }
        else{
            results.push{{
                userId: null
            }}
        }
    }
    return results
}

module.export.addUser = addUser;
module.export.getUsersList = getUsersList;
