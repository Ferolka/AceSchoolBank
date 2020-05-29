const express = require('express');
const router = express.Router();
var dbConn = require('../lib/db');
// const conn  = require('../lib/db');
// var dbConn = conn.getConnection();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'MamamiaOhmyGOD';
const auth = require('./authentification');
const log = require('./log');
// display books page
router.get('/', function(req, res, next) {
    // const saltRounds = 10;
    // bcrypt.genSalt(saltRounds, function(err, salt) {
    //     bcrypt.hash('Andru2000!', salt, function (err, hash) {
    //         console.log('Password= ' + hash);
    //     });
    // });
    //
    const hash = bcrypt.hashSync('Employee2020!', 10);
    console.log('Password1= ' + bcrypt.compareSync('Employee2020!', hash)+"   "+hash);
    res.render('login.ejs');
});
router.post('/authorisation', function (req, res) {
    const {login, password} = req.body;
    let query = dbConn.query('SELECT * FROM teams WHERE team_email = \'' + login + '\'', function (err, rows) {
        if (err) {
            if (err.message == 'Can\'t add new command when connection is in closed state') { // <---- Insert in '' the error code, you need to find out
                // Connection timeout, no further action (no throw)
                dbConn.connect();
                //return;
            }
            log.warn("Incorrect login = "+login+""+" ip= "+req.connection.remoteAddress);
            req.flash('error', err.message);
            res.render('login');
        } else if (rows.length !== 0 && bcrypt.compareSync(password, rows[0].team_password)) {
            // Generate an access token
            const accessToken = jwt.sign({team_id: rows[0].team_id,status: rows[0].team_admin}, accessTokenSecret);
            // console.log(accessToken);
            // res.json({
            //     accessToken
            // });
            dbConn.end();
            res.cookie('token', accessToken);
            res.redirect('/mainMenu');
        } else {
            log.warn("Incorrect login = "+login+""+" ip= "+req.connection.remoteAddress);
            req.flash('error', 'Username or password incorrect');
            res.render('login');
        }
    });
});
router.get('/logout', function (req, res) {

    try {
        res.clearCookie('token');
        res.redirect('/');
        delete req.team;

    }catch (e) {
        req.flash('error', 'Error');
        res.render('index');
    }
});

router.get('/mainMenu',auth, function (req, res, next) {
    // const hash1 = bcrypt.hashSync('admin',5);
    //const hash2 = bcrypt.hashSync('qwerty',5);
    // console.log(hash1);
    //console.log(hash2);
    // console.log(req.user);
    // const { login } = req.user;
    if (req.team.status === 1) {
        return res.redirect('/admin');
    }
    if (req.team.status === 0){
        return res.redirect('/team/'+req.team.team_id)
    }
    return res.status(403).send('Error in /mainMenu get');
});

module.exports = router;