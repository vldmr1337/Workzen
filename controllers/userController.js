const Usuario = require('../models/Usuario');

exports.getProfile = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-password');
        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter dados do usuário' });
      }

};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, password },
      { new: true, runValidators: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { senha, ...usuarioSemSenha } = usuarioAtualizado.toObject();
    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};