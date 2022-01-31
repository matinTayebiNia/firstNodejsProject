const controller = require('app/http/controllers/controller');
const Order = require('app/models/order');
class ordersController extends controller {
    async index(req, res, next) {
        try {
            const option = {
                page: req.query.page || 1,
                limit: 10,
                sort: { createdAt: -1 },
                populate: [{ path: 'user', select: "email" },
                { path: 'course', select: "title" }]
            }
            const orders = await Order.paginate({}, option)
            const title = "سفارشات"
            res.render('admin/order/index', {
                title,
                orders
            })
        } catch (error) {
            next(error);
        }
    }

    async destroy(req, res, next) {
        try {
            if (this.isMongoId(req.body.order_id)) return this.error('سفارش مورد نظر یافت نشد.', 404)
            const order = await Order.findById(req.body.order_id).exec()
            await order.remove();
            this.alert(req)
                .setTitle( "سفارش مورد نظر با موفقیت حذف شد")
                .setIcon("success")
                .makeToast()
                .build();
            res.redirect('/admin/orders');
        } catch (error) {
            next(error);
        }
    }

}


module.exports = new ordersController();