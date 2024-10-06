const crypto = require('crypto');

// Create a hash using the SHA-256 algorithm
const hash = crypto.createHash('sha256');

// Update the hash with some data
hash.update('fruitbasssnana');

// Finalize the hash and get the result in hexadecimal format
const result = hash.digest('hex');

console.log(result); // Prints the hash

