var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Demo Michele'
    });
    res.send(console.log('loaded index'));
});

module.exports = router;