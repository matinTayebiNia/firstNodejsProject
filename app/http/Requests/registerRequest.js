const request = require('app/http/Requests/Request')
const { check } = require('express-validator')

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
                .withMessage('ایمیل معتبر نیست'),
            check('password')
                .not().isEmpty()
                .withMessage('رمز عبور وارد نشده')
                .isLength({min: 8})
                .withMessage('رمز عبور نمیتواند کمتر از 8 کرکتر باشد')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
                .withMessage('رمز عبور باید از حروف بزرگ و کوچک اینگلیسی واعداد باشد.'),
            check('confrimPassword')
                .custom((value,{req}) => {
                    if (value === req.body.password) {
                        return true;
                    }
                })
                .withMessage('مقادیر رمز های وارد شده برابر نیست')
                .not().isEmpty()
                .withMessage(' تکرار رمز عبور وارد نشده'),
        ]
    }

}


module.exports = new registerRequest();