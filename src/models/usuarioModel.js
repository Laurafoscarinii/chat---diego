const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nick: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Função para buscar o usuário por nick
const buscarUsuarioPorNick = async (nick) => {
  return await Usuario.findOne({ nick });
};

module.exports = {
  buscarUsuarioPorNick  // Aqui você exporta corretamente
};
