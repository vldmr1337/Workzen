const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usuario.findOne({ email });

        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: 'Administrador não encontrado ou não autorizado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.viewCompanies = async (req, res) => {
    try {
        const companies = await Empresa.find().lean();
        res.status(200).json({ companies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.viewUsers = async (req, res) => {
    try {
        const users = await Usuario.find().lean();
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.acceptUser = async (req, res) => {
    const { userId, accept } = req.body;
    try {
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario não encontrado' });
        }

        user.isApproved = accept;
        await user.save();

        res.status(200).json({ message: `Usuario ${accept ? 'aprovado' : 'rejeitado'}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

exports.acceptCompany = async (req, res) => {
    const { companyId, accept } = req.body;
    try {
        const company = await Empresa.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        company.isApproved = accept;
        await company.save();

        res.status(200).json({ message: `Empresa ${accept ? 'aprovada' : 'rejeitada'}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
