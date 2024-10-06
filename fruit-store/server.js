const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws'); // Import WebSocket library

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Global variable for payment ID
let paymentId = 0;

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

// Endpoint to get stock data
app.get('/api/stock', (req, res) => {
  const stockData = loadStockData();
  res.json(stockData);
});

// Endpoint to update stock data
app.post('/api/stock', (req, res) => {
  const newStockData = req.body; // Expecting the updated stock data
  saveStockData(newStockData); // Save the stock data

  // Notify all clients of stock update via WebSocket
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'stock-update', data: newStockData }));
    }
  });

  res.status(200).send('Stock data updated successfully!');
});

// Endpoint to calculate payment and save it as JSON

// Endpoint to calculate payment and save it as JSON
app.post('/api/calculate-payment', (req, res) => {
  const purchases = req.body; // Expecting an array of purchases
  const stockData = loadStockData();
  let total = 0;

  const purchaseCount = {};

  // Count the occurrences of each fruit in purchases
  purchases.forEach(purchase => {
      if (purchaseCount[purchase]) {
          purchaseCount[purchase] += 1;
      } else {
          purchaseCount[purchase] = 1;
      }
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
              // Respond with an error if stock is insufficient
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

      // Notify all clients of the updated stock via WebSocket
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'payment-update', data: paymentRecord }));
        }
      });

      // Return the total payment information
      res.json(paymentRecord);
    });
  });
});

// Create WebSocket server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send initial stock data to the new client
  const stockData = loadStockData();
  ws.send(JSON.stringify({ type: 'stock-update', data: stockData }));

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Here you can process the message and respond back if needed
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
