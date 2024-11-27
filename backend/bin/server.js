const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Para carregar variáveis de ambiente, se necessário
const router = require('../src/routers/api'); // Ajuste o caminho para o local correto




// Carregar variáveis de ambiente
const app = express();


// Middleware
app.use(cors()); 
app.use(express.json()); // Parseia o corpo da requisição como JSON

// Conectar ao MongoDB (se for o caso)
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch((error) => console.log('Erro ao conectar ao MongoDB:', error));

// Usar as rotas
app.use('/', router); // Configura as rotas para serem usadas pelo servidor

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
  });