const express = require('express');
const passport = require('passport'); // Importar o Passport corretamente
const router = express.Router();
const jwt = require('jsonwebtoken');

// Rota para autenticação com Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback do Google
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Aqui você pode gerar um token JWT e enviá-lo ao cliente
  const token = jwt.sign({ id: req.user._id, userType: 'usuario' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
  res.redirect(`https://tcc-react-three.vercel.app/magic?token=${token}`);
});


module.exports = router;
