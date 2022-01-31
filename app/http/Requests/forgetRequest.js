const request = require('app/http/Requests/Request')
const { check } = require('express-validator')

class forgetRequest extends request {
    handel() {
        return [
            check('email')
                .isEmail()
                .withMessage('ایمیل وارد نشده')
        ]
    }
}

module.exports = new forgetRequest();