// Cart.js
import React from 'react';

function Cart({ purchases, fruitData }) {
    const calculateTotal = () => {
        return purchases.reduce((total, fruit) => {
            const price = fruitData[fruit.toLowerCase()]?.price || 0;
            return total + price;
        }, 0).toFixed(2);
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Your Cart</h1>
            <ul className="list-group">
                {purchases.map((fruit, index) => (
                    <li className="list-group-item" key={index}>
                        {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
                    </li>
                ))}
            </ul>
            <h3 className="total-price text-center mt-4">Total Price: {calculateTotal()} GEL</h3>
        </div>
    );
}

export default Cart;
