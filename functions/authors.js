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
    const id = event.queryStringParameters && event.queryStringParameters.id;

    if (method === 'GET') {
        if (id) {
            // Obtener autor por ID
            const author = await Author.findById(id);
            if (!author) {
                return {
                  statusCode: 404,
                  body: JSON.stringify({ message: 'Autor no encontrado' })
                };
            }
            return {
              statusCode: 200,
              body: JSON.stringify(author)
            };
        } else {
            // Obtener todos los autores
            const authors = await Author.find();
            return {
              statusCode: 200,
              body: JSON.stringify(authors)
            };
        }
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
        if (!id) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'ID de autor requerido para actualizar' })
            };
        }
        const updateData = JSON.parse(event.body);
        const updatedAuthor = await Author.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedAuthor) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: 'Autor no encontrado' })
            };
        }
        return {
          statusCode: 200,
          body: JSON.stringify(updatedAuthor)
        };
    }

    if (method === 'DELETE') {
        if (!id) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'ID de autor requerido para eliminar' })
            };
        }
        const deletedAuthor = await Author.findByIdAndDelete(id);
        if (!deletedAuthor) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: 'Autor no encontrado' })
            };
        }
        return {
          statusCode: 204,
          body: JSON.stringify({ message: 'Autor eliminado exitosamente' })
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
