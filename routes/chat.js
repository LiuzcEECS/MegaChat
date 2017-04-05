var express = require('express');
var database = require('../database');
var router = express.Router();

//Func

//Route

//The auth part seems useless
router.get('/', function(req, res, next) {
    //if(!req.session.user){
    //    return res.redirect('../login');
    //}
    //else{
        res.render('chat');
    //}
});



module.exports = router
