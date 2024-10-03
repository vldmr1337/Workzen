const mongoose = require("mongoose");

const entrevistaSchema = new mongoose.Schema(
  {
    candidato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    vaga: { type: mongoose.Schema.Types.ObjectId, ref: "Vaga", required: true },
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
    },
    dataHora: { type: Date, required: true },
    linkEntrevista: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pendente", "Concluída", "Cancelada"],
      default: "Pendente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entrevista", entrevistaSchema);
