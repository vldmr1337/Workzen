const express = require('express');
const connectDB = require('./config/db');
const app = express();
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const protectedRoutes = require('./routes/userRoutes');
const jobRoute = require('./routes/vagasRoutes');
const mailRoutes = require('./routes/mailRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const companyRoutes = require('./routes/companyRoutes');
const passport = require('passport'); 
require('./config/passport'); 


require('dotenv').config();
app.use(cors());
connectDB();
app.use(passport.initialize());
app.use(express.json());

app.use('/v1/', loginRoute);
app.use('/v1/', registerRoute);
app.use('/v1/', companyRoutes);
app.use('/v1/', protectedRoutes);
app.use('/v1/jobs', jobRoute);
app.use('/v1/mail', mailRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/notify', notificationRoutes);
app.use('/v1/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API online',
    version: '1.0.0', // Substitua pela versão correta da sua API
    environment: 'test',
    uptime: process.uptime(), // Tempo de atividade do servidor em segundos
  });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;
