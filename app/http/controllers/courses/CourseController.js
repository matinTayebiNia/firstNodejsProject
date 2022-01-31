const Controller = require('app/http/controllers/controller')
const fs = require('fs')
const path = require('path')
const Episode = require('app/models/episode');
const Course = require('app/models/course');
const Category = require('app/models/category');
const axios = require('axios');
const randomString = require("randomstring");
const Order = require('app/models/order');

class CourseController extends Controller {

    async index(req, res) {
        const course = await Course.findOneAndUpdate({slug: req.params.slug}, {$inc: {viewCount: 1}})
            .populate([
                {path: 'episodes', populate: {path: 'course', select: 'slug'}, options: {sort: {number: 1}}},
                {path: 'user', select: 'name'}]).populate([
                {
                    path: 'comment',
                    select: "comment user createdAt",
                    match: {parent: {$eq: null}, approved: {$eq: true}}
                    ,
                    populate: [{path: 'user', select: 'name ',}, {
                        path: "parentComment",
                        select: "comment user createdAt",
                        match: {approved: true},
                        populate: {path: 'user', select: "name"}
                    }]
                },
            ]).populate(['categories']).exec();
        const title = course.title;
        const categories = await Category.find({parent: null}).populate(['chileCategory']).exec()
        res.render('home/courses/index', {
            title,
            course,
            categories
        });
    }

    async download(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let episode = await Episode.findByIdAndUpdate(req.params.id);
            if (!episode) this.error('چنین ویدیو ای برای این دوره بافت نشد.', 404);
            if (!this.checkHash(req, episode)) this.error('اعتبار لینک شما به پایان رسیده است.', 403)
            let filePath = path.resolve('./public' + episode.videoUrl)
            if (!fs.existsSync(filePath)) this.error('چنین ویدیو ای بافت نشد.', 404);
            res.download(filePath)
            await episode.incr('downloadCount');
        } catch (error) {
            next(error);
        }
    }

    async payment(req, res, next) {
        try {
            this.isMongoId(req.body.course_id)
            let course = await Course.findById(req.body.course_id)
            if (!course) {
                return this.backAndSetAlert(req, res, {
                    title: " یافت نشد",
                    icon: "error",
                    message: "دوره مورد نظر یافت نشد",
                    timer: 4000,
                });
            }
            if (await req.user.checkLearning(course)) {
                return this.backAndSetAlert(req, res, {
                    title: " خریداری شده!",
                    icon: "error",
                    message: "دوره مورد نظر خریداری شده!",
                    timer: 4000,
                });
            }
            if (course.price === 0 && course.type === 'free') {
                return this.backAndSetAlert(req, res, {
                    title: "خطا",
                    icon: "error",
                    message: "دوره مورد نظر رایگان است ",
                    timer: 4000,
                });
            }

            // buy process
            let params = {
                Amount: 1000,
                payerName: req.user.name,
                returnUrl: `${env('APP_URL')}/course/payment/back`,
                description: "خرید تست",
                clientRefId: randomString.generate(7),
                payerIdentity: req.user.email,
            }
            axios.post('https://api.payping.ir/v2/pay', params, {
                headers: this.configHeaderRequest(),
            }).then(async result => {
                let order = new Order({
                    user: req.user._id,
                    course: course.id,
                    clientRefId: result.data.code,
                    //course.price
                    amount: 1000,
                    vip: false,
                })
                await order.save();
                res.redirect(`https://api.payping.ir/v2/pay/gotoipg/${result.data.code}`)
            }).catch(err => {
                if (err) {
                    return this.backAndSetAlert(req, res, {
                        title: " مشکلی پیش آمده!",
                        icon: "error",
                        message: "مشکلی در بر قراری ارتباط با درگاه پرداخت به وجود امده لطفا به پشتیبانی اطلاع دهید! \n خطا: " + err.message,
                        timer: 4000,
                    });
                }
            })
        } catch (e) {
            next(e)
        }
    }

    async checking(req, res, next) {
        const order = await Order.findOne({clientRefId: req.body.code}).populate(['course', {
            path: "user",
            select: "learning"
        }])
        if (!order) {
            return this.backAndSetAlert(req, res, {
                title: "دقت کنید",
                message: "سفارش مورد نظر یافت نشد",
                icon: 'error',
                timer: 3000
            })
        }
        if (req.body.cardhashpan) {

            const params = {
                refId: req.body.refid,
                //order.amount
                amount: 1000
            }

            axios.post('https://api.payping.ir/v2/pay/verify', params, {
                headers: this.configHeaderRequest()
            }).then(async result => {
                order.set({payment: true})
                req.user.learning.push(order.course.id);
                await order.save()
                await req.user.save()
                this.alert(req, {
                    title: "دقت کنید",
                    message: "خرید شما با موفقیت انجام شد",
                    icon: "success",
                    timer: 3000
                })
                res.redirect(order.course.path())
            }).catch(err => {
                console.log(err.message)
                res.json(err.message)
            })
        } else {
            this.backAndSetAlert(req, res, {
                title: "دقت کنید",
                message: "سفارش دوره توسط شما لغو شد",
                icon: "error",
                timer: 3000
            })
        }
    }

    backAndSetAlert(req, res, data) {
        this.alert(req)
            .setTitle(data.title)
            .setMessage(data.message)
            .setIcon(data.icon)
            .setButton(!!data.button)
            .build();
        return this.back(req, res)
    }
}

module.exports = new CourseController();
