const request = require('app/http/Requests/Request')
const { check } = require('express-validator')
const Permission = require('app/models/permission')

class permissionRequest extends request {
    handel() {
        return [
            check('name')
                .not().isEmpty()
                .withMessage('نام دسترسی وارد نشده')
                .isLength({min: 3})
                .withMessage('عنوان کمتر از 3 کاراکتر میباشد')
                .custom(async (value, {req}) => {
                    if (req.query._method === 'put') {
                        let permission = await Permission.findById(req.params.id);
                        if (permission.name === value) return;
                    }
                    let find = await Permission.findOne({name: value})
                    if (find) {
                        throw new Error('دسترسی وارد شده تکراری میباشد.')
                    }
                })
            ,
            check('label')
                .not().isEmpty()
                .withMessage('توضیحات مربوط به دسترسی خالی می باشد')
            ,
        ]
    }
}


module.exports = new permissionRequest();