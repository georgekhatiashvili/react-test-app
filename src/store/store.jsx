import React, { useState, useEffect, useRef } from 'react';
import FruitCounter from './FruitCounter'; // Adjust path as necessary
import FruitTracker from './FruitTracker'; // Adjust path as necessary
import './store.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function Store() {
    const [purchases, setPurchases] = useState([]); // State to track all purchases
    const [fruitData, setFruitData] = useState(null); // State to hold the fruit stock data
    const [loadingData, setLoadingData] = useState(true); // Loading state for data fetching
    const [loading, setLoading] = useState(false); // Loading state for payment
    const [paymentId, setPaymentId] = useState(0); // State to track payment ID
    const [alertMessage, setAlertMessage] = useState(''); // Alert message state

    const fruitTrackerRef = useRef(null); // Create a ref for the FruitTracker section

    // Load stock data from backend when the component mounts
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stock');
                if (!response.ok) {
                    throw new Error('Failed to fetch stock data');
                }
                const data = await response.json();
                setFruitData(data);
            } catch (error) {
                console.error(error);
                setAlertMessage('Error loading stock data. Please try again later.');
            } finally {
                setLoadingData(false); // End loading state
            }
        };

        const fetchPayments = async () => {
            try {
                const response = await fetch('http://localhost:5000/payments'); // Update the endpoint accordingly
                if (!response.ok) {
                    throw new Error('Failed to fetch payment data');
                }
                const payments = await response.json();
                if (payments.length > 0) {
                    setPaymentId(payments[payments.length - 1].paymentId + 1); // Increment to next ID
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchStockData();
        fetchPayments();
    }, []);

    // Load saved purchases from local storage
    useEffect(() => {
        const savedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        setPurchases(savedPurchases);
        setAlertMessage('Please make your order!'); // Set initial alert message
    }, []);

    // Handle buy action for a specific fruit and quantity
    const handleBuy = (fruitName, quantity) => {
        if (fruitData[fruitName].stock >= quantity) {
            setPurchases((prevPurchases) => {
                const updatedPurchases = [...prevPurchases, ...Array(quantity).fill(fruitName)];
                localStorage.setItem('purchases', JSON.stringify(updatedPurchases)); // Save to local storage
                setAlertMessage(`You added ${quantity} ${fruitName}`); // Set success message
                return updatedPurchases; // Update state with the purchased fruits
            });
        } else {
            setAlertMessage(`Not enough stock for ${fruitName}. Available: ${fruitData[fruitName].stock}`); // Set alert message
        }
    };

    // Handle reduce action for a specific fruit in the cart
    const handleReduce = (fruitName) => {
        setPurchases((prevPurchases) => {
            const updatedPurchases = prevPurchases.filter((fruit) => fruit !== fruitName);
            localStorage.setItem('purchases', JSON.stringify(updatedPurchases)); // Save to local storage
            if (updatedPurchases.length < prevPurchases.length) {
                setAlertMessage(`You removed 1 ${fruitName} from your cart`); // Set success message
            }
            return updatedPurchases; // Update state with the remaining fruits
        });
    };

    const handlePayment = async () => {
        setLoading(true); // Set loading state to true during payment
        try {
            const response = await fetch('http://localhost:5000/api/calculate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchases), // Send the array of purchases
            });

            if (!response.ok) {
                throw new Error('Failed to calculate payment');
            }

            const paymentInfo = await response.json();
            console.log('Payment information:', paymentInfo);
            paymentInfo.paymentId = paymentId; // Add the paymentId to the paymentInfo

            // Update the stock after payment calculation
            await handleUpdateStockAfterPayment(paymentInfo.breakdown); // Function to handle stock update

            setPurchases([]); // Clear purchases after payment
            setPaymentId((prevId) => prevId + 1); // Increment the paymentId for the next payment
            setAlertMessage('Payment successful! Thank you for your purchase!'); // Success message

        } catch (error) {
            console.error(error);
            setAlertMessage('Payment failed. Please try again.'); // Error message
        } finally {
            setLoading(false); // End loading state
        }
    };

    const handleUpdateStockAfterPayment = async (breakdown) => {
        try {
            const updatedFruitData = { ...fruitData }; // Clone existing fruit data
            Object.entries(breakdown).forEach(([fruit, count]) => {
                if (updatedFruitData[fruit]) {
                    updatedFruitData[fruit].stock -= count; // Decrease stock based on purchase count
                }
            });

            await fetch('http://localhost:5000/api/stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFruitData), // Send updated fruit data
            });

            console.log('Stock data updated successfully!');
        } catch (error) {
            console.error('Failed to update stock data:', error);
        }
    };

    if (loadingData) {
        return <div className="text-center"><p>Loading fruit data...</p></div>;
    }

    return (
        <div className="container my-4" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
            <h1 className="text-center mb-4">Fruit Store</h1>
            
            {alertMessage && (
                <div className={`alert ${alertMessage.includes('failed') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {alertMessage}
                </div>
            )}
            
            {/* Link to Cart */}
            <div className="text-center mb-4">
                <a 
                    href="#cart" 
                    className="btn btn-primary" 
                    onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        fruitTrackerRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the FruitTracker section
                    }}
                >
                    Cart
                </a>
            </div>

            {/* Fruit List Section */}
            <div className="row">
                {fruitData && Object.keys(fruitData).map((fruit) => (
                    <div className="col-md-6 mb-4" key={fruit}>
                        <FruitCounter 
                            fruitName={fruit} 
                            onBuy={handleBuy} 
                            fruitData={fruitData} 
                        />
                    </div>
                ))}
            </div>
          
            {/* Fruit Tracker Section */}
            <div ref={fruitTrackerRef} id="cart"> {/* Set the ref and id here */}
                <FruitTracker purchases={purchases} fruitData={fruitData} onBuy={handleBuy} onReduce={handleReduce} />
            </div>
          
            {/* Payment Button */}
            <div className="text-center mt-4">
                <button 
                    onClick={handlePayment} 
                    disabled={loading} 
                    className="btn btn-success"
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                >
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </div>
        </div>
    );
}

export default Store;
