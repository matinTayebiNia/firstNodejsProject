const controller = require('app/http/controllers/api/controller')
const Course = require('app/models/course')
const Comment = require('app/models/comment')
const passport = require('passport')

class CourseController extends controller {

    async courses(req, res) {
        try {

            const options = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: 1},
                populate: [
                    {path: "categories", select: "name"},
                ]
            };
            let courses = await Course.paginate({}, options)
            return res.status(200).json({
                data: this.filterCoursesData(courses),
                status: "success"
            })

        } catch (e) {
            this.failed(e.message, res);
        }

    }

    async single(req, res) {
        try {
            this.isMongoId(req.params.id, res)
            const course = await
                Course.findByIdAndUpdate(req.params.id, {$inc: {viewCount: 1}})
                    .populate([
                        {
                            path: 'episodes', populate: {path: 'course', select: 'slug'},
                            options: {sort: {number: 1}}
                        },
                        {path: 'user', select: 'name'}])
                    .populate("categories").exec();
            passport.authenticate("jwt", {session: false,}, (err, user, info) => {
                return res.json({
                    data: this.filterSingleCourseData(course, user),
                    status: "success"
                })
            })(req, res)
        } catch (e) {
            this.failed(e.message, res);
        }
    }

    filterSingleCourseData(course, user) {
        console.log(user)
        return {
            author: course.user.name,
            time: course.time,
            title: course.title,
            type: course.type,
            body: course.body,
            price: course.price,
            thumb: course.thumb,
            tags: course.tags,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            categories: course.categories.map(category => {
                return {
                    name: category.name
                }
            }),
            episodes: course.episodes.map(episode => {
                return {
                    time: episode.time,
                    viewCount: episode.viewCount,
                    downloadCount: episode.downloadCount,
                    CommentCount: episode.CommentCount,
                    title: episode.title,
                    type: episode.type,
                    number: episode.number,
                    id: episode.id,
                    createdAt: episode.createdAt,
                    download: episode.download(!!user, user)
                }
            })

        }
    }

    async getComment(req, res) {
        try {
            this.isMongoId(req.params.id)
            const options = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: 1},
                populate: [
                    {
                        path: "user",
                        select: "name"
                    },
                    {
                        path: "parentComment",
                        select: "comment user createdAt",
                        match: {approved: true},
                        populate: {path: 'user', select: "name"}
                    }]
            };
            const comment = await Comment.paginate({
                course: req.params.id, parent: null, approved: true
            }, options)

            return res.status(200).json({
                data: comment,
                status: "success"
            })

        } catch (e) {
            this.failed(e.message, res)
        }
    }

    filterCoursesData(courses) {
        return {
            ...courses,
            docs: courses.docs.map(course => {
                return {
                    id: course.id,
                    time: course.time,
                    viewCount: course.viewCount,
                    commentCount: course.CommentCount,
                    title: course.title,
                    type: course.type,
                    body: course.body,
                    price: course.price,
                    thumb: course.thumb,
                    tags: course.tags,
                    categories: course.categories.map(category => {
                        return {
                            name: category.name
                        }
                    })
                }
            })
        }
    }
}

module.exports = new CourseController();