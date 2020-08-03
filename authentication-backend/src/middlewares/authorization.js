require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1]; // const token = (auth) ? auth.split(' ')[1] : auth;

    if ( token === null ) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
       
        req.user = user;

        next();
    });
}
