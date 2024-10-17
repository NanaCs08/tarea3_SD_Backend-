const mongoose = require('mongoose');
const Author = require('../models/Author'); // Asegúrate de tener un modelo adecuado para Author
require('dotenv').config();

// Conectar a MongoDB (solo se conecta si aún no está conectado)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
    };
  }

  try {
    const method = event.httpMethod;

    if (method === 'GET') {
      // Obtener todos los autores
      const authors = await Author.find();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(authors)
      };
    }

    if (method === 'POST') {
      // Crear un nuevo autor
      const data = JSON.parse(event.body);
      const newAuthor = new Author(data);
      const savedAuthor = await newAuthor.save();
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(savedAuthor)
      };
    }

    if (method === 'PUT') {
      const { id, ...updateData } = JSON.parse(event.body);
      const updatedAuthor = await Author.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedAuthor) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Autor no encontrado' })
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedAuthor)
      };
    }
    

    if (method === 'DELETE') {
      // Eliminar un autor
      const { id } = JSON.parse(event.body);
      const deletedAuthor = await Author.findByIdAndDelete(id);
      if (!deletedAuthor) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Autor no encontrado' })
        };
      }
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({ message: 'Autor eliminado exitosamente' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Método no permitido' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
