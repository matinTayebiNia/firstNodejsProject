const express = require('express');
const routes = express.Router();
const rateLimit = require("express-rate-limit")
const cors = require("cors")

routes.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept");

    next();
})

const apiVersion1 = require('./api-v1')

const apiLimiter = new rateLimit({
    ...config.apiLimiter
})

routes.use('/api/v1',cors(config.cors.corsOption), apiLimiter,apiVersion1)


module.exports = routes;