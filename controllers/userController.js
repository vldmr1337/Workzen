const Usuario = require('../models/Usuario');

exports.getProfile = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-senha');
        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter dados do usuário' });
      }

};