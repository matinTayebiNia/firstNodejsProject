const Controller = require('app/http/controllers/controller')
const Order = require('app/models/order');
const axios = require('axios')
const randomString = require('randomstring');

class UserController extends Controller {
    async index(req, res, next) {
        try{
            
            res.render('home/panel', {
                title: "پنل کاربری | اطلاعات کاربر"
            })

        } catch (err) {
            next(err);
        }
    }

    async history(req, res, next) {
        try {
            const options = {
                page: req.query.page || 1,
                limit: 5,
                sort: {createdAt: -1},
                populate: [
                    {path: "user", select: "email"},
                    {path: "course", select: "title"}
                ]
            };
            const orders = await Order.paginate({user: req.user.id}, options);
            res.render('home/panel/history', {
                title: "پنل کاربری | سفارشات",
                orders,
            })
        } catch (e) {
            next(e)
        }
    }

    async loadVipPage(req, res, next) {
        try {
            res.render('home/panel/vip', {
                title: "پنل کاربری | شارژ اعضای ویژه",
            })
        } catch (e) {
            next(e)
        }
    }

    async buyVip(req, res, next) {
        try {

            let plan = req.body.plan,
                price;
            switch (plan) {
                case "3":
                    price = 30000;
                    break;
                case "12":
                    price = 90000;
                    break;
                default:
                    price = 10000;
                    break;
            }
            // buy process
            let params = {
                // price
                Amount: 1000,
                payerName: req.user.name,
                returnUrl: `${env('APP_URL')}/user/panel/vip/payment/checking`,
                description: "خرید تست",
                clientRefId: randomString.generate(7),
                payerIdentity: req.user.email,
            }

            axios.post('https://api.payping.ir/v2/pay', params, {
                headers: this.configHeaderRequest(),
            }).then(async result => {
                let order = new Order({
                    user: req.user._id,
                    clientRefId: result.data.code,
                    //course.price
                    amount: 1000,
                    vip: true,
                })
                await order.save();
                res.redirect(`https://api.payping.ir/v2/pay/gotoipg/${result.data.code}`)
            }).catch(err => {
                return this.backAndSetAlert(req, res, {
                    title: " مشکلی پیش آمده!",
                    icon: "error",
                    message: "مشکلی در بر قراری ارتباط با درگاه پرداخت به وجود امده لطفا به پشتیبانی اطلاع دهید! \n خطا: " + err.message,
                    timer: 4000,
                });
            })
        } catch (e) {
            next(e)
        }
    }

    async checkingVipIsBuying(req, res, next) {
        try {
            const order = await Order.findOne({clientRefId: req.body.code}).populate(['course', {
                path: "user",
                select: "learning"
            }])

            let time = 0,
                type = "";
            if (!order.vip) {
                this.backAndSetAlert(req, res, {
                    title: "دقت کنید",
                    message: "این تراکنش مربوط به افزایش اعتبار اعضای ویژه نمی باشد.",
                    icon: "danger",
                    button: "بسیار خوب"
                })
            }
            switch (order.amount) {
                //most be 10000 , this is just for test :)
                case 1000:
                    time = 1;
                    type = "month"
                    break;
                case 30000:
                    time = 3;
                    type = "3month"
                    break;
                case 90000:
                    time = 12;
                    type = "12month"
                    break;
            }
            if (time === 0) {
                this.backAndSetAlert(req, res, {
                    title: "دقت کنید",
                    message: "عملیات مورد نظر با موفقیت انجام نشد.",
                    icon: "danger",
                    timer: 3000
                })
            }


            if (req.body.cardhashpan) {
                const params = {
                    refId: req.body.refid,
                    //order.amount
                    amount: 1000
                }
                let VipTime = req.user.isVip() ? new Date(req.user.VipTime) : new Date();
                VipTime.setMonth(VipTime.getMonth() + time);
                axios.post('https://api.payping.ir/v2/pay/verify', params, {
                    headers: this.configHeaderRequest()
                }).then(async result => {
                    order.set({payment: true})
                    req.user.set({VipTime, VipType: type,})
                    await req.user.save()
                    await order.save()
                    this.backAndSetAlert(req, res, {
                        title: "دقت کنید",
                        message: "خرید شما با موفقیت انجام شد",
                        icon: "success",
                        button: "بسیار خوب"
                    })
                }).catch(err => {
                    res.json(err.message)
                })
            } else {
                this.backAndSetAlert(req, res, {
                    title: "دقت کنید",
                    message: "سفارش افزایش عضویت ویژه توسط شما لغو شد",
                    icon: "error",
                    button: "بسیار خوب"
                })
            }
        } catch (e) {
            next(e)
        }
    }

    backAndSetAlert(req, res, data) {
        this.alert(req, data)
        return res.redirect('/user/panel/vip')
    }
}

module.exports = new UserController();
