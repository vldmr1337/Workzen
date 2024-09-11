const mongoose = require('mongoose');

const VagaSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  requirements: {
      type: [String],
      validate: [arrayLimit, 'O array de requirements não pode estar vazio'],
  },
  tags: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'O array de tags não pode estar vazio'],
  },
  salario: {
    type: String,
    required: true,
  },
  localizacao: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum:['Open', 'Closed'],
    default: 'Open',
  }
});

function arrayLimit(val) {
  return val.length > 0;
}

VagaSchema.pre('findOneAndDelete', async function(next) {
  try {
    const job = await this.model.findOne(this.getQuery()); // Pega o documento antes de deletar

    if (job) {
      // Remove todas as aplicações associadas à vaga
      await mongoose.model('Application').deleteMany({ job: job._id });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Job', VagaSchema);
