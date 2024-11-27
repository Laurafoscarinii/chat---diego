const db = require("./db");
const { ObjectId } = require("mongodb");

let buscarSala = async (idsala) => {
  try {
    if (!ObjectId.isValid(idsala)) {
      throw new Error("ID da sala inválido.");
    }
    return await db.findOne("salas", { _id: new ObjectId(idsala) });
  } catch (error) {
    throw new Error("Erro ao buscar sala: " + error.message);
  }
};

let buscarMensagens = async (idsala) => {
  try {
    const sala = await buscarSala(idsala);
    if (sala && sala.msgs) {
      return sala.msgs; // Retorna todas as mensagens da sala
    }
    return [];
  } catch (error) {
    throw new Error("Erro ao buscar mensagens: " + error.message);
  }
};

const atualizarMensagens = async (sala) => {
  try {
    return await db.updateOne(
      "salas",
      { _id: new ObjectId(sala._id) },
      { $set: { msgs: sala.msgs } }
    );
  } catch (error) {
    console.error("Erro ao atualizar mensagens:", error.message);
    throw new Error("Erro ao atualizar mensagens: " + error.message);
  }
};

let listarSalas = async () => {
  try {
    return await db.findAll("salas");
  } catch (error) {
    console.error("Erro ao buscar salas no banco:", error.message);
    throw new Error("Erro ao buscar salas no banco: " + error.message);
  }
};

let criar = async (novaSala) => {
  try {
    const result = await db.insertOne("salas", novaSala);
    if (!result.acknowledged || !result.insertedId) {
      throw new Error("Erro ao criar sala no banco.");
    }
    return { _id: result.insertedId, nome: novaSala.nome, descricao: novaSala.descricao };
  } catch (error) {
    console.error("Erro ao criar sala:", error.message);
    throw new Error("Erro ao criar sala: " + error.message);
  }
};

module.exports = {
  criar,
  listarSalas,
  buscarSala,
  atualizarMensagens,
  buscarMensagens
};
