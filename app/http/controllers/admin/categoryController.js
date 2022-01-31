const controller = require('app/http/controllers/controller')
const Category = require('app/models/category')

class categoryController extends controller {

    async index(req, res, next) {
        const categoriesAggregate = await this.getChileCategory()
        let categories = []

        categoriesAggregate.map(category => {
            let single_child = this.list_to_tree(category.childCategory);
            let obj = {
                _id: category._id,
                name: category.name,
                children: single_child
            };
            categories.push(obj)
        })
        res.render('admin/category', {
            categories,
            title: "دسته بندی ها"
        });
    }

    async create(req, res, next) {
        try {
            const Categories = await Category.find({})
            const title = 'ایجاد دسته بندی جدید'
            res.render('admin/category/create', {
                Categories,
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
            const {name, parent} = req.body;
            const newCategory = new Category({
                name,
                parent: parent !== 'none' ? parent : null,
                slug: this.slug(name)
            });
            await newCategory.save();
            if (newCategory) {
                this.alert(req)
                    .setTitle("ثبت شد!")
                    .setMessage("دسته بندی مورد نظر  با موفقیت ثبت شد")
                    .setIcon("success")
                    .build();
                res.redirect('/admin/categories')
            }
        } catch (e) {
            next(e)
        }
    }

    async edit(req, res, next) {
        try {
            if (this.isMongoId(req.params.id)) return this.error('دسته مورد نظر یافت نشد', 404)
            const cat = await Category.findById(req.params.id)
            const Categories = await Category.find({_id: {$nin: req.params.id}})
            res.render('admin/category/update', {
                title: "ویرایش دسته",
                cat,
                Categories,
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
            const {name, parent} = req.body;
            await Category.findByIdAndUpdate(req.params.id, {
                name,
                parent: parent !== 'none' ? parent : null,
                slug: this.slug(name)
            })
            this.alert(req)
                .setTitle("ویرایش شد!")
                .setMessage("دسته بندی مورد نظر  با موفقیت ویرایش شد")
                .setIcon("success")
                .build();
            res.redirect('/admin/categories')
        } catch (e) {
            next(e)
        }
    }

    async destroy(req, res, next) {
        try {
            if (this.isMongoId(req.body.category_id)) return this.error('دسته بندی مورد نظر یافت نشد.', 404)
            const category = await Category.findById(req.body.category_id).populate('chileCategory').exec()
            category.chileCategory.forEach(category => category.remove())
            await category.remove();
            this.alert(req)
                .setTitle("دسته بندی مورد نظر  با موفقیت حذف شد")
                .setIcon("success")
                .makeToast()
                .build();
            res.redirect('/admin/categories');

        } catch (e) {
            next(e)
        }
    }

}

module.exports = new categoryController();