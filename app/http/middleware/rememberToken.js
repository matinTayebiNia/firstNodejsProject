const middleware = require('app/http/middleware/middleware.js')
const User = require('app/models/user')

class rememberToken extends middleware {
    handel(req, res, next) {
        if (!req.isAuthenticated()) {
            const remember_token = req.signedCookies.remember_token;
            if (remember_token)
                return this.userFind(remember_token, req, next)
        }
        next();
    }

    userFind(rememberToken, req, next) {
        User.findOne({rememberToken})
            .then(user => {
                if (user) {
                    req.logIn(user, err => {
                        if (err) next(err);
                        next();
                    });
                } else
                    next();
            })
            .catch(err => next(err));
    }
}


module.exports = new rememberToken();