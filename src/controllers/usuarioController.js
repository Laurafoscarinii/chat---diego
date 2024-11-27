const usuarioModel = require('../models/usuarioModel');  // Aqui importa o modelo corretamente
const token = require('../util/token');  // Certifique-se de ter o arquivo de token também

async function verificarCredenciais(nick, senha) {
  // Usando a função de busca de nick do usuarioModel corretamente
  let usuario = await usuarioModel.buscarUsuarioPorNick(nick);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }
  if (usuario.senha !== senha) {
    throw new Error("Senha incorreta");
  }
  return usuario;
}

exports.entrar = async (req, res) => {
  try {
    const { nick, senha } = req.body;
    let usuario = await usuarioModel.buscarUsuarioPorNick(nick);  // Usando corretamente a função
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const tokenGerado = token.gerarToken(usuario._id, usuario.nick);  // Gerando o token
    res.status(200).json({
      message: "Usuário autenticado com sucesso",
      token: tokenGerado,
      idUser: usuario._id,
      nick: usuario.nick
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.registrar = async (req, res) => {
  try {
    const { nick, senha } = req.body;

    if (!nick || !senha) {
      return res.status(400).json({ error: 'Nick e senha são obrigatórios.' });
    }

    const usuarioExistente = await usuarioModel.buscarUsuarioPorNick(nick);  // Usando corretamente a função
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    // Cria o novo usuário
    const novoUsuario = new usuarioModel({ nick, senha });
    await novoUsuario.save();

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      usuario: novoUsuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
