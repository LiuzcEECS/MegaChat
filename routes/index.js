var express = require('express');
var router = express.Router();

//Func



//Route
router.get('/', function(req, res, next) {
    res.redirect('/login');
});

module.exports = router;
