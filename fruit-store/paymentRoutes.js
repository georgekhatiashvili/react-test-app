// paymentRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load stock data from JSON file
const loadStockData = () => {
  const dataPath = path.join(__dirname, 'stock.json');
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
};

// Save stock data to JSON file
const saveStockData = (data) => {
  const dataPath = path.join(__dirname, 'stock.json');
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Endpoint to calculate payment and save it as JSON
router.post('/calculate-payment', (req, res) => {
  const purchases = req.body; // Expecting an array of purchases
  const stockData = loadStockData();
  let total = 0;

  const purchaseCount = {};

  // Count the occurrences of each fruit in purchases
  purchases.forEach((purchase) => {
    purchaseCount[purchase] = (purchaseCount[purchase] || 0) + 1;
  });

  // Calculate the total price based on the counted purchases
  for (const fruit in purchaseCount) {
    if (stockData[fruit]) {
      const fruitPrice = stockData[fruit].price;
      const quantity = purchaseCount[fruit];

      // Check if there is enough stock before processing payment
      if (stockData[fruit].stock >= quantity) {
        total += fruitPrice * quantity;
        // Decrease stock after successful purchase
        stockData[fruit].stock -= quantity;
      } else {
        return res.status(400).json({ message: `Not enough stock for ${fruit}. Available: ${stockData[fruit].stock}` });
      }
    } else {
      console.error(`Fruit not found in stock data: ${fruit}`); // Log fruit not found
    }
  }

  // Save updated stock data
  saveStockData(stockData);

  // Read existing payment data to get the latest payment ID
  const paymentFilePath = path.join(__dirname, 'payments.json');
  fs.readFile(paymentFilePath, 'utf8', (err, data) => {
    let payments = [];
    let newPaymentId = 0;

    if (!err && data) {
      payments = JSON.parse(data);
      // Find the highest paymentId and increment it
      const lastPayment = payments[payments.length - 1];
      newPaymentId = lastPayment ? lastPayment.paymentId + 1 : 0;
    }

    // Create a new payment record
    const paymentRecord = {
      paymentId: newPaymentId, // Set the incremented paymentId
      total: total.toFixed(2),
      breakdown: purchaseCount,
      date: new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tbilisi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
      }).format(new Date()), // Format current date in Georgian timezone
    };

    // Log the payment record for debugging
    console.log('Payment Record:', paymentRecord);

    // Save the payment record to a JSON file
    payments.push(paymentRecord); // Add the new payment record

    fs.writeFile(paymentFilePath, JSON.stringify(payments, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing payment data:', writeErr);
        return res.status(500).send('Error saving payment data');
      }

      // Log successful write
      console.log('Payment data saved successfully!');

      res.json(paymentRecord); // Return the total payment information
    });
  });
});

module.exports = router;
