const mongoose = require('mongoose');
const Publisher = require('../models/Publisher');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.handler = async function(event, context) {
  try {
    const method = event.httpMethod;

    // GET - Listar todos los publishers
    if (method === 'GET') {
      const publishers = await Publisher.find();
      return {
        statusCode: 200,
        body: JSON.stringify(publishers)
      };
    }

    // POST - Agregar un nuevo publisher
    if (method === 'POST') {
      const data = JSON.parse(event.body);
      const newPublisher = new Publisher(data);
      const savedPublisher = await newPublisher.save();
      return {
        statusCode: 201,
        body: JSON.stringify(savedPublisher)
      };
    }

    // PUT - Actualizar un publisher existente
    if (method === 'PUT') {
      const { id } = JSON.parse(event.body);
      const updateData = JSON.parse(event.body);
      const updatedPublisher = await Publisher.findByIdAndUpdate(id, updateData, { new: true });
      return {
        statusCode: 200,
        body: JSON.stringify(updatedPublisher)
      };
    }

    // DELETE - Eliminar un publisher
    if (method === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await Publisher.findByIdAndDelete(id);
      return {
        statusCode: 204,
        body: JSON.stringify({ message: 'Publisher eliminado exitosamente' })
      };
    }

    // Método no permitido
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
