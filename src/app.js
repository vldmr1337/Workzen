const express = require('express');
const connectDB = require('./config/db');
const app = express();
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const protectedRoutes = require('./routes/protectedRoutes');
const jobRoute = require('./routes/vagasRoutes');
const mailRoutes = require('./routes/mailRoutes');
const authRotes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');
const passport = require('passport'); // Certifique-se de que o Passport está sendo importado
require('./config/passport'); // Certifique-se de que a configuração do Passport é carregada


require('dotenv').config();
app.use(cors());

connectDB();
app.use(passport.initialize());
app.use(express.json());

app.use('/v1/', loginRoute);
app.use('/v1/', registerRoute);
app.use('/v1/', protectedRoutes);
app.use('/v1/jobs', jobRoute);
app.use('/v1/mail', mailRoutes);
app.use('/v1/auth', authRotes);
app.use('/v1/notify', notificationRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'API online' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;
