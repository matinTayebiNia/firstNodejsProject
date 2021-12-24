const middleware = require('app/http/middleware/middleware')


class convertFileToFiled extends middleware {
    handel(req, res, next) {
        if (!req.file)
            req.body.images = undefined;
        else
            req.body.images = req.file.destination + '/' + req.file.filename;
        next()
    }
}

module.exports = new convertFileToFiled();