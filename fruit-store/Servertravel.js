// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Tour = require('./models/Tour'); // Import the Tour model
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tours', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'tourCover') {
      cb(null, 'uploads/'); // Specify the uploads directory for the cover image
    } else {
      cb(null, 'tourImages/'); // Specify the directory for additional images
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({ storage });

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
app.use('/tourImages', express.static('tourImages')); // Serve static files from the tourImages directory

// POST route for tour upload
app.post('/api/tours', upload.fields([{ name: 'tourCover' }, { name: 'tourImages' }]), async (req, res) => {
  try {
    const { tourName, tourPrice, tourDescription, tourLocations } = req.body;

    const newTour = new Tour({
      name: tourName,
      price: tourPrice,
      description: tourDescription,
      coverImage: req.files.tourCover[0].path, // Save the cover image path to the database
      additionalImages: req.files.tourImages.map(file => file.path), // Save additional images
      locations: JSON.parse(tourLocations),
    });

    await newTour.save();
    res.status(201).json({ message: 'Tour uploaded successfully!', tour: newTour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading tour' });
  }
});

// GET route for fetching tours
app.get('/api/tours', async (req, res) => {
  const { location } = req.query; // Get location from query params
  try {
    let tours;
    if (location) {
      tours = await Tour.find({ locations: location }); // Filter by location
    } else {
      tours = await Tour.find(); // Fetch all tours if no location specified
    }
    res.status(200).json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

// GET route for fetching tour details by ID
app.get('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id); // Fetch the tour by ID
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tour details' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
