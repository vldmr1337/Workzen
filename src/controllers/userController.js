const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const Empresa = require('../models/Empresa');
const Application = require('../models/Aplicacoes');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { body, validationResult } = require('express-validator');

const secret = process.env.JWT_SECRET;

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
    const { firstName, lastName, email, password, titulo, bio, languages, favoritedJobs } = req.body;
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
      bio,
      languages,
      favoritedJobs
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

exports.register = [
  // Validações
  body('firstName').notEmpty().withMessage('O primeiro nome é obrigatório'),
  body('lastName').notEmpty().withMessage('O sobrenome é obrigatório'),
  body('email').isEmail().withMessage('Insira um email válido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, email, password } = req.body;

      // Verificar se o email já está em uso por uma empresa ou usuário
      const existingCompany = await Empresa.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Email já está em uso por uma empresa.' });
      }
      const existingUser = await Usuario.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'E-mail já registrado.' });
      }

      // Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let imageUrl = '';
      if (req.file) {
        try {
          // Faz upload da imagem para o Cloudinary
          const uploadPromise = new Promise((resolve, reject) => {
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

          imageUrl = await uploadPromise; // Aguarda a URL da imagem do Cloudinary
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          return res.status(500).json({ message: 'Erro ao fazer upload da imagem', error });
        }
      }

      // Criar um novo usuário
      const usuario = new Usuario({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        image: imageUrl, // Use a URL da imagem do Cloudinary
      });

      await usuario.save();
      const token = jwt.sign({ id: usuario._id, userType: 'usuario' }, secret, { expiresIn: '1h' });

      res.status(201).json({ usuario, token });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Erro ao criar usuário', error });
    }
  },
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user._id, userType: 'usuario' }, secret, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao logar", error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await Usuario.find({}).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ user: userId })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'nome ramo_atividade'
        },
        select: 'title description' 
      });

    if (!applications.length) {
      return res.status(404).json({ message: 'Nenhuma inscrição encontrada' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Erro ao buscar inscrições do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar inscrições', error });
  }
};

