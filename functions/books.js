const mongoose = require('mongoose');
const Book = require('../models/Book'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
require('dotenv').config();

// Conectar a MongoDB (solo se conecta si aún no está conectado)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI);
}

exports.handler = async function(event, context) {
  try {
    const method = event.httpMethod;

    if (method === 'GET') {
        // Obtener todos los libros
        const books = await Book.find();
        console.log("Libros recuperados:", books);
        return {
          statusCode: 200,
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
          body: JSON.stringify(savedBook)
        };
    }

    if (method === 'PUT') {
        // Actualizar un libro existente
        const { id, ...updateData } = JSON.parse(event.body);
        const updatedBook = await Book.findOneAndUpdate({ id: id }, updateData, { new: true });
        return {
          statusCode: 200,
          body: JSON.stringify(updatedBook)
        };
    }

    if (method === 'DELETE') {
        // Eliminar un libro
        const { id } = JSON.parse(event.body);
        await Book.findOneAndDelete({ id: id });
        return {
          statusCode: 204,
          body: JSON.stringify({ message: 'Book eliminado exitosamente' })
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
