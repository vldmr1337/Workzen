const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado paizão');
  } catch (error) {
    console.error('Ih deu ruim:', error);
    process.exit(1); // Para a aplicação se não conseguir conectar
  }
};

module.exports = connectDB;
