const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua-chave-secreta';  // Chave secreta, deve ser mantida em segredo e idealmente armazenada em variáveis de ambiente.

const gerarToken = (idUser, nick) => {
    const payload = {
        idUser: idUser,
        nick: nick
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });  // O token vai expirar em 1 hora.
};

const verificarToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token inválido'));
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    gerarToken,
    verificarToken
};
