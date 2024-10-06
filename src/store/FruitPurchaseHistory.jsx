import React from 'react';

function FruitPurchaseHistory({ purchases }) {
  return (
    <div>
      <h2>Purchase History</h2>
      <ul>
        {purchases.length > 0 ? (
          purchases.map((purchase, index) => (
            <li key={index}>{purchase}</li>
          ))
        ) : (
          <li>No purchases made yet.</li>
        )}
      </ul>
    </div>
  );
}

export default FruitPurchaseHistory;
