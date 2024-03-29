const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');


let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/* POST login */
/**
 * POST: User Login
 * 
 * @returns {object} User Details + Token Object
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false}, (error, user, info) => {
            if (error) {
                return res.status(400).json({
                    message: 'Something is not right.',
                    user: user
                });
            }
            else if (!user) {
                return res.status(401).json({
                    message: 'Username or password is incorrect.',
                    user: user
                });
            } else {
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token});
           })}
        })(req, res);
    });
}