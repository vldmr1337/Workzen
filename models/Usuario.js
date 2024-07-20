const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type:String
  },
  titulo:{
    type:String,
  },
  bio:{
    type:String,
  },
  isVerified: {
    type:Boolean,
    default:false,
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
