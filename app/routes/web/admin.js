const express = require('express');
const routes = express.Router();
const gate = require('app/Helpers/gate')
//controllers
const adminController = require('app/http/controllers/admin/adminController')
const courseController = require('app/http/controllers/admin/courseController')
const episodeController = require('app/http/controllers/admin/episodeController')
const commentController = require('app/http/controllers/admin/commentController')
const usersController = require('app/http/controllers/admin/usersController')
const categoryController = require('app/http/controllers/admin/categoryController')
const permissionController = require('app/http/controllers/admin/permissionController')
const roleController = require('app/http/controllers/admin/roleController')
const orderController = require('app/http/controllers/admin/orderController')

//Helpers
const upload = require('app/Helpers/uploadImage')

//validation
const courseRequest = require('app/http/Requests/courseRequest')
const episodeRequest = require('app/http/Requests/episodeRequest')
const userRequest = require('app/http/Requests/userRequest');
const registerRequest = require('app/http/Requests/registerRequest');
const categoryRequest = require('app/http/Requests/categoryRequest');
const permissionRequest = require('app/http/Requests/permissionRequest');
const roleRequest = require('app/http/Requests/roleRequest');

//middleware
const convertFileToFiled = require('app/http/middleware/convertFileToFiled')

routes.use((req, res, next) => {
    res.locals.layout = 'admin/master'
    next()
})


routes.get('/', adminController.index);
//course routes
routes.get('/course', gate.can('show-course'), courseController.index);
routes.get('/course/create', gate.can('create-course'), courseController.create)
routes.post('/course/create', gate.can('create-course'), upload.single('images'), convertFileToFiled.handel, courseRequest.handel(), courseController.store)
routes.delete('/course/delete/:id', gate.can('delete-course'), courseController.destroy)
routes.get('/course/:id/edit', gate.can('edit-course'), courseController.edit)
routes.put('/course/update/:id', gate.can('edit-course'),
    upload.single('images'), convertFileToFiled.handel,
    courseRequest.handel(), courseController.update)
//Episode routes
routes.get('/episode', gate.can('show-episode'), episodeController.index);
routes.get('/episode/create', gate.can('create-episode'), episodeController.create)
routes.post('/episode/create', gate.can('create-episode'), episodeRequest.handel(), episodeController.store)
routes.delete('/episode/delete/:id', gate.can('delete-episode'), episodeController.destroy)
routes.get('/episode/:id/edit', gate.can('edit-episode'), episodeController.edit)
routes.put('/episode/update/:id', gate.can('edit-episode'),
    episodeRequest.handel(), episodeController.update)

//Comments routesث
routes.get('/comments', gate.can('show-comments'), commentController.index);
routes.put('/comments/update/:id', gate.can('edit-comments'), commentController.update)
routes.delete('/comments/delete/:id', gate.can('delete-comments'), commentController.destroy)

//permission routes
routes.get('/permission', gate.can('show-permission'), permissionController.index);
routes.get('/permission/create', gate.can('create-permission'), permissionController.create)
routes.post('/permission/create', gate.can('create-permission'), permissionRequest.handel(), permissionController.store)
routes.get('/permission/:id/edit', gate.can('update-permission'), permissionController.edit)
routes.put('/permission/update/:id', gate.can('update-permission'), permissionRequest.handel(), permissionController.update)
routes.delete('/permission/delete/:id', gate.can('destroy-permission'), permissionController.destroy)

//role routes
routes.get('/role', gate.can('show-role'), roleController.index);
routes.get('/role/create', gate.can('create-role'), roleController.create)
routes.post('/role/create', gate.can('create-role'), roleRequest.handel(), roleController.store)
routes.get('/role/:id/edit', gate.can('update-role'), roleController.edit)
routes.put('/role/update/:id', gate.can('update-role'), roleRequest.handel(), roleController.update)
routes.delete('/role/delete/:id', gate.can('destroy-role'), roleController.destroy)

//users routes
routes.get('/users', gate.can('show-user'), usersController.index);
routes.get('/users/create', gate.can('create-user'), usersController.create)
routes.get('/users/:id/addRole', gate.can('addRole-user'), usersController.addRole)
routes.put('/users/:id/storeAddRole', gate.can('addRole-user'), usersController.storeAddRole)
routes.post('/users/create', gate.can('create-user'), registerRequest.handel(), usersController.store)
routes.get('/users/:id/edit', gate.can('update-user'), usersController.edit)
routes.put('/users/update/:id', gate.can('update-user'), userRequest.handel(), usersController.update)
routes.delete('/users/delete/:id', gate.can('delete-user'), usersController.destroy)

//categories route
routes.get('/categories', gate.can('show-categories'), categoryController.index);
routes.get('/categories/create', gate.can('create-categories'), categoryController.create)
routes.post('/categories/create', gate.can('create-categories'), categoryRequest.handel(), categoryController.store)
routes.delete('/categories/delete/:id', gate.can('destroy-categories'), categoryController.destroy)
routes.get('/categories/:id/edit', gate.can('update-categories'), categoryController.edit)
routes.put('/categories/update/:id', gate.can('update-categories'),
    categoryRequest.handel(), categoryController.update)
// orders routes

routes.get('/orders', orderController.index)
routes.delete('/order/delete/:id', orderController.destroy)


routes.post('/upload-image', upload.single('upload'), adminController.uploadImage)

module.exports = routes;