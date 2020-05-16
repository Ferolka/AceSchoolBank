const express = require('express');
const router = express.Router();
const dbConn  = require('../lib/db');


router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM users WHERE user_admin = \'false\'',function(err,rows)     {

        if(err) {
            req.flash('error', err.message);

            res.render('adminView.ejs',{data:''});
        } else {

            res.render('adminView.ejs',{data:rows});
        }
    });
});

module.exports = router;