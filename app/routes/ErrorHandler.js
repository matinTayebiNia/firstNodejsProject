const express = require('express');
const routes = express.Router();


routes.use((req, res, next) => {
    res.locals.layout = 'errors/master'
    next()
})


routes.all('*', async (req, res, next) => {
    try {
        res.statusCode = 404;
        throw new Error('صفحه مورد نظر یافت نشد')
    } catch (e) {
        next(e);
    }
})

routes.use((err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || '';
    const stack = err.stack || '';
    if (config.debug) return res.render('errors/stack', {stack, message})
    return res.render(`errors/${statusCode}`, {message})
})

module.exports = routes;