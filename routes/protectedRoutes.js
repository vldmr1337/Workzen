
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

router.get('/me', authenticate, userController.getProfile);

module.exports = router;


