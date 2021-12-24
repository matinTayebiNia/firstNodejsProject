const request = require('app/http/Requests/Request')
const {check} = require('express-validator/check')

class loginRegister extends request {
    handel() {
        return [
            check('email')
                .not().isEmpty()
                .withMessage('ایمیل وارد نشده')
                .isEmail()
                .withMessage('ایمیل معتبر نیست'),
            check('password')
                .not().isEmpty()
                .withMessage('رمز عبور وارد نشده')
        ]
    }
}

module.exports = new loginRegister();