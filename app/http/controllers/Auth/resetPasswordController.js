const Controller = require('app/http/controllers/controller')
const PasswordReset = require('app/models/password-reset')
const User = require('app/models/user')

class resetPasswordController extends Controller {

    showRestPassword(req, res) {
        const title = 'فراموشی رمز عبور';
        res.render('home/auth/password/resetPassword', {

            recaptcha: this.recaptcha.render(),
            title,
            token: req.params.token
        })
    }

    async PasswordResetProcess(req, res) {
        await this.recaptchaValidation(req, res);
        let result = await this.ValidationData(req);
        if (result) return this.ResetPassword(req, res)
        req.flash('old', req.body)
        return res.redirect('/auth/password/reset/' + req.body.token)
    }

    async ResetPassword(req, res) {
        let field = await PasswordReset.findOne({
            $and: [{token: req.body.token},
                {email: req.body.email}]
        })
        if (!field) {
            req.flash('errors', {'param': 'fieldReset', 'msg': 'اطلاعات وارد شده صحیح نمیباشد.'})
            return this.back(req, res)
        }
        if (field.use) {
            req.flash('errors', {'param': 'fieldReset', 'msg': 'از این لینک برای بازیابی رمز عبور  استفاده شده است.'})
            return this.back(req, res)
        }
        console.log(req.body.password)
        let user = await User.findOne({email: field.email})
        if (!user) {
            req.flash('errors', 'عملیات با موفقیت انجام نشد لطفا با پشتیبانی تماس بگیرید.')
            this.back(req, res);
        }
        this.alert(req, {
            title: "موفقیت آمیز",
            message: "رمز عبور شما با موفقیت ویرایش شد",
            icon: "success",
            button: "باشه"
        })
        user.password = req.body.password;
        await user.save();
        await field.update({use: true});

        return res.redirect('/auth/login')
    }
}


module.exports = new resetPasswordController();