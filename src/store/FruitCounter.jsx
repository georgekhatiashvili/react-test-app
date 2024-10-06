import React, { useState } from 'react';
import appleImage from './apple.png';
import bananaImage from './banana.png';
import orangeImage from './orange.png';
import grapeImage from './grape.png';

function FruitCounter({ fruitName, onBuy, fruitData }) {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1

  const handleBuy = () => {
    if (quantity > 0) {
      onBuy(fruitName, quantity); // Pass both fruit name and quantity
    }
  };

  const fruitImages = {
    apples: appleImage,
    bananas: bananaImage,
    oranges: orangeImage,
    grapes: grapeImage,
  };
  return (
    <div className="fruit-counter card p-3">
      <h3 className="fruit-name">
        <img src={fruitImages[fruitName]} alt={fruitName} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
        {fruitName} - {fruitData[fruitName].stock} in stock
      </h3>
      <p className="fruit-price">Price: {fruitData[fruitName].price} GEL</p>
      <p className="fruit-stock">Stock: {fruitData[fruitName].stock}</p>
      <div className="input-group mb-3">
        <input
          type="number"
          value={quantity}
          min="1"
          max={fruitData[fruitName].stock}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
          className="form-control quantity-input"
        />
        <div className="input-group-append">
          <button
            onClick={handleBuy}
            disabled={quantity > fruitData[fruitName].stock}
            className="btn btn-primary buy-button"
          >
            Add to Cart {quantity}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FruitCounter;
