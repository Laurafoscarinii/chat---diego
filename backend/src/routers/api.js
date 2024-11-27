const express = require("express");
const cors = require("cors");
const token = require("../util/token.js");
const salaController = require("../controllers/salaController.js");
const usuarioController = require("../controllers/usuarioController.js");
const { ObjectId } = require("mongodb");



const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Garanta que isso está sendo chamado aqui!

const router = express.Router();


// Rota de login (entrar)
router.post("/entrar", async (req, res) => {
  try {
    const resp = await usuarioController.entrar(req, res);
    res.status(200).send(resp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota de registro (registrar)
// Rota de registro de usuário
router.post('/registrar', async (req, res) => {
  try {
    const { nick, senha } = req.body;

    if (!nick || !senha) {
      return res.status(400).json({ error: 'Nick e senha são obrigatórios.' });
    }

    await usuarioController.registrar(req, res); 
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: error.message });
  }
});


// Lista de salas
router.get("/salas", async (req, res) => {
  try {
    const resp = await salaController.get();
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao listar salas", error: error.message });
  }
});

router.get("/sala/mensagens", async (req, res) => {
  try {
    const idSala = req.query.idSala;
    if (!idSala) {
      // Se não passar ID, podemos buscar todas as salas
      const salas = await salaController.buscarMensagens();
      return res.status(200).json(salas);
    }

    const resp = await salaController.buscarMensagens(idSala);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar mensagens", error: error.message });
  }
});


router.put("/sala/sair", async (req, res) => {
  try {
    const resp = await salaController.sair(req.headers.iduser);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao sair da sala", error: error.message });
  }
});

router.post("/sair-user", async (req, res) => {
  try {
    const resp = await salaController.sairUser(req.query.idUser);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao sair usuário", error: error.message });
  }
});



// Rota para criar uma sala sem verificação de token
router.post("/salas/criar", async (req, res) => {
  try {
    // Extrair dados de sala
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
      return res.status(400).json({ msg: "Nome e descrição são obrigatórios" });
    }

    // Chama o controller para criar a sala
    const salaCriada = await salaController.criarSala(nome, descricao);
    res.status(201).json(salaCriada); // Retorna a sala criada
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    res.status(500).json({ msg: "Erro ao criar sala", error: error.message });
  }
});




// Rota para listar salas
router.get("/salas", async (req, res) => {
  try {
    const resp = await salaController.get();
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao listar salas", error: error.message });
  }
});


router.get("/salas", salaController.listarSalas);


router.post('/sala/entrar', (req, res) => {
  const { iduser, idsala } = req.body;

  // Adicione a lógica para processar o ingresso na sala
  // Aqui, você pode procurar a sala no banco de dados e adicionar o usuário a ela

  if (!iduser || !idsala) {
    return res.status(400).json({ error: 'ID do usuário e ID da sala são necessários' });
  }

  // Suponha que você tenha um modelo Sala e Usuário para realizar essa operação
  // Exemplo de resposta
  return res.status(200).json({ message: 'Usuário entrou na sala com sucesso!' });
});



// Enviar mensagem
router.post("/sala/mensagem", async (req, res) => {
  try {
    // Remover a verificação de token, pois agora o token não é mais necessário
    const resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao enviar mensagem", error: error.message });
  }
});



app.use("/", router);

module.exports = app;
