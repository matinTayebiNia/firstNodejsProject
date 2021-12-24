const express = require('express');
const routes = express.Router();

//middleware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin')
const setLanguageApp = require('app/http/middleware/SetLanguageApp')

routes.use(setLanguageApp.handel)

routes.get('/lang/:lang', setLanguageApp.findLang)


//adminRoutes
const adminRoute = require('app/routes/web/admin');
routes.use('/admin', redirectIfNotAdmin.handel, adminRoute);

// homeRoutes
const homeRoute = require('app/routes/web/home');
routes.use('/', homeRoute);


// AuthRoutes
const AuthRoute = require('app/routes/web/auth');
routes.use('/auth', redirectIfAuthenticated.handel, AuthRoute);

module.exports = routes;