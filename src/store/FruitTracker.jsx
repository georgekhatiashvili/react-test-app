import React from 'react';
import './FruitTracker.css'; // Ensure you import the CSS file

function FruitTracker({ purchases, fruitData, onBuy, onReduce }) {
    const calculatePurchases = () => {
        const purchaseCount = { apples: 0, bananas: 0, oranges: 0, grapes: 0 };

        purchases.forEach((purchase) => {
            const fruitKey = purchase.toLowerCase();
            if (purchaseCount.hasOwnProperty(fruitKey)) {
                purchaseCount[fruitKey] += 1;
            }
        });

        return purchaseCount;
    };

    const purchaseCount = calculatePurchases();
  
    const calculateTotal = (purchaseCount) => {
        if (!fruitData) {
            return "0.00";
        }

        return Object.keys(purchaseCount).reduce((total, fruit) => {
            const price = fruitData[fruit]?.price || 0;
            return total + (purchaseCount[fruit] * price);
        }, 0).toFixed(2);
    };

    const totalPrice = calculateTotal(purchaseCount);

    const onBuyHandler = (fruitName) => {
        const quantity = 1;
        if (onBuy) {
            onBuy(fruitName, quantity);
        } else {
            console.error('onBuy is not defined');
        }
    };

    const onReduceHandler = (fruitName) => {
        if (onReduce) {
            onReduce(fruitName);
        } else {
            console.error('onReduce is not defined');
        }
    };

    return (
        <div className="fruit-tracker bg-light border rounded p-4 mt-4">
            <h1 className="text-center mb-3">Fruit Purchase Tracker</h1>
            <h2>Fruits Purchased:</h2>
            <ul className="list-group mb-3">
                {Object.keys(purchaseCount).map((fruit) => (
                    purchaseCount[fruit] > 0 && (
                        <li key={fruit} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                {fruit.charAt(0).toUpperCase() + fruit.slice(1)}: {purchaseCount[fruit]}
                            </div>
                            <div>
                                <button className="btn btn-danger btn-sm mx-2" onClick={() => onReduceHandler(fruit)}>
                                    Remove
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => onBuyHandler(fruit)}>
                                    Add One More
                                </button>
                            </div>
                        </li>
                    )
                ))}
            </ul>
            <h3 className="total-price text-center">Total Price: {totalPrice} GEL</h3>
        </div>
    );
}

export default FruitTracker;
