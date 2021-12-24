const middleware = require('app/http/middleware/middleware')


class CerfHandlerError extends middleware {
    handel(err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.render("errors/stack", {
            message: "توکن صفحه شما به پایان رسیده لطفا به صفحه قبل برگشته و صفحه را دوباره بارگذاری کنید!",
            stack: err.stack
        })
    }
}


module.exports = new CerfHandlerError();