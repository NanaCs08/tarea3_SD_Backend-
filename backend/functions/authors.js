const mongoose = require('mongoose');
const Author = require('../models/Author');
require('dotenv').config();

// Conectar a MongoDB (solo se conecta si aún no está conectado)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI); // Sin opciones adicionales
  }

exports.handler = async function(event, context) {
  try {
    const method = event.httpMethod;

    if (method === 'GET') {
        const authors = await Author.find();
        console.log("Autores recuperados:", authors); // Esto imprimirá los autores recuperados en la consola
        return {
          statusCode: 200,
          body: JSON.stringify(authors)
        };
    }

    if (method === 'POST') {
      const data = JSON.parse(event.body);
      const newAuthor = new Author(data);
      const savedAuthor = await newAuthor.save();
      return {
        statusCode: 201,
        body: JSON.stringify(savedAuthor)
      };
    }

    if (method === 'PUT') {
      const { id, ...updateData } = JSON.parse(event.body);
      const updatedAuthor = await Author.findByIdAndUpdate(id, updateData, { new: true });
      return {
        statusCode: 200,
        body: JSON.stringify(updatedAuthor)
      };
    }

    if (method === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await Author.findByIdAndDelete(id);
      return {
        statusCode: 204,
        body: JSON.stringify({ message: 'Author eliminado exitosamente' })
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
