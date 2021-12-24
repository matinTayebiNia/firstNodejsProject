const Controller = require('app/http/controllers/controller')
const PasswordReset = require('app/models/password-reset')
const User = require('app/models/user')
const uniqueString = require('unique-string');
const queueMailer = require("app/Helpers/queueMailer")

class forgetPasswordController extends Controller {

    showForgetPassword(req, res) {
        const title = 'فراموشی رمز عبور';
        res.render('home/auth/password/forgetPassword', {
            recaptcha: this.recaptcha.render(),
            title
        })
    }

    async sendPasswordResetLink(req, res, next) {
        await this.recaptchaValidation(req, res);
        let result = await this.ValidationData(req);
        if (result) return this.sendRestLink(req, res, next)
        return this.back(req, res);
    }

    async sendRestLink(req, res, next) {
        try {
            let user = await User.findOne({email: req.body.email})
            if (!user) {
                req.flash('errors', {'param': 'fieldforget', 'msg': 'کاربری با ایمیل وارد شده وجود ندارد'})
                return this.back(req, res)
            }
            const newPasswordReset = new PasswordReset({
                email: req.body.email,
                token: uniqueString(),
            })
            await newPasswordReset.save();

            await queueMailer(newPasswordReset, "فراموشی رمز عبور")

            this.alert(req, {
                icon: "info",
                button: "باشه",
                title: "موفقیت آمیز",
                message: "پیام بازیابی رمز عبور به پست الکترونیک شما ارسال شد",
            })
            res.redirect('/')
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}


module.exports = new forgetPasswordController();