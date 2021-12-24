const middleware = require('app/http/middleware/middleware')

class redirectIfAuthenticated extends middleware {

    handel(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next();
    }

}

module.exports = new redirectIfAuthenticated();