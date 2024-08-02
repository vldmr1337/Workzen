const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');

exports.getProfile = async (req, res) => {
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
    res.status(200).json({ message: `Usuário ${req.user.id} deletado com sucesso` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, titulo, bio } = req.body;
    const user = await Usuario.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    let imageUrl = user.image || ''; // Usa a imagem existente ou uma string vazia

    if (req.file) {
      // Faz upload da imagem para o Cloudinary
      try {
        imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'usuarios'
            },
            (error, result) => {
              if (error) {
                reject(new Error('Erro ao fazer upload da imagem'));
              } else {
                resolve(result.secure_url); // URL segura da imagem
              }
            }
          );
          stream.end(req.file.buffer); // Passa o buffer da imagem para o stream
        });
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return res.status(500).json({ message: 'Erro ao fazer upload da imagem', error });
      }
    }

    const updateData = {
      firstName,
      lastName,
      email,
      image: imageUrl, // Corrigido para usar a URL do Cloudinary
      titulo,
      bio
    };

    if (user.googleId) {
      // Apenas retorna um erro se o usuário estiver vinculado ao Google
      return res.status(400).json({ message: 'Não é possível atualizar o perfil para usuários vinculados ao Google' });
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
