const request = require('app/http/Requests/Request')
const {check} = require('express-validator/check')
const Course = require('app/models/course')
const path = require('path')

class episodeRequest extends request {
    handel() {

        return [
            check('title')
                .not().isEmpty()
                .withMessage('عنوان خالی میباشد.')
                .isLength({min: 5})
                .withMessage('عنوان کمتر از 5 کاراکتر میباشد')
            ,
            check('type')
                .isIn(['free', 'vip', 'cash'])
                .withMessage('مقدار معتبر نیست')
            ,
            check('body')
                .not().isEmpty()
                .withMessage('توضیحات ویدیو وارد نشده')
            ,
            check('time')
                .not().isEmpty()
                .withMessage('زمان ویدیو وارد نشده')
            ,
            check('course')
                .not().isEmpty()
                .withMessage('فیلد انتخاب دوره نمی تواند خالی بماند')
            ,
            check('videoUrl').not().isEmpty()
                .withMessage('ادرس ویدیو ها وارد نشده.')
            ,
            check('number')
                .not().isEmpty()
                .withMessage('شماره جلسه وارد نشده.')
                .isNumeric()
                .withMessage('شماره جلسه باید از نوع عدد باشد.')

        ]
    }
}

/**/
module.exports = new episodeRequest();