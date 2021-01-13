const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

function authUser(req, res, next) {
    try {
        let token = req.headers.auth
        if (!token) {
            return next()
        }
        const decodedToken = jwt.verify(token, config.db_secret);
        const { email } = decodedToken
        req.email = { email }
        next()
    }
    catch (e) {
        // req.respond = 'Your session has expired please login again'
        // let respond = 'Your session has expired please login again'
     
        next(e)
        // res.render('loginPage', { respond })
    }
}

function generateToken(payload, options) {
    return jwt.sign(payload, config.db_secret, options)
}

function decodeToken(token) {
    const decodedToken = jwt.verify(token, config.db_secret);
    return decodedToken
    // { name, description, url, difficultyLevel}
}

module.exports = {
    authUser,
    generateToken,
    decodeToken
}