const express = require('express');
const routes = express.Router();

//middleware
const redirectIfAuthenticated = require('app/http/middleware/api/redirectIfNotAuthenticated');

//api

const forEveryOne = require('./public');
const auth = require('./private')


routes.use(forEveryOne);
routes.use(redirectIfAuthenticated.handel, auth)


module.exports = routes;