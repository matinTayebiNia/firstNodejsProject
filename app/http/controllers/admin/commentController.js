const controller = require('app/http/controllers/controller')

const Comment = require('app/models/comment')

class commentController extends controller {
    async index(req, res, next) {

        try {
            const options = {
                page: req.query.page || 1,
                limit: 10,
                sort: {createdAt: -1},
                populate: [{path: 'user', select: "name"}, {
                    path: 'episode',
                    select: 'title number',
                    populate: [{
                        path: 'course',
                        select: 'slug'
                    }]
                }, {path: 'course', select: 'title slug'}]
            };
            let comments;
            if (req.query.approved === 'false')
                comments = await Comment.paginate({approved: false}, options)
            else comments = await Comment.paginate({approved: true}, options)
            let title = "نظرات";
            res.render('admin/comment/index', {
                title,
                comments
            })
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) return this.back(req, res);
            let comment = await Comment.findById(req.params.id).populate('belongTo')
            if (!comment) this.error('کامنت مورد نظر یافت نشد.', 404)
            await comment.belongTo.incr('CommentCount')
            comment.approved = true
            await comment.save();
            this.alert(req, {
                toast: true,
                title: "کامنت مورد نظر  با موفقیت تایید شد",
                icon: "success",
            })
            return res.redirect('/admin/comments')
        } catch (e) {
            next(e)
        }
    }

    async destroy(req, res, next) {
        try {
            this.isMongoId(req.body.comment_id);
            const comment = await Comment.findById(req.body.comment_id).populate('belongTo');
            if (!comment) this.error('چنین نظری وجود ندارد', 404)
            await comment.belongTo.decr('CommentCount')
            await comment.remove();
            this.alert(req, {
                toast: true,
                title: "کامنت مورد نظر  با موفقیت حذف شد",
                icon: "success",
            })
            return res.redirect('/admin/comments')
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new commentController();