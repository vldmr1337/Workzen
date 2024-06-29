const mailgun = require('mailgun-js');
const Usuario = require('../models/Usuario');

const DOMAIN = 'sandbox31ded27c260740d081d1d09a47b6a31b.mailgun.org';
const mg = mailgun({ apiKey: '90f719877388eda6f515421801c3e5a8-a4da91cf-4052531a', domain: DOMAIN });

const sendVerificationEmail = async (email, token) => {
    const data = {
        from: `workzen@${DOMAIN}`,
        to: email,
        subject: 'Verificação de e-mail',
        text: `Por favor, clique no link a seguir para verificar seu e-mail: http://localhost:3000/verificar?token=${token}&email=${email}`
    };

    try {
        mg.messages().send(data, function (error, body) {
            if (error) {
                console.error('Erro ao enviar e-mail de verificação:', error);
            } else {
                console.log('E-mail de verificação enviado para:', email);
            }
        });
    } catch (error) {
        console.error('Erro ao enviar e-mail de verificação:', error);
    }
};

const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const verifyEmail = async (req, res, next) => {
    const email = req.query.email;

    const token = generateVerificationToken();
    
    try {
        const usuario = await Usuario.findOneAndUpdate({ email }, { verificationToken: token }, { new: true });
        if (!usuario) {
            return res.status(404).send('Usuário não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao atualizar token de verificação:', err);
        return res.status(500).send('Erro interno do servidor.');
    }

    await sendVerificationEmail(email, token);

    next();
};

module.exports = verifyEmail;
