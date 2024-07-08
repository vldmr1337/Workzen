const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secret = process.env.JWT_SECRET;

exports.login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const empresa = await Empresa.findOne({email});
        if(!empresa){
        return res.status(400).json({message: 'Credenciais inválidas.'});
    } 
    const isMatch = await bcrypt.compare(password, empresa.password);
    if(!isMatch){
        return res.status(400).json({message: 'Credenciais inválidas.'});}
        const token = jwt.sign({ id: empresa._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
    

    
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao logar', error });
      }
    
};

exports.register = async (req, res) =>{

};