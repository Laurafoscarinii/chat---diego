const salaModel = require("../models/salaModel");
const usuarioModel = require('../models/usuarioModel');
const { ObjectId } = require("mongodb");

exports.entrar = async (iduser, idsala) => {
  try {
    // Verificação de IDs válidos
    if (!ObjectId.isValid(iduser) || !ObjectId.isValid(idsala)) {
      throw new Error("ID inválido: Certifique-se de passar IDs válidos.");
    }

    // Converte para ObjectId
    const userIdObj = new ObjectId(iduser);
    const salaIdObj = new ObjectId(idsala);

    // Verifica se a sala existe
    const sala = await salaModel.buscarSala(salaIdObj);
    if (!sala) throw new Error("Sala não encontrada.");

    // Verifica se o usuário existe
    const user = await usuarioModel.buscarUsuario(userIdObj);
    if (!user) throw new Error("Usuário não encontrado.");

    // Atualiza o usuário com a sala
    user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo || "público" };
    const atualizado = await usuarioModel.alterarUsuario(user);

    if (atualizado) return { msg: "OK", timestamp: Date.now() };

    throw new Error("Erro ao atualizar usuário.");
  } catch (error) {
    console.error("Erro ao entrar na sala:", error);
    throw error;
  }
};

exports.sair = async (iduser) => {
  try {
    // Verificação de ID válido
    if (!ObjectId.isValid(iduser)) {
      throw new Error("ID do usuário inválido.");
    }

    // Busca o usuário
    const userIdObj = new ObjectId(iduser);
    let user = await usuarioModel.buscarUsuario(userIdObj);

    if (!user) throw new Error("Usuário não encontrado.");

    // Atualiza o usuário para remover a sala
    user.sala = null;
    const atualizado = await usuarioModel.alterarUsuario(user);
    if (atualizado) {
      return await salaModel.listarSalas();
    }

    throw new Error("Erro ao sair da sala.");
  } catch (error) {
    console.error("Erro ao sair da sala:", error);
    throw error;
  }
};

exports.enviarMensagem = async (nick, msg, idsala) => {
  try {
    // Verificação de ID válido
    if (!ObjectId.isValid(idsala)) {
      throw new Error("ID da sala inválido.");
    }

    // Busca a sala
    const sala = await salaModel.buscarSala(new ObjectId(idsala)); 
    if (!sala) throw new Error("Sala não encontrada.");

    // Adiciona a mensagem
    if (!sala.msgs) {
      sala.msgs = [];
    }

    let timestamp = Date.now();
    sala.msgs.push({ timestamp, msg, nick });

    // Atualiza a sala com a nova mensagem
    const resp = await salaModel.atualizarMensagens(sala);
    if (resp.modifiedCount === 1) {
      return { msg: "Mensagem enviada com sucesso", timestamp };
    }

    throw new Error("Erro ao atualizar mensagens.");
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.message);
    throw new Error(error.message);
  }
};

exports.buscarMensagens = async (idsala) => {
  try {
    // Busca as mensagens da sala
    const mensagens = await salaModel.buscarMensagens(idsala);
    return { msgs: mensagens };
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error.message);
    throw new Error(error.message);
  }
};

exports.criarSala = async (nome, descricao) => {
  try {
    // Validação de dados
    if (!nome || !descricao) {
      throw new Error("Nome e descrição são obrigatórios.");
    }

    // Criação da nova sala
    const novaSala = {
      nome,
      descricao,
      msgs: [],
      participantes: []
    };

    // Cria a sala no banco
    const salaCriada = await salaModel.criar(novaSala);

    if (!salaCriada) {
      throw new Error("Erro ao criar a sala no banco de dados.");
    }

    return salaCriada;
  } catch (error) {
    console.error("Erro ao criar sala:", error.message);
    throw new Error("Erro ao criar sala: " + error.message);
  }
};

exports.listarSalas = async (req, res) => {
  try {
    const salas = await salaModel.listarSalas();
    if (!salas || salas.length === 0) {
      return res.status(404).json({ msg: "Nenhuma sala encontrada" });
    }
    res.status(200).json(salas);
  } catch (error) {
    console.error("Erro ao listar salas:", error.message);
    res.status(500).json({ msg: "Erro ao listar salas", error: error.message });
  }
};
