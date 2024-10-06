// models/Tour.js
const mongoose = require('mongoose');

// Define a Tour schema
const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  additionalImages: [{ type: String }], // Array for additional images
  locations: [{ type: String, required: true }],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
