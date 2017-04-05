var express = require('express');
var database = require('../database');
var router = express.Router();

//Func
sendMessage = function(message, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(message);
    res.end();
}

regNewUser_callback = function(req,res){
    var user = {
        username: req.body.username,
        password: req.body.password,
        //id: database.getIdByUsername(req.bodyusername)
    }
    req.session.user = user;
    sendMessage("1", res);

}

isExistUsername_callback = function(flag, data, req ,res){
    if(flag){
        sendMessage("2", res);
    }
    else{
        database.regNewUser(username = req.body.username, password = req.body.password, regNewUser_callback, req, res)
    }
}

doSignup = function(req, res) {
    // This catch method is just for a try, maybe doesn't work
    try{
        if(req.body.password.length < 6){
            sendMessage("3", res);
        }
        else{
            database.isExistUsername(req.body.username, "",isExistUsername_callback, req, res)
        }
    }
    catch(e){
        sendMessage("0", res);
    }
}

//Route
/*
router.get('/', function(req, res) {
    req.session.user = null;
    res.render('signup');
});
*/
router.post('/', doSignup);
module.exports = router;
