const express = require('express');
const router = express.Router();
const register = require('./../controllers/login')

router.post('/', register.register);

module.exports =  router;