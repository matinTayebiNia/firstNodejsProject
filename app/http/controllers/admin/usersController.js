const controller = require('app/http/controllers/controller')
const User = require('app/models/user')
const Role = require('app/models/role')
const passport = require('passport')

class usersController extends controller {

    async index(req, res, next) {
        try {
            const option = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: 1},
            }
            const users = await User.paginate({}, option)
            const title = "کاربران";
            res.render('admin/users/index', {
                title,
                users
            })

        } catch (e) {
            next(e)
        }
    }

    create(req, res, next) {
        try {
            const title = "ایجاد کاربر جدید";
            res.render('admin/users/create', {
                title
            })
        } catch (e) {
            next(e)
        }
    }

    async store(req, res, next) {
        try {
            let status = await this.ValidationData(req);
            if (!status) return this.back(req, res);
            passport.authenticate('local.register', (err, user) => {
                    if (user) {
                        this.alert(req)
                            .setTitle("ثبت شد!")
                            .setIcon("success")
                            .setMessage("کاربر مورد نظر  با موفقیت ثبت شد")
                            .build();
                        return res.redirect('/admin/users')
                    }
                    return this.back(req, res);
                }
            )(req, res, next);

        } catch (e) {
            next(e)
        }
    }

    async edit(req, res, next) {
        try {

            const title = "ویرایش کاربر";
            const user = await User.findById(req.params.id, {admin: 1, name: 1, email: 1})
            if (!user) return this.error('کاربر مورد نظر یافت نشد.', 404)

            res.render('admin/users/update', {
                title,
                user
            })
        } catch (e) {
            next(e)
        }
    }

    async addRole(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('کاربر مورد نظر یافت نشد.', 404);
            const user = await User.findById(req.params.id);
            // return res.json(user.roles)
            const roles = await Role.find({});
            const title = "اعمال دسترسی";
            res.render('admin/users/addRole', {
                user,
                title,
                roles,
            })

        } catch (e) {
            next(e)
        }
    }

    async storeAddRole(req, res, next) {
        try {
            delete req.body.name;
            if (this.isMongoId(req.params.id)) return this.error('کاربر مورد نظر یافت نشد.', 404);
            const user = await User.findById(req.params.id);
            user.set({roles: req.body.roles});
            await user.save();
            this.alert(req)
                .setTitle("دسترسی اعمال شد!")
                .setIcon("success")
                .setMessage("دسترسی مورد نظر برای کاربر مورد نظر اعمال شد")
                .setButton("باشه")
                .build();
            return res.redirect('/admin/users')
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('کاربر مورد نظر یافت نشد.', 404);
            const status = await this.ValidationData(req);
            if (!status) return this.back(req, res)
            await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    ...req.body
                }
            })
            this.alert(req)
                .setTitle("ویرایش شد!")
                .setIcon("success")
                .setMessage("کاربر مورد نظر  با موفقیت ویرایش شد")
                .build();
            return res.redirect('/admin/users')
        } catch (e) {
            next(e)
        }
    }

    async destroy(req, res, next) {
        try {
            if (this.isMongoId(req.body.user_id)) return this.error('چنین کاربری یافت نشد', 404)
            const user = await User.findById(req.body.user_id).populate([{
                path: 'courses',
                populate: 'episodes'
            }]).exec();
            user.courses.forEach(course => {
                course.episodes.forEach(episode => episode.remove())
                course.remove()
            })
            await user.remove();
            this.alert(req)
                .setTitle("کاربر مورد نظر  با موفقیت حذف شد")
                .setIcon("success")
                .makeToast()
                .build();
            return this.back(req, res);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new usersController();