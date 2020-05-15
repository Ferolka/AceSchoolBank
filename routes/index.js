const express = require('express');
const router = express.Router();

// display books page
router.get('/', function(req, res, next) {
    res.render('login.ejs');
});

module.exports = router;