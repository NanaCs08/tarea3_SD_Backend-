const mongoose = require('mongoose');
const AuthorSchema = new mongoose.Schema({
    name: String,
    birthdate: Date,
    nationality: String,
    books: [String]
});
module.exports = mongoose.model('Author', AuthorSchema);
