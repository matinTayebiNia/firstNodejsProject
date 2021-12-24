const controller = require("app/http/controllers/controller")
const ActivationCode = require('app/models/activaionCode');

class VerifyEmailController extends controller {


    showVerifyFormEmail(req, res, next) {
        try {
            if (!req.user.active)
                return res.render("home/auth/verify");
            return res.redirect('/user/panel')
        } catch (e) {
            next(e)
        }
    }


    async resendVerifyEmail(req, res, next) {
        try {
            //resendEmailVerifyAt
            await ActivationCode().userHasActivationCode(req.user)
            this.alert(req, {
                title: "ارسال شد",
                message: "پیام تایید ایمیل،به ایمیل شما ارسال شد",
                icon: "success",
                button: "بسیار خوب"
            })
            return this.back(req, res);

        } catch (e) {
            next(e)
        }
    }

    async verifyUser(req, res, next) {
        try {
            const activation = await ActivationCode.findOne({
                code: req.params.token,
            }).populate({path: 'user', select: "name active email"})
            if (!activation) {
                this.alert(req, {
                    title: "خطا",
                    message: " پیام تایید ایمیلی وجود ندارد",
                    icon: "error",
                    button: "بسیار خوب"
                })
                return res.redirect('/')
            }

            if (activation.expire < new Date()) {
                this.alert(req, {
                    title: "خطا",
                    message: "زمان پیام تایید ایمیل شما به پیان رسیده",
                    icon: "error",
                    button: "بسیار خوب"
                })
                return res.redirect('/')
            }

            if (activation.use) {
                this.alert(req, {
                    title: "خطا",
                    message: "این پیام قبلا استفاده شده",
                    icon: "error",
                    button: "بسیار خوب"
                })
                return res.redirect('/')
            }
            activation.$set({use: true});
            activation.user.$set({active: new Date().toISOString()});
            await activation.save()
            await activation.user.save()
            this.alert(req, {
                title: "تایید شد",
                message: "ایمیل شما تایید شد",
                icon: "success",
                button: "بسیار خوب"
            })
            return res.redirect('/')

        } catch (e) {
            next(e)
        }
    }

}


module.exports = new VerifyEmailController();