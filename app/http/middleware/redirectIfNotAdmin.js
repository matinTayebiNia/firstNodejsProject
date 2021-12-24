const middleware = require('app/http/middleware/middleware')

class redirectIfNotAdmin extends middleware {

    handel(req, res, next) {
        if (req.isAuthenticated() && req.user.admin) return next()
        return res.redirect('/')
    }
}


module.exports = new redirectIfNotAdmin();