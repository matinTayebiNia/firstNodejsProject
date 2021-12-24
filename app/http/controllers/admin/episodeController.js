const controller = require('app/http/controllers/controller')
const Course = require('app/models/course')
const Episode = require('app/models/episode')


class episodeController extends controller {

    async index(req, res, next) {

        try {
            const title = 'ویدیو ها';
            let query = {}
            const options = {
                populate: [{path: "course", select: "slug"}],
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: 1},
            };
            let episodes = await Episode.paginate(query, options).then({});
            res.render('admin/episodes/index', {
                title,
                episodes
            })
        } catch (e) {
            next(e)
        }
    }


    async create(req, res, next) {
        let courses = await Course.find({});
        const title = 'افزودن ویدیو جدید';
        res.render('admin/episodes/create', {
            title,
            courses
        })
    }

    async store(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) {
                return this.back(req, res)
            }
            let newEpisode = Episode({
                ...req.body
            })
            await newEpisode.save();
            if (newEpisode) {
                await this.setTimeCourse(newEpisode.course)
                this.alert(req, {
                    toast: false,
                    title: "ثبت شد!",
                    message: "ویدیو مورد نظر  با موفقیت ثبت شد",
                    icon: "success",
                })
                res.redirect('/admin/episode')
            }
        } catch (e) {
            res.statusCode = 500
            throw new Error(e);
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const title = "ویرایش ویدیو"
            const episode = await Episode.findById(req.params.id);
            if (!episode) this.error('چنین ویدیو ایی وجود ندارد', 404);
            const courses = await Course.find({});
            res.render('admin/episodes/update', {
                title,
                episode,
                courses
            })
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) return this.back(req, res)

            let update = await Episode.findByIdAndUpdate(req.params.id, {$set: {...req.body}})

            //prev time course update
            await this.setTimeCourse(update.course)
            // new time course update
            await this.setTimeCourse(req.body.course)
            this.alert(req, {
                toast: false,
                title: "ویرایش شد!",
                message: "ویدیو مورد نظر  با موفقیت ویرایش شد",
                icon: "success",
            })
            res.redirect('/admin/episode')


        } catch (error) {
            next(error);
        }
    }

    async destroy(req, res, next) {
        try {
            let episode = await Episode.findById(req.body.episode_id)
            if (!episode) this.error('چنین ویدیو ای وجود ندارد.')
            let courseID = episode.course;

            episode.remove()

            //update course Time
            await this.setTimeCourse(courseID)
            this.alert(req, {
                toast: true,
                title: "ویدیو مورد نظر  با موفقیت حذف شد",
                icon: "success",
            })
            res.redirect('/admin/episode')

        } catch (e) {
            next(e)
        }
    }

    async setTimeCourse(courseID) {
        let course = await Course.findById(courseID).populate('episodes').exec();
        course.set({time: this.getTime(course.episodes)})
        await course.save();
    }
}


module.exports = new episodeController();