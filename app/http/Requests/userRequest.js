const request = require('app/http/Requests/Request')
const { check } = require('express-validator')
const User = require('app/models/user')

class registerRequest extends request {
    handel() {
        return [
            check('fullName')
                .not().isEmpty()
                .withMessage('لطفا نام خود را وارد نمایید')
                .isLength({min: 5})
                .withMessage('نام نمیتواند کمتر از 5 کرکتر باشد'),
            check('email')
                .not().isEmpty()
                .withMessage('ایمیل وارد نشده')
                .isEmail()
                .withMessage('ایمیل معتبر نیست')
                .custom(async (value, {req,}) => {
                    const user = await User.findOne({email: value})
                    if (req.query._method === 'put' && user.email === value) return true;
                    if (user) {
                        throw new Error('ایمیل وارد شده در سیستم ثبت شده است و قابلیت استفاده مجدد ندارد')
                    }
                })
            ,
        ]
    }
}


module.exports = new registerRequest();