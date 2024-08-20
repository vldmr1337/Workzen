const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');

exports.handleGoogleLogin = async (profile) => {
  const { id, emails, displayName, name, photos } = profile;
  const email = emails[0].value; 

  let user = await Usuario.findOne({ googleId: id });

  if (user) {
    return user;
  }

  user = await Usuario.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = id; 
      await user.save(); 
    }
    return user;
  }

  const company = await Empresa.findOne({ email });
  if (company) {
    throw new Error('Este email já está registrado como uma empresa.');
  }

  const { givenName: firstName, familyName: lastName } = name;

  user = new Usuario({
    firstName,
    lastName,
    email,
    googleId: id,
    image: photos[0].value,
    isVerified: true,
  });

  await user.save();
  return user;
};
