const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

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
exports.deleteProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: `Usuário ${req.user.id } deletado com sucesso` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, titulo, bio } = req.body;
    let imagemBase64;
    const user = await Usuario.findById(req.user.id);
    if (req.file) {
      // Adiciona o prefixo data:image/png;base64, ao base64
      imagemBase64 = `data:image/png;base64,${req.file.buffer.toString('base64')}`;
    } else {
      
      imagemBase64 = user.image || ''; // Usa a imagem existente ou uma string vazia
    }

    const updateData = {
      firstName,
      lastName,
      email,
      image: imagemBase64,
      titulo,
      bio
    };
    if (user.googleId && email) {
      // Apenas atualiza o email se o usuário não estiver vinculado ao Google
      return res.status(400).json({message: 'Já tem login com google.'});
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { password: senha, ...usuarioSemSenha } = usuarioAtualizado.toObject();
    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};