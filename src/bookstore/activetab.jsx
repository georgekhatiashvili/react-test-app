// src/components/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';

const BookForm = ({ onBookAdded, books }) => {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [activeTab, setActiveTab] = useState('addBook'); // State for active tab

    // Predefined categories
    const categories = [
        'Fiction',
        'Non-Fiction',
        'Science Fiction',
        'Fantasy',
        'Mystery',
        'Biography',
        'History',
        'Self-Help'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/books', { name, author, category });
            onBookAdded(response.data); // Callback to notify BookShowing of new book
            setName('');
            setAuthor('');
            setCategory('');
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div>
            <div className="sub-nav mb-3">
                <button onClick={() => setActiveTab('addBook')} style={{ marginRight: '10px' }}>
                    Add Book
                </button>
                <button onClick={() => setActiveTab('viewBooks')}>
                    View Books
                </button>
            </div>

            {activeTab === 'addBook' && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Book Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Add Book</button>
                </form>
            )}

            {activeTab === 'viewBooks' && (
                <div>
                    <h2>Books List</h2>
                    <ul>
                        {books.length > 0 ? (
                            books.map((book) => (
                                <li key={book.id}>
                                    <strong>{book.name}</strong> by {book.author}
                                </li>
                            ))
                        ) : (
                            <li>No books available.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BookForm;
