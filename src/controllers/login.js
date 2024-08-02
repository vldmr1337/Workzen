const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Usuario");
const Empresa = require('../models/Empresa');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');

const secret = process.env.JWT_SECRET;

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
      const existingUser = await User.findOne({ email });
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
      const usuario = new User({
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

    const user = await User.findOne({ email });
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