import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const products = [
  { name: 'Pen', price: 1, icon: 'fa-pen' },
  { name: 'Pencil', price: 2, icon: 'fa-pencil-alt' },
  { name: 'Bag', price: 4, icon: 'fa-shopping-bag' },
  { name: 'Egg', price: 5, icon: 'fa-egg' },
];

const Market = () => {
  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [guesses, setGuesses] = useState({}); // Store guesses for individual product costs
  const [totalGuess, setTotalGuess] = useState(''); // Store guess for total cost
  const [feedback, setFeedback] = useState('');

  const incrementQuantity = (productName) => {
    setQuantities((prev) => ({
      ...prev,
      [productName]: (prev[productName] || 0) + 1,
    }));
  };

  const handleGuessChange = (productName, value) => {
    setGuesses((prev) => ({
      ...prev,
      [productName]: value,
    }));
  };

  const handleTotalGuessChange = (e) => {
    setTotalGuess(e.target.value);
  };

  const checkTotalGuess = () => {
    const totalCost = products.reduce((acc, product) => {
      return acc + product.price * (quantities[product.name] || 0);
    }, 0);
    const userTotalGuess = parseFloat(totalGuess) || 0;

    if (userTotalGuess === totalCost) {
      setFeedback(`Correct! The total cost is $${totalCost}.`);
    } else {
      setFeedback(`Incorrect! The total cost is $${totalCost}.`);
    }

    setTotalGuess(''); // Clear the total guess input after checking
  };

  const checkIndividualGuess = (productName) => {
    const totalCost = (quantities[productName] || 0) * products.find(product => product.name === productName).price;
    const userGuess = parseFloat(guesses[productName]) || 0;

    if (userGuess === totalCost) {
      setFeedback(`Correct! The cost of ${productName} is $${totalCost}.`);
    } else {
      setFeedback(`Incorrect! The cost of ${productName} is $${totalCost}.`);
    }

    // Clear the individual guess input after checking
    setGuesses((prev) => ({ ...prev, [productName]: '' }));
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Small Market</h1>
      <h2>Select Product Quantities:</h2>
      <ul className="list-group mb-4">
        {products.map((product) => (
          <li key={product.name} className="list-group-item d-flex align-items-center">
            <i className={`fas ${product.icon} me-3`} style={{ fontSize: '20px' }}></i>
            <span
              onClick={() => incrementQuantity(product.name)}
              className="cursor-pointer me-2"
              style={{ cursor: 'pointer' }}
            >
              {product.name} (${product.price})
            </span>
            <span>({quantities[product.name] || 0})</span>
            <input
              type="number"
              value={guesses[product.name] || ''}
              onChange={(e) => handleGuessChange(product.name, e.target.value)}
              className="form-control ms-2"
              placeholder="Guess"
              style={{ width: '100px' }}
            />
            <button className="btn btn-success ms-2" onClick={() => checkIndividualGuess(product.name)}>
              Check Guess
            </button>
          </li>
        ))}
      </ul>
      <h3>Guess the Total Cost of All Products:</h3>
      <input
        type="number"
        value={totalGuess}
        onChange={handleTotalGuessChange}
        className="form-control mb-2"
        placeholder="Total cost guess"
      />
      <button className="btn btn-primary mb-2" onClick={checkTotalGuess}>
        Check Total Guess
      </button>
      {feedback && <p className="alert alert-info">{feedback}</p>}
    </div>
  );
};

export default Market;
