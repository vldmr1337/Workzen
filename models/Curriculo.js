const mongoose = require('mongoose');

const ExperienciaSchema = new mongoose.Schema({
  empresa: String,
  cargo: String,
  periodo: String
});

const CurriculoSchema = new mongoose.Schema({
  area_atuacao: String,
  experiencia: [ExperienciaSchema],
  competencias: [String],
  empresas_trabalhou: [String],
  cargo_que_busca: String,
  interesse: String,
  sobre_mim: String,
  publicacoes: [String],
  idiomas: [String],
});

module.exports = mongoose.model('Curriculo', CurriculoSchema);
