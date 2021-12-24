const controller = require('app/http/controllers/controller')
const Episode = require('app/models/episode')
const Category = require('app/models/category')

class episodeController extends controller {
    async index(req, res, next) {
        const episode = await Episode.findOneAndUpdate({number: req.params.number},
            {$inc: {viewCount: 1}}).populate([
            {
                path: "course",
                select: "episodes thumb",
                populate: {path: "episodes", populate: {path: "course", select: "slug"}}
            },
            {
                path: 'comment', select: 'comment user createdAt',
                match: {parent: {$eq: null}, approved: {$eq: true}}
                , populate: [{path: "user", select: "name"},
                    {
                        path: "parentComment",
                        select: "comment user createdAt",
                        match: {approved: true},
                        populate: {path: 'user', select: "name"}
                    }
                ]
            }
        ]).exec();

        const title = episode.title
        const categories = await Category.find({parent: null}).populate(['chileCategory']).exec()

        res.render('home/courses/single-episode', {
            title,
            categories,
            episode,
        })
    }
}


module.exports = new episodeController();