const middleware = require('app/http/middleware/middleware')
const passport = require('passport')

class redirectIfAuthenticated extends middleware {

    handel(req, res, next) {

        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (err || !user) return res.status(401).json({
                data: info.data || "شما اجازه دسترسی ندارید",
                status: "error"
            })
            req.user = user;
            return next()
        })(req, res, next)
    }

}

module.exports = new redirectIfAuthenticated();