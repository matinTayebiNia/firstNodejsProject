const controller = require('app/http/controllers/controller')
const Role = require('app/models/role')
const Permission = require('app/models/permission')


class roleController extends controller {

    async index(req, res, next) {
        try {
            const option = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: -1},
            }

            const roles = await Role.paginate({}, option)

            res.render('admin/role', {
                roles,
                title: "مقام ها"
            });
        } catch (e) {
            next(e)
        }

    }

    async create(req, res, next) {
        try {
            const title = 'ایجاد مقام جدید';
            const permissions = await Permission.find({});
            res.render('admin/role/create', {
                permissions,
                title
            })
        } catch (e) {
            next(e)
        }
    }

    async store(req, res, next) {
        try {
            const status = await this.ValidationData(req)
            if (!status) return this.back(req, res);
            const {name, permissions, label} = req.body;
            const newRole = new Role({
                name,
                label,
                permissions
            });
            await newRole.save();
            if (newRole) {
                this.alert(req)
                    .setTitle( "ثبت شد!")
                    .setIcon("success")
                    .setMessage( "مقام مورد نظر  با موفقیت ثبت شد")
                    .build();
                res.redirect('/admin/role')
            }
        } catch (e) {
            next(e)
        }
    }

    async edit(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('مقام مورد نظر یافت نشد', 404)
            const role = await Role.findById(req.params.id)
            const permissions = await Permission.find({});
            res.render('admin/role/update', {
                title: "ویرایش مقام",
                role,
                permissions
            })
        } catch (e) {
            next(e)
        }
    }


    async update(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('مقام نظر یافت نشد', 404)

            const status = await this.ValidationData(req)

            if (!status) return this.back(req, res);

            const {name, permissions, label} = req.body;

            await Role.findByIdAndUpdate(req.params.id, {
                name,
                label,
                permissions
            })
            this.alert(req)
                .setTitle("ویرایش شد!")
                .setIcon("success")
                .setMessage("مقام مورد نظر با موفقیت ویرایش شد")
                .build();
            res.redirect('/admin/role')
        } catch (e) {
            next(e)
        }
    }

    async destroy(req, res, next) {
        try {
            if (this.isMongoId(req.body.role_id)) return this.error('مقام مورد نظر یافت نشد.', 404)
            const role = await Role.findById(req.body.role_id).exec()
            await role.remove();
            this.alert(req)
                .setTitle("مقام مورد نظر با موفقیت حذف شد")
                .setIcon("success")
                .makeToast()
                .build();
            res.redirect('/admin/role');
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new roleController();