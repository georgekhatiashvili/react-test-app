// server.js or your main server file
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse'); // Import pdf-parse
const mongoose = require('mongoose');
const Book = require('./models/bookmodel'); // Import the Book model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Function to extract the first 30 words from a PDF
const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const words = data.text.split(/\s+/).slice(0, 30).join(' ');
    return words;
};

// Handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { name, author, categories, isGeorgian } = req.body;

        // Ensure file and required fields are present
        if (!req.file || !name || !author || !categories) {
            return res.status(400).send({ message: 'All fields are required!' });
        }

        const categoriesParsed = JSON.parse(categories);
        const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        let description = '';

        if (req.file.mimetype === 'application/pdf') {
            description = await extractTextFromPDF(req.file.path);
        }

        // Create file metadata
        const fileMetadata = {
            fileName: req.file.filename,
            name,
            author,
            categories: categoriesParsed,
            file: fileUrl,
            isGeorgian: isGeorgian === 'true',
            desc: description
        };

        // Save to MongoDB
        const newFile = new Book(fileMetadata); // Corrected to use Book model
        await newFile.save();

        res.send({ message: 'File uploaded and metadata saved successfully!', data: fileMetadata });
    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).send({ message: 'Error processing upload. Please try again.' });
    }
});

// ... (other imports and middleware)

app.get('/books', async (req, res) => {
    try {
      const books = await Book.find(); // Fetch all books from the database
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Error fetching books' });
    }
  });



// Search endpoint for books by name and description
app.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send({ message: 'Search query is required!' });
    }

    try {
        const books = await Book.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case insensitive search for name
                { desc: { $regex: query, $options: 'i' } }  // Case insensitive search for description
            ]
        });

        res.send(books); // Return the found books
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send({ message: 'Error fetching books. Please try again.' });
    }
});

// Serve files for preview in the browser
app.get('/preview/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
