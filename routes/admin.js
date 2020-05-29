const express = require('express');
const router = express.Router();
var dbConn = require('../lib/db');
// const conn  = require('../lib/db');
// var dbConn = conn.getConnection();
const auth = require('./authentification');
const log = require('./log');

router.get('/', auth, function(req, res, next) {

    if (req.team.status !== 1) {
        return res.status(403).send("User is unauthorised");
    }
    dbConn.query('SELECT * FROM teams WHERE team_admin = \'false\'',function(err,rows)     {

        if(err) {

            console.log(err);
            log.error(err.message+" by user with team_id = "+req.team.team_id);
            req.flash('error', err.message);

            res.render('adminView.ejs',{data:''});
        } else {
            log.info("Get info about teams by user with team_id = "+req.team.team_id);
            res.render('adminView.ejs',{data:rows});
        }
    });


});
router.post('/addTransaction',auth, function(req, res, next) {
    if (req.team.status !== 1) {
        return res.status(403).send("User is unauthorised");
    }
    var today = new Date(Date.now());
    let transaction_date = today;
    let transaction_team = req.body.transaction_team;
    let transaction_type = parseInt(req.body.transaction_type);
    let transaction_amount = req.body.transaction_amount;
    let transaction_user = req.body.transaction_user;
    let transaction_note = req.body.transaction_note;
    let transaction_author = req.team.team_id;
    let balance;
    if(transaction_type==0){
        balance=transaction_amount;
    }
    else {
        balance=-transaction_amount;
    }
    let errors = false;

    if(transaction_note.length === 0|| transaction_amount.length === 0||transaction_note.length >45) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all required fills");
        // render to addAroma.ejs with flash message
        res.redirect('/admin');
    }

    // if no error
    if(!errors) {

        var form_data = {
            transaction_date: transaction_date,
            transaction_team: transaction_team,
            transaction_type: transaction_type,
            transaction_amount: transaction_amount,
            transaction_note: transaction_note,
            transaction_user: transaction_user,
            transaction_author: transaction_author
        };
        if(transaction_user == 'null') {
            form_data.transaction_user = null;
        }

        // insert query
        dbConn.query('INSERT INTO transactions SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                log.error(err.message+" by user with team_id = "+req.team.team_id);
                req.flash('error', err.message);

                // render to addAroma.ejs
                res.redirect('/admin');
            } else {
                log.info("Inserted new transaction with team_id = "+transaction_team+" by user with team_id = "+req.team.team_id );
                dbConn.query('UPDATE teams SET team_balance = team_balance + '+balance+" where team_id = "+ transaction_team, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        log.error(err.message+" by user with team_id = "+req.team.team_id);
                        req.flash('error', err.message);

                        // render to addAroma.ejs
                        res.redirect('/admin');
                    } else {
                        log.info("Updated team balance with team_id = "+transaction_team+" by user with team_id = "+req.team.team_id );
                        req.flash('success', 'Transaction successfully added');
                        res.redirect('/admin');
                    }
                })
                // req.flash('success', 'Transaction successfully added');
                // res.redirect('/admin');
            }
        })
    }
});

router.get('/users/(:team_id)', auth, function(req, res, next) {
    let team_id = req.params.team_id;
    if (req.team.status !== 1) {
        return res.status(403).send("User is unauthorised");
    }
    dbConn.query('SELECT * FROM users WHERE user_team = '+team_id,function(err,rows)     {

        if(err) {
            log.error(err.message+" by user with team_id = "+req.team.team_id);
            req.flash('error', err.message);

            res.send({users:''});
        } else {
            log.info("Getting users with team_id = "+team_id+" by user with team_id = "+req.team.team_id );
            res.send({users:rows});
        }
    });
});

module.exports = router;