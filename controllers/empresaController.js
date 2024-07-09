const Empresa = require("../models/Empresa");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

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
    const token = jwt.sign({ id: empresa._id }, secret, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao logar", error });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, cnpj, ramo_atividade, nome } = req.body;
    if (!email || !password || !cnpj || !ramo_atividade || !nome) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const existingEmpresa = await Empresa.findOne({ email });
    if (existingEmpresa) {
      return res.status(400).json({ message: "E-mail já registrado." });
    }

    const existingCNPJ = await Empresa.findOne({ cnpj });
    if (existingCNPJ) {
      return res.status(400).json({ message: "CNPJ já registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const empresa = new Empresa({
      email,
      password: hashedPassword,
      cnpj,
      ramo_atividade,
      nome,
    });

    await empresa.save();
    const token = jwt.sign({ id: empresa._id }, secret, { expiresIn: "1h" });

    res.status(201).json({ empresa, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
};
