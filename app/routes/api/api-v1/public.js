const express = require('express');
const routes = express.Router();

//controller
const CourseController = require("app/http/controllers/api/api-v1/CourseController")
const authController = require("app/http/controllers/api/api-v1/authController")
//validator
const loginValidator = require('app/http/Requests/loginRequest')

routes.get("/courses", CourseController.courses);
routes.get("/course/:id", CourseController.single);
routes.get("/course/:id/comment", CourseController.getComment);


routes.post("/login", loginValidator.handel(), authController.login)

module.exports = routes;