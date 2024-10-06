import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the TourImage component outside of the main component
const TourImage = ({ imageUrl, altText }) => {
  return (
    <img
      src={imageUrl}
      alt={altText}
      className="img-fluid" // Bootstrap class for responsive images
    />
  );
};

const TourShowcase = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        setTours(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Tour Showcase</h1>
      {error && <p className="text-danger text-center">Error: {error}</p>}
      <div className="row">
        {tours.map((tour) => (
          <div key={tour._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">{tour.name}</h2>
                <p className="card-text">Price: ${tour.price}</p>
                <p className="card-text">{tour.description}</p>
                <TourImage
                  imageUrl={`http://localhost:5000/${tour.coverImage}`}
                  altText={tour.name}
                />
                {/* Create clickable links for each location */}
                <p className="card-text">
                  Locations: {tour.locations.length > 0 ? (
                    tour.locations.map((loc, index) => (
                      <Link key={index} to={`/locations/${loc}`} className="link-primary">
                        {loc}
                      </Link>
                    )).reduce((prev, curr) => [prev, ', ', curr])
                  ) : (
                    <span>locations available</span> // Message if no locations
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourShowcase;
