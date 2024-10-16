const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

// Conectar a MongoDB (solo se conecta si aún no está conectado)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

exports.handler = async function(event, context) {
  // Configurar los encabezados de CORS para todas las respuestas
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permitir todos los orígenes
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Métodos permitidos
    'Access-Control-Allow-Headers': 'Content-Type' // Encabezados permitidos
  };

  // Manejar las solicitudes OPTIONS preflight para CORS
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
        // Obtener todos los libros
        const books = await Book.find();
        console.log("Libros recuperados:", books);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(books)
        };
    }

    if (method === 'POST') {
        // Crear un nuevo libro
        const data = JSON.parse(event.body);
        const newBook = new Book(data);
        const savedBook = await newBook.save();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(savedBook)
        };
    }

    if (method === 'PUT') {
        // Actualizar un libro existente
        const { id, ...updateData } = JSON.parse(event.body);
        const updatedBook = await Book.findOneAndUpdate({ id: id }, updateData, { new: true });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedBook)
        };
    }

    if (method === 'DELETE') {
        // Eliminar un libro
        const { id } = JSON.parse(event.body);
        await Book.findOneAndDelete({ id: id });
        return {
          statusCode: 204,
          headers,
          body: JSON.stringify({ message: 'Book eliminado exitosamente' })
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
