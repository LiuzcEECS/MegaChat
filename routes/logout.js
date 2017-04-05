var express = require('express');
var router = express.Router();

//Func

//Route
router.get('/', function(req, res) {
    req.session.user = null;
    res.redirect('../login');
});

module.exports = router;
