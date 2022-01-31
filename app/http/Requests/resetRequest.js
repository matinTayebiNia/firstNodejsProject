const request = require('app/http/Requests/Request')
const { check } = require('express-validator')

class resetRequest extends request {
    handel() {
        return [
            check('email')
                .isEmail()
                .withMessage('ایمیل وارد نشده'),
            check('password')
                .not().isEmpty()
                .withMessage('رمز عبور وارد نشده')
                .isLength({ min: 8 })
                .withMessage('رمز عبور نمیتواند کمتر از 8 کرکتر باشد')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
                .withMessage('رمز عبور باید از حروف بزرگ و کوچک اینگلیسی واعداد باشد.')
                .normalizeEmail(),
            check('confrimPassword')
                .custom((value, { req }) => {
                    if (value === req.body.password) {
                        return true;
                    }
                })
                .withMessage('مقادیر رمز های وارد شده برابر نیست')
                .not().isEmpty()
                .withMessage('تکرار رمز عبور وارد نشده'),
            check('token')
                .not().isEmpty()
                .withMessage('توکن ست نشده لطفا با پشتیبانی تماس بگیرید.')
        ]
    }
}

module.exports = new resetRequest();