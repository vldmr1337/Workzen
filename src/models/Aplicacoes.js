const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Aguardando resultado', 'Aceitado', 'Rejeitado'],
    default: 'Aguardando resultado'
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);
