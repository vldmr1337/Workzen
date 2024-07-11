const express = require('express');
const connectDB = require('./config/db');
const app = express();
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const protectedRoutes = require('./routes/protectedRoutes');
const jobRoute = require('./routes/vagasRoutes')
const cors = require('cors');

require('dotenv').config();
app.use(cors());

connectDB();

app.use(express.json());

app.use('/v1/', loginRoute);
app.use('/v1/', registerRoute);
app.use('/v1/', protectedRoutes);
app.use('/v1/jobs', jobRoute);

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
