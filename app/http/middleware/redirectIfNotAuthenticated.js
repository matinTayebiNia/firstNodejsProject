const middleware = require('app/http/middleware/middleware')

class redirectIfAuthenticated extends middleware {

    handel(req, res, next) {
        if (req.isAuthenticated())
            return next();

        return res.redirect('/auth/login')
    }

}

module.exports = new redirectIfAuthenticated();

