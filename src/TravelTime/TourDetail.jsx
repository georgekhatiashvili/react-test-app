// TourDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TourDetail = () => {
    const { id } = useParams(); // Get the tour ID from the URL
    const [tour, setTour] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tours/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tour details');
                }
                const data = await response.json();
                setTour(data); // Set fetched tour data
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchTourDetails();
    }, [id]); // Run effect when the ID changes

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!tour) {
        return <p>Loading...</p>; // Show loading text while fetching
    }

    return (
        <div className="container mt-5">
            <h1>{tour.name}</h1>
            <img
                src={`http://localhost:5000/${tour.coverImage}`}
                alt={tour.name}
                className="img-fluid"
            />
            <p>Price: ${tour.price}</p>
            <p>{tour.description}</p>
            <p>Locations: {tour.locations.join(', ')}</p>

            <h3>Additional Images:</h3>
            <div className="row">
                {tour.additionalImages.map((image, index) => (
                    <div className="col-md-3" key={index}>
                        <img
                            src={`http://localhost:5000/${image}`}
                            alt={`Tour Image ${index + 1}`}
                            className="img-fluid mb-3"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourDetail;
