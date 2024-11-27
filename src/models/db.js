const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

let singleton;

async function connect() {
  if (singleton) return singleton;

  const client = new MongoClient(process.env.DB_HOST);

  try {
    await client.connect();
    singleton = client.db(process.env.DB_DATABASE);
    return singleton;
  } catch (error) {
    console.error("Erro de conexão com o MongoDB:", error);
    throw new Error("Erro ao conectar ao banco de dados: " + error.message);
  }
}



const findAll = async (collectionName) => {
    try {
      const database = client.db(process.env.DB_NAME); // Nome do banco de dados
      const collection = database.collection(collectionName);
      return await collection.find({}).toArray();
    } catch (error) {
      console.error(`Erro ao buscar todos os documentos em ${collectionName}:`, error.message);
      throw error;
    }
  };

async function insertOne(collection, objeto) {
  const db = await connect();
  return db.collection(collection).insertOne(objeto);
}

let findOne = async (collection, _id) => {
  const db = await connect();
  let obj = await db.collection(collection).find({ '_id': new ObjectId(_id) }).toArray();
  return obj ? obj[0] : false;
}

let updateOne = async (collection, object, param) => {
  const db = await connect();
  return await db.collection(collection).updateOne({ "_id": new ObjectId(param) }, { $set: object });
}



  

module.exports = { findAll, insertOne, findOne, updateOne };
