const controller = require('app/http/controllers/controller')
const Permission = require('app/models/permission')

class categoryController extends controller {

    async index(req, res, next) {
        try {
            const option = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: -1},
            }
            const permissions = await Permission.paginate({}, option)
            res.render('admin/permission', {
                permissions,
                title: "دسترسی ها"
            });
        } catch (e) {
            next(e)
        }

    }

    async create(req, res, next) {
        try {
            const title = 'ایجاد دسته بندی جدید'
            res.render('admin/permission/create', {
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
            const {name, label} = req.body;
            const newPermission = new Permission({
                name,
                label
            });
            await newPermission.save();
            if (newPermission) {
                this.alert(req)
                    .setTitle( "ثبت شد!")
                    .setMessage("دسته بندی مورد نظر  با موفقیت ثبت شد")
                    .setIcon("success")
                    .build();
                res.redirect('/admin/permission')
            }
        } catch (e) {
            next(e)
        }
    }

    async edit(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('دسترسی مورد نظر یافت نشد', 404)
            const permission = await Permission.findById(req.params.id)

            res.render('admin/permission/update', {
                title: "ویرایش دسترسی",
                permission,
            })
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('دسته مورد نظر یافت نشد', 404)
            const status = await this.ValidationData(req)
            if (!status) return this.back(req, res);
            const {name, label} = req.body;
            await Permission.findByIdAndUpdate(req.params.id, {
                name,
                label,
            })
            this.alert(req)
                .setTitle( "ویرایش شد!")
                .setMessage("دسترسی مورد نظر  با موفقیت ویرایش شد")
                .setIcon("success")
                .build();
            res.redirect('/admin/permission')
        } catch (e) {
            next(e)
        }
    }

    async destroy(req, res, next) {
        try {
            if (this.isMongoId(req.body.permission_id)) return this.error('دسته بندی مورد نظر یافت نشد.', 404)
            const permission = await Permission.findById(req.body.permission_id).exec()
            await permission.remove();
            this.alert(req)
                .setTitle( "دسترسی مورد نظر با موفقیت حذف شد")
                .setIcon("success")
                .makeToast()
                .build();
            res.redirect('/admin/permission');

        } catch (e) {
            next(e)
        }
    }

}

module.exports = new categoryController();