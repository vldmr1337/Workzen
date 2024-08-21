const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  languages: {
    type: [String],
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
  },
  favoritedJobs: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  isAdmin: {
    type:Boolean,
    default:false,
  }, 
  isApproved: {
    type:Boolean,
    default:false,
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
