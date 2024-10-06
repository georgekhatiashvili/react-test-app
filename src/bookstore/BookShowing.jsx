import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookShowing = () => {
  const [books, setBooks] = useState([]);
  const [georgianOnly, setGeorgianOnly] = useState(false); // State to filter Georgian documents
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books'); // Adjusted endpoint to fetch all books
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error.message || error);
        setError('Could not fetch book data.');
        if (error.response) {
          console.error('Error details:', error.response.data);
          setError(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      }
    };

    fetchBooks();
  }, []);

  const handleFilterChange = () => {
    setGeorgianOnly(!georgianOnly);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Update the search term, converting to lowercase for case-insensitive search
  };

  // Filter books based on the isGeorgian property and the search term
  const filteredBooks = books.filter(book => {
    const matchesGeorgianFilter = georgianOnly ? book.isGeorgian : true;
    const matchesSearchTerm =
      book.name.toLowerCase().includes(searchTerm) ||
      book.desc.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm); // Include author in the search

    return matchesGeorgianFilter && matchesSearchTerm; // Return books that match both filters
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Book List</h2>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, description, or author..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          className="form-check-input"
          id="filterGeorgian"
          checked={georgianOnly}
          onChange={handleFilterChange}
        />
        <label className="form-check-label" htmlFor="filterGeorgian">
          Show only Georgian documents
        </label>
      </div>

      <div className="row">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{book.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                  <p className="card-text">{book.desc}</p> {/* Show the description */}
                  <a
                    href={book.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookShowing;
