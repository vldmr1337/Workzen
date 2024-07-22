const Empresa = require("../models/Empresa");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const cnpj = require('@fnando/cnpj');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const empresa = await Empresa.findOne({ email });
    if (!empresa) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }
    const isMatch = await bcrypt.compare(password, empresa.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }
    const token = jwt.sign({ id: empresa._id, userType: "empresa" }, secret, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao logar", error });
  }
};


exports.register = async (req, res) => {
  try {
    const { email, password, cnpj: cnpjValue, ramo_atividade, nome } = req.body;

    if (!email || !password || !cnpjValue || !ramo_atividade || !nome) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verifica se o CNPJ é válido
    if (!cnpj.isValid(cnpjValue)) {
      return res.status(400).json({ message: 'CNPJ inválido.' });
    }

    // Verifica se o e-mail já está registrado
    const existingEmpresa = await Empresa.findOne({ email });
    if (existingEmpresa) {
      return res.status(400).json({ message: "E-mail já registrado." });
    }

    // Verifica se o CNPJ já está registrado
    const existingCNPJ = await Empresa.findOne({ cnpj: cnpjValue });
    if (existingCNPJ) {
      return res.status(400).json({ message: "CNPJ já registrado." });
    }

    // Cria o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria a nova empresa
    const empresa = new Empresa({
      email,
      password: hashedPassword,
      cnpj: cnpjValue,
      ramo_atividade,
      nome,
    });

    // Salva a empresa no banco de dados
    await empresa.save();

    // Gera o token JWT
    const token = jwt.sign({ id: empresa._id, userType: "empresa" }, secret, {
      expiresIn: "1h",
    });

    // Responde com a empresa criada e o token
    res.status(201).json({ empresa, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.user.id).select("-password");
    if (!empresa) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }
    res.status(200).json(empresa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter dados da empresa" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, password, cnpj, ramo_atividade, nome } = req.body;
    const updateData = { email, cnpj, ramo_atividade, nome };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const empresaAtualizada = await Empresa.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!empresaAtualizada) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    res.status(200).json(empresaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar perfil", error });
  }
};
