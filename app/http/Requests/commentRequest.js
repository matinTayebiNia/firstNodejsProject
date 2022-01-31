const request = require('app/http/Requests/Request')
const { check } = require('express-validator')

class CommentRequest extends request {
    handel() {
        return [
            check('comment')
                .not().isEmpty()
                .withMessage('لطفا نظر خود را وارد کنید.')
                .isLength({ min: 10 })
                .withMessage('متن نظر نمیتواند کمتر از 10 کارکتر باشد.')
        ];
    }
}

module.exports = new CommentRequest();