const controller = require('app/http/controllers/api/controller')
const Order = require('app/models/order')

class panelController extends controller {

    async user(req, res) {
        try {
            let user = await req.user.populate({
                path: "roles",
                select: "name label permissions",
                populate: [{path: "permissions", select: "name label"}]
            }).execPopulate();

            return res.json({
                data: this.filterDataUser(user),
                status: "success"
            })
        } catch (e) {
            this.failed(e.message, res)
        }
    }

    async history(req, res) {
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
            return res.status(200).json({
                data: orders,
                status: "success"
            })

        } catch (e) {
            this.failed(e.message, res)
        }
    }

    filterDataUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            createdAt: user.createdAt,
            vipTime: user.VipTime,
            vipType: user.VipType,
            roles: user.roles.map(role => {
                return {
                    name: role.name,
                    label: role.label,
                    permissions: role.permissions.map(permission => {
                        return {
                            name: permission.name,
                            label: permission.label
                        }
                    })
                }
            })
        };
    }

}


module.exports = new panelController();