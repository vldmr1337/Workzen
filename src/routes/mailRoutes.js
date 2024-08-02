const express = require('express');
const router = express.Router();
const mailControler = require('../controllers/mailController');

router.post('/send/verify', mailControler.sendVerificationEmail);
router.post('/send/reset', mailControler.sendPasswordRecoveryEmail);
router.post('/verify', mailControler.verifyEmail);
router.post('/reset', mailControler.resetPassword);

module.exports = router;
