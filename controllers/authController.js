const User = require('../models/Usuario');

exports.handleGoogleLogin = async (profile) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image: profile.photos[0].value,
      isVerified: true,
    });

    await user.save();
  }

  return user;
};
