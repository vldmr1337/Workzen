const mongoose = require('mongoose');

const ExperienciaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  localizacao: {
    type: String,
    required: true
  },
  dataInicio: {
    type: Date,
    required: true
  },
  dataTermino: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Experiencia', ExperienciaSchema);
