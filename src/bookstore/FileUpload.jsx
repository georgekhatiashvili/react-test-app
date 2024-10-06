import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Upload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isGeorgian, setIsGeorgian] = useState(false); // State for Georgian document
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !author || selectedCategories.length === 0) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('author', author);
    formData.append('categories', JSON.stringify(selectedCategories));
    formData.append('isGeorgian', isGeorgian); // Append the isGeorgian value

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      navigate('/bookshowing'); 
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Upload Your Book</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter book name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter author name" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categories</label>
          <select 
            multiple 
            className="form-select" 
            onChange={handleCategoryChange}
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Upload File</label>
          <input 
            type="file" 
            className="form-control" 
            onChange={handleFileChange} 
            accept=".pdf, .doc, .docx, .epub" 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-check-label">
            <input 
              type="checkbox" 
              className="form-check-input" 
              checked={isGeorgian}
              onChange={() => setIsGeorgian(!isGeorgian)} // Toggle isGeorgian state
            />
            Is this document in Georgian?
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Upload</button>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default FileUpload;
