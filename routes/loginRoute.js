// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.post('/', loginController.login);
module.exports = router;
