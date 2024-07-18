const transporter = require('../config/mail');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const verificationLink = `http://tcc-react-three.vercel.app/verificar-email/${token}`;

    await transporter.sendMail({
      from: `Workzen <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.REPLYTO_EMAIL,
      subject: 'Verificação de email',
      html: `<p>Clique <a href="${verificationLink}">aqui</a> pra verificar seu email.</p>`,
    });

    res.status(200).json({ message: 'Email de verificação enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar email de verificação', error });
  }
};

exports.sendPasswordRecoveryEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const recoveryLink = `http://tcc-react-three.vercel.app/recuperar-senha/${token}`;

    await transporter.sendMail({
      from: `Workzen <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.REPLYTO_EMAIL,
      subject: 'Recuperação de senha',
      html: `<p>Clique <a href="${recoveryLink}">aqui</a> pra resetar sua senha.</p>`,
    });

    res.status(200).json({ message: 'Email de recuperação de senha enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar email de recuperação de senha', error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token é obrigatório' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Usuário já verificado' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verificado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao verificar email', error });
  }
};


exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Usuario.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();
  
      res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao redefinir a senha', error });
    }
  };