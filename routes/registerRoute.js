const express = require('express');
const router = express.Router();
const register = require('./../controllers/login')
const upload = require('../middlewares/multer');


router.post('/', upload.single('image'), register.register);

module.exports =  router;