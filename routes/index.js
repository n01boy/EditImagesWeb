var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '画像編集ツール'
    });
});

router.post('/images/', function() {})

module.exports = router;
