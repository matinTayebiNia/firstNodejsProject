const Controller = require('app/http/controllers/controller')
const passport = require('passport');
const ActivationCode = require('app/models/activaionCode')

class registerController extends Controller {

    showRegisterForm(req, res) {
        const title = 'صفحه عضویت';
        res.render('home/auth/register', {
            recaptcha: this.recaptcha.render(),
            title
        });

    }

    async RegisterProccess(req, res, next) {
        await this.recaptchaValidation(req, res);
        let result = await this.ValidationData(req);
        if (result) return this.register(req, res, next);
        return this.back(req, res);
    }

    async register(req, res, next) {
        passport.authenticate('local.register', async (err, user) => {
                if (user) {


                    await ActivationCode().userHasActivationCode(user)


                    req.logIn(user, err => {
                        if (err) return this.error('مشکلی در سیستم به وجود آمده لطفا با پشتبانی تماس بگیرید', 500)
                        this.alert(req)
                            .setTitle("موفقیت")
                            .setMessage("ثبت نام با موفقیت انجام شد")
                            .setIcon("success")
                            .setButton("باشه")
                            .build();
                    })
                    return res.redirect('/')
                }
                return this.back(req, res);
            }
        )(req, res, next);
    }
}

module.exports = new registerController();