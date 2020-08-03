const express = require('express');
const routes = express.Router();
const authorization = require('./middlewares/authorization');
const userController = require('./controllers/userController');

routes.get('/users', authorization, userController.index);
routes.post('/users', userController.create);
routes.post('/users/login', userController.login);

module.exports = routes;