const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true
  },
  ramo_atividade: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  telefone: {
    type: String,
  },
  review: {
    type: String,
  }
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
