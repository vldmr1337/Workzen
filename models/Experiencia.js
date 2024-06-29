const mongoose = require('mongoose');

const ExperienciaSchema = new mongoose.Schema({
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    empresa: String,
    cargo: String,
    periodo: String
  });
  