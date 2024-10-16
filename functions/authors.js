const mongoose = require('mongoose');
const Author = require('../models/Author');
require('dotenv').config();

// Conectar a MongoDB (solo se conecta si aún no está conectado)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

exports.handler = async function(event, context) {
  // Configurar encabezados de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permitir todos los orígenes
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Métodos permitidos
    'Access-Control-Allow-Headers': 'Content-Type' // Encabezados permitidos
  };

  // Manejar solicitud OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
    };
  }

  try {
    const method = event.httpMethod;
    const path = event.path;
    const id = path.split('/').pop(); // Extrae el último segmento de la URL

    if (method === 'GET') {
        if (id && id !== 'authors') { // Verifica si el ID no es 'authors'
            const author = await Author.findById(id);
            if (!author) {
                return {
                  statusCode: 404,
                  headers,
                  body: JSON.stringify({ message: 'Autor no encontrado' })
                };
            }
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(author)
            };
        } else {
            const authors = await Author.find();
            return {
              statusCode: 200,
              headers,
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
          headers,
          body: JSON.stringify(savedAuthor)
        };
    }

    if (method === 'PUT') {
        if (!id || id === 'authors') {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ message: 'ID de autor requerido para actualizar' })
            };
        }
        const updateData = JSON.parse(event.body);
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
        if (!id || id === 'authors') {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ message: 'ID de autor requerido para eliminar' })
            };
        }
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
