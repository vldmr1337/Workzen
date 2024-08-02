const express = require("express");
const router = express.Router();
const xpController = require('../controllers/xpController');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/multer');

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, upload.single('image'), userController.updateProfile);
router.delete('/me', authenticate, userController.deleteProfile);
router.post('/me/xp', authenticate, xpController.createExperience);
router.get('/me/xp', authenticate, xpController.getExperiences);


module.exports = router;
