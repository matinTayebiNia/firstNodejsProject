const Controller = require('app/http/controllers/controller')
const Course = require('app/models/course');
const Comment = require('app/models/comment');
const Category = require('app/models/category');
const Episode = require('app/models/episode')
const SM = require('sitemap')
const {Readable} = require('stream')
const stripTag = require('striptags')
const RSS = require('rss')

class homeController extends Controller {
    async index(req, res) {
        res.render('home/index');
    }


    abouteUs(req, res) {
        const title = 'درباره ما';

        res.render('home/abouteus', {
            title
        });
    }

    async episodes(req, res) {
        let {search, category, type} = req.query;
        let query = {};

        if (search) {
            query.title = new RegExp(req.query.search, 'gi');
        }
        if (category && category !== 'all') {
            category = await Category.findOne({slug: category})
            if (category) {
                query.categories = {$in: [category.id]}
            }
        }
        if (type && type !== 'all')
            query.type = type

        const title = 'دوره ها';
        let courses = Course.find({...query}).sort({createdAt: 1}).limit(8);
        if (req.query.order)
            courses.sort({createdAt: -1});

        courses = await courses.exec();
        let categories = await Category.find({})
        res.render('home/episodes', {
            title,
            categories,
            courses
        });
    }

    async comment(req, res, next) {
        try {
            let status = await this.ValidationData(req)
            if (!status) return this.back(req, res);
            let newComment = new Comment({
                user: req.user.id,
                ...req.body,
            })
            req.body = {}
            await newComment.save();
            return this.back(req, res);
        } catch (error) {
            next(error);
        }
    }

    async sitemap(req, res, next) {
        try {
            let links = [
                {url: '/', changefreq: 'daily', priority: 1},
                {url: '/episodes', changefreq: 'monthly', priority: 1},

            ]
            const courses = await Course.find({}).sort({createdAt: -1}).populate(
                {path: 'episodes', select: "number"}).exec();
            courses.forEach(course => {
                let courseUrl = {
                    url: course.path(),
                    changefreq: 'weekly',
                    priority: 0.8
                }
                links.push(courseUrl)
                course.episodes.map(episode => {
                    let episodeUrl = {
                        url: `${course.path()}/episode/${episode.number}`,
                        changefreq: 'weekly',
                        priority: 0.8
                    }
                    links.push(episodeUrl)
                })

            })


            // Create a stream to write to
            const stream = new SM.SitemapStream({hostname: config.AppUrl})

            res.header("Content-Type", "text/xml")
            // Return a promise that resolves with your XML string
            const dataXml = SM.streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
                data.toString()
            )

            dataXml.then(result => {
                res.send(result)
            })


        } catch (e) {
            next(e)
        }
    }

    async feedCourse(req, res, next) {
        try {

            let feed = new RSS({
                title: "فید خوان دوره های راکت",
                description: "جدید دوره ها را از طریق rss بخوانید",
                feed_url: `${config.AppUrl}/feed/courses`,
                site_url: config.AppUrl
            });

            const courses = await Course.find({}).sort({createdAt: -1}).populate(
                {path: 'user', select: "name"}).exec();
            courses.forEach(course => {
                feed.item({
                    title: course.title,
                    description: stripTag(course.body.substr(0, 200)),
                    date: course.createdAt,
                    url: config.AppUrl + course.path(),
                    author: course.user.name,

                })
            })


            res.header('Content-Type', "text/xml");
            res.send(feed.xml())
        } catch (e) {
            next(e)
        }
    }

    async feedEpisode(req, res, next) {
        try {

            let feed = new RSS({
                title: "فید خوان دوره های راکت",
                description: "جدید دوره ها را از طریق rss بخوانید",
                feed_url: `${config.AppUrl}/feed/courses`,
                site_url: config.AppUrl
            });

            const episodes = await Episode.find({}).populate([
                {path: "course", select: "user slug", populate: {path: "user", select: "name"}}
            ]).sort({createdAt: -1}).exec();
            episodes.forEach(episode => {
                feed.item({
                    title: episode.title,
                    description: stripTag(episode.body.substr(0, 200)),
                    date: episode.createdAt,
                    url: config.AppUrl + episode.path(),
                    author: episode.course.user.name,

                })
            })


            res.header('Content-Type', "text/xml");
            res.send(feed.xml())
        } catch (e) {
            next(e)
        }
    }
}

module
    .exports = new homeController();
