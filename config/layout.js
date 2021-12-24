const path = require('path');
const expressLayout = require('express-ejs-layouts')
const express = require('express');

module.exports = {
    public_dir: 'public',
    view_dir: path.resolve('./resources/views'),
    view_engine: 'ejs',
    locales_directory:path.resolve('./resources/lang'),
    setEjsLayout: (app) => {
        app.use(express.static(config.layout.public_dir));
        app.set('view engine', config.layout.view_engine);
        app.set('views', config.layout.view_dir);
        app.use(expressLayout);
        app.set('layout', 'home/master')
        app.set("layout extractScripts", true)
    }
}