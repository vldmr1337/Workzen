const Empresa = require("../models/Empresa");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const cnpj = require("@fnando/cnpj");
const cloudinary = require('../config/cloudinary');

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
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    // Verifica se o CNPJ é válido
    if (!cnpj.isValid(cnpjValue)) {
      return res.status(400).json({ message: "CNPJ inválido." });
    }

    // Verifica se o e-mail já está registrado
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email já está em uso por um usuário." });
    }
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
    const empresa = await Empresa.findById(req.user.id);
    let imageUrl = empresa.image || ''; // URL da imagem existente ou uma string vazia

    if (req.file) {
      // Faz upload da imagem para o Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'empresas' // Altere para o nome da pasta desejada no Cloudinary
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
    }

    const updateData = {
      email,
      cnpj,
      ramo_atividade,
      nome,
      image: imageUrl // Corrigido para usar a URL do Cloudinary
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const empresaAtualizada = await Empresa.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Remove a senha da resposta

    if (!empresaAtualizada) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.status(200).json(empresaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};