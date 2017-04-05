var express = require('express');
var database = require('../database');
var router = express.Router();

//Func
sendMessage = function(message, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(message);
    res.end();
}

setBackgroundByUsername_callback = function(flag, req, res){
    if(flag){
        sendMessage("2", res);
    }
    else{
        sendMessage("1", res);
    }
}
 
setPasswordByUsername_callback = function(flag, req, res){
    if(flag){
        sendMessage("2", res);
    }
    else{
        sendMessage("1", res);
    }
}
setSettings = function(req, res) {
    try{
        if(req.body.background != ""){
            database.setBgByUsername(req.session.user.username, req.body.background, setBackgroundByUsername_callback, req, res);
        }
        if(req.body.password != ""){
            if(req.body.password.length < 6){
                sendMessage("3", res);
            }
            database.setPasswordByUsername(req.session.user.username, req.body.password, setPasswordByUsername_callback, req, res);
        }
    }
    catch(e){
        sendMessage("0", res);
    }
}
router.post('/', setSettings);
module.exports = router;
