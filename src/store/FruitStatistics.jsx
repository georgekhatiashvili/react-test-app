import React from 'react';

function FruitStatistics({ purchases }) {
  const purchaseCount = {};
  purchases.forEach((purchase) => {
    purchaseCount[purchase] = (purchaseCount[purchase] || 0) + 1;
  });

  return (
    <div>
      <h2>Fruit Statistics</h2>
      <ul>
        <li>Apples Bought: {purchaseCount.apples || 0}</li>
        <li>Bananas Bought: {purchaseCount.bananas || 0}</li>
        <li>Oranges Bought: {purchaseCount.oranges || 0}</li>
        <li>Grapes Bought: {purchaseCount.grapes || 0}</li>
      </ul>
    </div>
  );
}

export default FruitStatistics;
