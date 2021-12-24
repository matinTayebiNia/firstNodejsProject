const express = require('express');
const routes = express.Router();
//middleware
const existTokenResetPassword = require('app/http/middleware/existTokenResetPassword');
//controllers
const googleAuthController = require('app/http/controllers/Auth/googleAuthController')
const loginController = require('app/http/controllers/Auth/loginController');
const registerController = require('app/http/controllers/Auth/registerController');
const forgetPasswordController = require('app/http/controllers/Auth/forgetPasswordController')
const resetPasswordController = require('app/http/controllers/Auth/resetPasswordController')
//Requests
const forgetRequest = require('app/http/Requests/forgetRequest')
const registerRequest = require('app/http/Requests/registerRequest');
const loginRegister = require('app/http/Requests/loginRequest')
const resetRequest = require('app/http/Requests/resetRequest')
//auth routes
//login
routes.get('/login', loginController.showLoginForm);
routes.post('/login', loginRegister.handel(), loginController.loginProccess);
//register
routes.get('/register', registerController.showRegisterForm);
routes.post('/register', registerRequest.handel(), registerController.RegisterProccess);
//passwordReset
routes.get('/password/reset', forgetPasswordController.showForgetPassword);
routes.post('/password/email',
    forgetRequest.handel(),
    forgetPasswordController.sendPasswordResetLink)
routes.get('/password/reset/:token', existTokenResetPassword.handel,
    resetPasswordController.showRestPassword)
routes.post('/password/reset',
    resetRequest.handel(),
    resetPasswordController.PasswordResetProcess)
//googleAuth
routes.get('/google', googleAuthController.googleAuth);
routes.get('/google/callback', googleAuthController.callbackGoogleAuth);
module.exports = routes;
