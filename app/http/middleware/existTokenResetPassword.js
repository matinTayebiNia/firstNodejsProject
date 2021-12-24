const middleware = require('app/http/middleware/middleware')
const PasswordReset = require('app/models/password-reset')

class existTokenResetPassword extends middleware {
    async handel(req, res, next) {
        let field = await PasswordReset.findOne({token: req.params.token})
        if (field) {
            next()
        }
        res.redirect('/')
    }
}


module.exports = new existTokenResetPassword();