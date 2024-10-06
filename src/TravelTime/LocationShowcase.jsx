import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LocationShowcase = () => {
    const { location } = useParams(); // Get the location from the URL
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocationTours = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tours?location=${location}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tours for this location');
                }
                const data = await response.json();
                setTours(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchLocationTours();
    }, [location]);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Tours in {location}</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="row">
                {tours.length === 0 && <p className="text-center">No tours found for this location.</p>}
                {tours.map((tour) => (
                    <div key={tour._id} className="col-md-4 mb-4">
                        <div className="card">
                            <img
                                src={`http://localhost:5000/${tour.coverImage}`}
                                alt={tour.name}
                                className="card-img-top"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/tours/${tour._id}`}>{tour.name}</Link>
                                </h5>
                                <p className="card-text">Price: ${tour.price}</p>
                                <p className="card-text">{tour.description}</p>
                                <div>
                                    {/* Display locations with links */}
                                    {tour.locations.map((loc) => (
                                        <Link 
                                            key={loc} 
                                            to={`/locations/${loc}`} 
                                            className="btn btn-link"
                                            style={{ padding: '0' }}
                                        >
                                            {loc}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationShowcase;
