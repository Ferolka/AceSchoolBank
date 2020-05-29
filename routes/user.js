const express = require('express');
const router = express.Router();
var dbConn  = require('../lib/db');
const auth = require('./authentification');
const log = require('./log');


router.get('/(:team_id)',auth,  function(req, res, next) {
    let team_id = parseInt(req.params.team_id);
    if (req.team.status !== 1&&req.team.team_id !== team_id) {
        return res.status(403).send("Forbidden");
    }

            dbConn.query('Select transactions.transaction_date, transactions.transaction_type, transactions.transaction_amount, transactions.transaction_id, transactions.transaction_note,\n' +
                'users.user_name, t2.team_name as author, t.team_name, t.team_email, t.team_balance\n' +
                'from teams as t\n' +
                'left join transactions on t.team_id = transactions.transaction_team\n' +
                'left join teams as t2 on t2.team_id = transactions.transaction_author\n' +
                'left join users on users.user_id = transaction_user\n' +
                'where t.team_id = ' + team_id,function(err,rows)     {

                if(err) {
                    log.error(err.message);
                    req.flash('error', err.message);

                    res.render('userView.ejs',{data:'', team_id:team_id, admin:req.team.status});
                } else {
                    log.info("Getting info about transaction of user with team_id = "+team_id+" by user with team_id = "+req.team.team_id );
                    res.render('userView.ejs',{data:rows,team_id:team_id, admin:req.team.status});
                }
            });
            //res.render('adminView.ejs',{data:rows});

});
router.get('/(:team_id)/sum',auth,  function(req, res, next) {
    let team_id = parseInt(req.params.team_id);
    if (req.team.status !== 1&&req.team.team_id !== team_id) {
        return res.status(403).send("Forbidden");
    }

    dbConn.query('Select sum(transaction_amount) as sum,user_name\n' +
        'from transactions\n' +
        'inner join users on user_id=transaction_user\n' +
        'where transaction_type = 0 And transaction_team = '+team_id+'\n' +
        'Group by transaction_user',function(err,rows)     {

        if(err) {
            log.error(err.message);
            req.flash('error', err.message);

            res.send({sum:''});
        } else {
            log.info("Getting info about sum of users with team_id = "+team_id+" by user with team_id = "+req.team.team_id );
            res.send({sum:rows});
        }
    });
    //res.render('adminView.ejs',{data:rows});

});

module.exports = router;