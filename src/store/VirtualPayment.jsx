// components/VirtualPayment.jsx
import React from 'react';

const VirtualPayment = ({ purchases, onComplete }) => {
  const handlePayment = () => {
    if (purchases.length === 0) {
      alert('No items purchased!');
      return;
    }

    const paymentDetails = {
      id: `payment${Date.now()}`, // Generate a unique ID
      items: purchases,
      date: new Date().toISOString(),
    };

    // Save payment details to localStorage or update an existing JSON
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
    paymentHistory.push(paymentDetails);
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));

    // Clear purchases
    onComplete();
    alert('Virtual payment successful! Payment details saved.');
  };

  return (
    <div>
      <h2>Virtual Payment</h2>
      <button className="btn btn-primary" onClick={handlePayment}>
        Make Payment
      </button>
    </div>
  );
};

export default VirtualPayment;
