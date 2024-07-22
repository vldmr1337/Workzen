const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/Usuario');
const { handleGoogleLogin } = require('../controllers/authController');

require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://workzen.onrender.com/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await handleGoogleLogin(profile);
        done(null, user); // Chame done com (null, user) em caso de sucesso
      } catch (err) {
        done(err, null); // Chame done com (err, null) em caso de erro
      }
    }
  )
);
// Pode ser usado em futuras atualizações
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// module.exports = passport;
