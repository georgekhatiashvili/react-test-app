import React from 'react';

function FruitsList() {
  const fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Strawberry'];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Fruits List</h2>
      <ul Class="list">
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>
    </div>
  );
}

export default FruitsList;
