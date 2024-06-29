const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
 
  localizacao: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false 
  },
  verificationToken: String 
});
module.exports = mongoose.model('Usuario', UsuarioSchema);
