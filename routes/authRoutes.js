const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id, userType: 'usuario' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  const redirectUrl = process.env.CLIENT_REDIRECT_URL;
  res.redirect(`${redirectUrl}?token=${token}`);
});

module.exports = router;
