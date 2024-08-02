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


