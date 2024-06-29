const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    required: true,
    unique: true
  },
  ramo_atividade: {
    type: String,
    required: true
  },
  localizacao: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
