
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteProfile);

module.exports = router;


