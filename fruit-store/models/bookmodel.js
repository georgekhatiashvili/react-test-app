// models/bookmodel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    categories: { type: [String], required: true },
    file: { type: String, required: true },
    isGeorgian: { type: Boolean, required: true },
    desc: { type: String }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
