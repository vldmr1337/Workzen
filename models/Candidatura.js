const mongoose = require('mongoose');

const CandidaturaSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  id_vaga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaga',
    required: true
  },
  id_curriculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculo',
    required: true
  },
  data_candidatura: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Em Análise'
  }
});

module.exports = mongoose.model('Candidatura', CandidaturaSchema);
