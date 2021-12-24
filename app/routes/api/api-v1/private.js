const express = require('express');
const routes = express.Router();

const panelController = require('app/http/controllers/api/api-v1/panelController')

routes.get("/user", panelController.user)
routes.get("/user/history", panelController.history)


module.exports = routes;