const mongoose = require('mongoose');

const VagaSchema = new mongoose.Schema({
  local: {
    type: String,
    required: true
  },
  periodo: String,
  tipo: String,
  cargo: {
    type: String,
    required: true
  },
  descricao: String,
  remuneracao: Number,
  requisitos: [String],
  data_publicacao: {
    type: Date,
    default: Date.now
  },
  prazo_candidatura: Date,
  estado_vaga: String,
  cnpj_empresa: {
    type: String,
    required: true
  },
  id_empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  }
});

module.exports = mongoose.model('Vaga', VagaSchema);
