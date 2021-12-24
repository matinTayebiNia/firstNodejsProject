const autoBind = require("auto-bind")
const isMongoId = require('validator/lib/isMongoId');
const {validationResult} = require('express-validator/check')


module.exports = class Controller {

    constructor() {
        autoBind(this)
    }

    failed(msg, res, statusCode = 500) {
        return res.status(statusCode).json({
            data: msg,
            status: "error"
        })
    }

    isMongoId(paramId, res) {
        if (!isMongoId(paramId))
            return this.failed('ای دی وارد شده صحیح نیست', res, 404);
    }

    async ValidationData(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            const message = [];
            errors.map(item => {
                message.push({'param': item.param, 'msg': item.msg})
            })
            this.failed(message, res, 403)
            return false;
        }
        return true;
    }
}



