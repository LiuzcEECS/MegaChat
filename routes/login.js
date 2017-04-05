var express = require('express');
var database = require('../database');
var router = express.Router();

//Func
sendMessage = function(message, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(message);
    res.end();
}

getIdByUsername_callback = function(userId, req, res){

    var user = {
        username: req.body.username,
        password: req.body.password,
        userId: userId
    }
    req.session.user = user;
    console.log(user)
    sendMessage("1", res);
}

doLogin_callback = function(password, req, res){
    if(password == req.body.password){
        database.getIdByUsername(req.body.username, getIdByUsername_callback, req, res)
    }
    else{
        req.session.user = null;
        sendMessage("2", res);
    }
}

doLogin = function(req, res){
    // This catch method is just for a try, maybe doesn't work
    database.getPasswordByUsername(req.body.username, doLogin_callback, req, res);
}

//Route
router.get('/', function(req, res){
    var nameReq = req.body.username
    // The title doesn't matter at all.
    res.render('login', { title: '用户登录' });
});

router.post('/', doLogin);
//router.post('/doLogin', )
module.exports = router;
