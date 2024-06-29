const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');
require('dotenv').config(); 
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, localizacao } = req.body;

    if (!nome || !email || !senha || !telefone || !localizacao) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    const usuario = new User({
      nome,
      email,
      senha: hashedSenha,
      telefone,
      localizacao
    });

    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erro ao criar usuário', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erro ao logar', error });
  }
};

