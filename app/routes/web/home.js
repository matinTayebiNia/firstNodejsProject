const express = require('express');
const routes = express.Router();

//controllers
const {logout} = require('app/http/controllers/Auth/loginController');
const homeController = require('app/http/controllers/homeController');
const CourseController = require('app/http/controllers/courses/CourseController');
const episodeController = require('app/http/controllers/episode/episodeController');
const UserController = require('app/http/controllers/UserController');
const verifyEmailController = require('app/http/controllers/Auth/verifyEmailController');
//middleware
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const activeUser = require('app/http/middleware/activeUser');

//validators
const CommentRequest = require('app/http/Requests/commentRequest');


//web routes
routes.get('/', homeController.index);
routes.get('/abouteUs', homeController.abouteUs);
routes.get('/episodes', homeController.episodes);
routes.get('/logout', logout)
routes.get('/courses/:slug', CourseController.index)
routes.post('/comment', redirectIfNotAuthenticated.handel, CommentRequest.handel(), homeController.comment)
routes.get('/episode/:id', CourseController.download)
routes.get('/courses/:slug/episode/:number', episodeController.index)

routes.post('/course/payment', redirectIfNotAuthenticated.handel, CourseController.payment)
routes.post('/course/payment/back', redirectIfNotAuthenticated.handel, CourseController.checking)

routes.get('/user/panel', redirectIfNotAuthenticated.handel, activeUser.handel, UserController.index);
routes.get('/user/panel/history', redirectIfNotAuthenticated.handel, activeUser.handel, UserController.history);

routes.get('/user/panel/vip', redirectIfNotAuthenticated.handel, activeUser.handel, UserController.loadVipPage);
routes.post('/user/panel/vip/payment', redirectIfNotAuthenticated.handel, activeUser.handel, UserController.buyVip);
routes.post('/user/panel/vip/payment/checking', redirectIfNotAuthenticated.handel, activeUser.handel, UserController.checkingVipIsBuying);

//verifyRoute
routes.get('/user/verify/email',redirectIfNotAuthenticated.handel, verifyEmailController.showVerifyFormEmail)
routes.post('/user/verify/resend',redirectIfNotAuthenticated.handel, verifyEmailController.resendVerifyEmail)
routes.get('/user/verify/:token',redirectIfNotAuthenticated.handel, verifyEmailController.verifyUser)


routes.get('/sitemap.xml', homeController.sitemap)
routes.get("/feed/courses", homeController.feedCourse)
routes.get("/feed/episodes", homeController.feedEpisode)


module.exports = routes;