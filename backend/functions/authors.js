const mongoose = require('mongoose');
const Author = require('../models/Author');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    // Obtener todos los autores
    const authors = await Author.find();
    return {
      statusCode: 200,
      body: JSON.stringify(authors)
    };
  }

  // Implementa otros métodos HTTP (POST, PUT, DELETE) aquí...
};
