const request = require('app/http/Requests/Request')
const { check } = require('express-validator')
const Course = require('app/models/course')
const path = require('path')

class courseRequest extends request {
    handel() {
        return [
            check('title')
                .not().isEmpty()
                .withMessage('عنوان خالی میباشد.')
                .isLength({min: 5})
                .withMessage('عنوان کمتر از 5 کاراکتر میباشد')
                .custom(async (value, {req}) => {
                    if (req.query._method === 'put') {
                        let course = await Course.findById(req.params.id);
                        if (course.title === value) return;
                    }
                    let find = await Course.findOne({slug: this.slug(value)})
                    if (find) {
                        throw new Error('عنوان تکراری میباشد.')
                    }
                })
            ,
            check('type')
                .isIn(['free', 'vip', 'cash'])
                .withMessage('مقدار معتبر نیست')
            ,
            check('images')
                .custom(async (value, {req}) => {
                    if (req.query._method === 'put' && value === undefined) return;
                    if (!value)
                        throw new Error('وارد کردن تصویر الزامی است.');
                    const fileExt = ['.png', '.jpg', '.jpeg','.PNG','.JPG','JPEG']
                    if (!fileExt.includes(path.extname(value)))
                        throw new Error('پسوند فایل باید از نوع png،jpg،jpeg باشد ')
                })
            ,
            check('body')
                .not().isEmpty()
                .withMessage('توضیحات دوره وارد نشده')
            ,
            check('categories')
                .not().isEmpty()
                .withMessage('دسته بندی دوره انتخاب نشده')
            ,
            check('price')
                .isNumeric()
                .withMessage('مقدار وارد شده معتبر نیست')
                .not().isEmpty()
                .withMessage('مقدار بها دوره وارد نشده')
            , check('tags')
                .not().isEmpty()
                .withMessage('تگ وارد نشده ')
                .isLength({min: 3})
                .withMessage('تگ وارد شده کمتر از 3 کاراکتر میباشد.')
        ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
    }
}

/**/
module.exports = new courseRequest();