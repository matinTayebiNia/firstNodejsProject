const middleware = require("app/http/middleware/middleware")
const csrf = require("csurf")
const csrfInstance = csrf({cookie: true});


class CsrfMiddleware extends middleware {
    handel(req, res, next) {
        const ignoreRoute = ['/course/payment/back'];

        csrfInstance(req, res, (err) => {

            if (ignoreRoute.indexOf(req.path) !== -1) {
                // We will ignore the specific CSRF error for this specific path
                // Notice how we are not passing err back to next()
                next();
            } else {
                // Pass request along normally
                // If there is an error from CSRF or other middleware, it will be rethrown,
                // instead of being ignored
                next(err);
            }
        })

    }
}

module.exports = new CsrfMiddleware();
