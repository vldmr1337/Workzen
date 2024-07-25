const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Usuario");
const Empresa = require('../models/Empresa');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
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
      const existingCompany = await Empresa.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Email já está em uso por uma empresa.' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'E-mail já registrado.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let imagemBase64 = '';
      if (req.file) {
        // Adiciona o prefixo data:image/png;base64, ao base64
        imagemBase64 = `data:image/png;base64,${req.file.buffer.toString('base64')}`;
      }

      const usuario = new User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        image: imagemBase64,
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
