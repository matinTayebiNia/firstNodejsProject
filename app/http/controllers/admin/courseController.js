const controller = require('app/http/controllers/controller')
const Course = require('app/models/course')
const fs = require('fs')
const path = require('path')
const Category = require('app/models/category')
const sharp = require('sharp')

class courseController extends controller {

    async index(req, res, next) {
        const title = 'دوره ها';
        const query = {
            find: await this.getSearchRequest(req.body.search, next)
        };

        const options = {
            page: req.query.page || 1,
            limit: 10,
            sort: {createdAt: 1},
        };
        let courses = await Course.paginate(query, options);
        // res.json(courses)
        res.render('admin/course/index', {
            title,
            courses,
        })
    }

    async getSearchRequest(val) {
        if (val) {
            return Course.find({title: val});
        }
    }

    async create(req, res) {
        const title = 'ایجاد دوره جدید';
        const categories = await Category.find();
        res.render('admin/course/create', {
            title,
            categories
        })
    }

    async store(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) {
                if (req.file)
                    fs.unlinkSync(req.file.path);
                return this.back(req, res)
            }


            let images = this.ResizeImage(req);

            let {title, body, price, type, tags, categories} = req.body;
            let newCourse = new Course({
                user: req.user._id,
                title,
                slug: this.slug(title),
                type,
                body,
                price,
                images,
                thumb: images[480],
                tags,
                categories
            })
            await newCourse.save();

            this.alert(req, {
                toast: false,
                title: "ثبت شد!",
                message: "دوره با موفقیت ثبت شد",
                icon: "success",
            })
            res.redirect('/admin/course')
        } catch (e) {
            next(e);
        }
    }


    ResizeImage(req) {

        const imageInfo = path.parse(req.file.path);

        let imageAddress = {};

        imageAddress['original'] = this.getUrlImage(req.body.images);

        const resize = size => {
            let ImageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
            imageAddress[size] = this.getUrlImage(req.file.destination + '/' + ImageName);
            sharp(req.file.path)
                .resize(size, null)
                .toFile(req.file.destination + '/' + ImageName)

        };


        [1080, 720, 480].map(resize)

        return imageAddress;
    }


    async edit(req, res, next) {
        try {
            const title = "ویرایش دوره"
            let course = await Course.findById(req.params.id)
            if (!course) {
                return this.back(req, res);
            }
            const categories = await Category.find();
            res.render('admin/course/update', {
                course,
                title,
                categories
            });
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) {
                if (req.file)
                    fs.unlinkSync(req.file.path);
                return this.back(req, res)
            }
            let ObjForUpdate = {}
            //set image thumb
            ObjForUpdate.thumb = req.body.imagesThumb;
            //check the new image uploaded if that's true: remove the old image and upload new image
            await this.CheckingNewImageUploaded(req, ObjForUpdate);
            //update course
            await this.updatingCourse(req, ObjForUpdate);
            //redirect back
            this.alert(req, {
                toast: false,
                title: "ویرایش شد!",
                message: "دوره با موفقیت ویرایش شد",
                icon: "success",
            })
            res.redirect('/admin/course')
        } catch (e) {
            next(e);
        }


    }

    async CheckingNewImageUploaded(req, ObjForUpdate) {
        if (req.file) {
            ObjForUpdate.images = this.ResizeImage(req)
            ObjForUpdate.thumb = ObjForUpdate.images[480];
            let course = await Course.findById(req.params.id)
            Object.values(course.images).forEach(image => fs.unlinkSync('./public' + image));
        }
    }

    async updatingCourse(req, ObjForUpdate) {
        delete req.body.images
        ObjForUpdate.slug = this.slug(req.body.title)
        await Course.findByIdAndUpdate(req.params.id, {$set: {...req.body, ...ObjForUpdate}})
    }


    async destroy(req, res, next) {
        try {
            let course = await Course.findById(req.body.course_id).populate('episodes').exec();

            if (!course) {
                return res.json('دوره یافت نشده!');
            }

            //  delete episodes of course
            course.episodes.forEach(episode => episode.remove());
            //  delete pictures of course
            Object.values(course.images).forEach(image => fs.unlinkSync('./public' + image)
            )
            //  delete course
            await course.remove();
            this.alert(req, {
                toast: true,
                title: "دوره مورد نظر با موفقیت حذف شد",
                icon: "success"
            })
            res.redirect('/admin/course')
        } catch (e) {
            res.statusCode = 500
            throw new Error(e);
            next(e);
        }
    }

}

module.exports = new courseController();