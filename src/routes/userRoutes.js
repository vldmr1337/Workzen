const express = require("express");
const router = express.Router();
const xpController = require('../controllers/xpController');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize')
const upload = require('../middlewares/multer');

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, upload.single('image'), userController.updateProfile);
router.delete('/me', authenticate, userController.deleteProfile);
router.post('/me/xp', authenticate, xpController.createExperience);
router.put('/me/xp', authenticate, xpController.updateExperience);
router.delete('/me/xp', authenticate, xpController.deleteExperience);
router.get('/me/xp', authenticate, xpController.getExperiences);
router.get('/me/applications', authenticate, userController.getUserApplications);
// router.get('/get/users/all', authenticate, authorize('empresa'), userController.getAll);
router.get('/me/recommended', authenticate, userController.getRecommendedJobs );


module.exports = router;
