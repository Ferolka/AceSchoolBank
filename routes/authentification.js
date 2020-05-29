const jwt = require('jsonwebtoken');
const accessTokenSecret = 'MamamiaOhmyGOD';
const log = require('./log');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.cookies.token;
    //console.log("token from cookie: "+authHeader);
    if (authHeader) {

        jwt.verify(authHeader, accessTokenSecret, (err, team) => {
            if (err) {
                log.warn("Error with token verification"+err);
                return res.status(403).send("Error occurred while verifying token");
            }
            req.team = team;
            next();
        });
    } else {
        return res.status(401).send("User is unauthorised");
    }
};

module.exports = authenticateJWT;