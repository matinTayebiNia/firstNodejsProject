const middleware = require("app/http/middleware/middleware")


class ActiveUser extends middleware {
    handel(req, res, next) {
        if (req.isAuthenticated()) {
            if (!req.user.active) {

                return res.redirect('/user/verify/email');
            } else {

                return next()
            }
        }
        return false;
    }
}


module.exports = new ActiveUser();