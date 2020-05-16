const express = require('express');
const router = express.Router();
const dbConn  = require('../lib/db');

// display books page
router.get('/(:user_id)', function(req, res, next) {
    let user_id = req.params.user_id;
    dbConn.query('SELECT * FROM users WHERE user_id = ' + user_id,function(err,user)     {

        if(err) {
            req.flash('error', err.message);

            res.render('userView.ejs',{data:''});
        } else {
            dbConn.query('SELECT * FROM transactions WHERE transaction_user = ' + user_id,function(err,rows)     {

                if(err) {
                    req.flash('error', err.message);

                    res.render('userView.ejs',{user: user, data:''});
                } else {

                    res.render('userView.ejs',{user: user, data:rows});
                }
            });
            //res.render('adminView.ejs',{data:rows});
        }
    });
});

module.exports = router;