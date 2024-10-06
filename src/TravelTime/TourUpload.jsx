import React, { useState } from 'react';

const TourUpload = () => {
  const [tourName, setTourName] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourCover, setTourCover] = useState(null);
  const [tourLocations, setTourLocations] = useState([]);
  const [tourImages, setTourImages] = useState([]); // State for additional images

  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setTourLocations([...tourLocations, value]);
    } else {
      setTourLocations(tourLocations.filter((loc) => loc !== value));
    }
  };

  const handleTourImagesChange = (event) => {
    setTourImages(event.target.files); // Get multiple files
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('tourName', tourName);
    formData.append('tourPrice', tourPrice);
    formData.append('tourDescription', tourDescription);
    formData.append('tourCover', tourCover); // Cover image
    formData.append('tourLocations', JSON.stringify(tourLocations)); // Locations

    // Append multiple images
    for (let i = 0; i < tourImages.length; i++) {
      formData.append('tourImages', tourImages[i]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error uploading tour:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tour Name:</label>
        <input
          type="text"
          value={tourName}
          onChange={(e) => setTourName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tour Price:</label>
        <input
          type="number"
          value={tourPrice}
          onChange={(e) => setTourPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={tourDescription}
          onChange={(e) => setTourDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tour Cover Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTourCover(e.target.files[0])}
          required
        />
      </div>
      <div>
        <label>Upload Additional Tour Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleTourImagesChange}
          required
        />
      </div>
      <div>
        <label>Tour Locations:</label>
        {['London', 'Paris', 'Moscow'].map((location) => (
          <div key={location}>
            <input
              type="checkbox"
              value={location}
              onChange={handleLocationChange}
            />
            <label>{location}</label>
          </div>
        ))}
      </div>
      <button type="submit">Upload Tour</button>
    </form>
  );
};

export default TourUpload;
