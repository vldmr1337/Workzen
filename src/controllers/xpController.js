const Experiencia = require('../models/Experiencia');

exports.createExperience = async (req, res) => {
  try {
    const { title, company, localizacao, dataInicio, dataTermino, description } = req.body;
    const experiencia = new Experiencia({
      usuario: req.user.id,
      title,
      company,
      localizacao,
      dataInicio,
      dataTermino,
      description
    });
    await experiencia.save();
    res.status(201).json(experiencia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar experiência', error });
  }
};

exports.getExperiences = async (req, res) => {
  try {
    const experiencias = await Experiencia.find({ usuario: req.user.id });
    res.status(200).json(experiencias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter experiências', error });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { title, company, localizacao, dataInicio, dataTermino, description } = req.body;

    const experiencia = await Experiencia.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id }, 
      { title, company, localizacao, dataInicio, dataTermino, description },
      { new: true, runValidators: true } 
    );

    if (!experiencia) {
      return res.status(404).json({ message: 'Experiência não encontrada' });
    }

    res.status(200).json(experiencia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar experiência', error });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const experiencia = await Experiencia.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id
    });

    if (!experiencia) {
      return res.status(404).json({ message: 'Experiência não encontrada' });
    }

    res.status(200).json({ message: 'Experiência deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar experiência', error });
  }
};
