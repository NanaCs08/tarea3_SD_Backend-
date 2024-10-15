const mongoose = require('mongoose');
const PublisherSchema = new mongoose.Schema({
    name: String,
    country: String,
    founded: Number,
    genre: String,
    booksPublished: [String]
});
module.exports = mongoose.model('Publisher', PublisherSchema);
