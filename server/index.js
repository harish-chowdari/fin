// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Sample in-memory finance data (replace with your database logic)
let financeData = [
    { userId: '1', amount: 300, category: 'Groceries', date: '2024-09-20' },
    { userId: '1', amount: 800, category: 'Utilities', date: '2024-09-21' },
    { userId: '1', amount: 150, category: 'Rent', date: '2024-09-22' },
    { userId: '1', amount: 430, category: 'Groceries', date: '2024-09-20' },
   { userId: '1', amount: 50, category: 'Rent', date: '2024-09-22' },
   { userId: '1', amount: 300, category: 'Groceries', date: '2024-09-20' },
    { userId: '1', amount: 800, category: 'Utilities', date: '2024-09-21' },
    { userId: '1', amount: 150, category: 'Rent', date: '2024-09-22' },
    { userId: '1', amount: 430, category: 'Groceries', date: '2024-09-20' },
   { userId: '1', amount: 50, category: 'Rent', date: '2024-09-22' },
   { userId: '1', amount: 300, category: 'Groceries', date: '2024-09-20' },
    { userId: '1', amount: 800, category: 'Utilities', date: '2024-09-21' },
    { userId: '1', amount: 150, category: 'Rent', date: '2024-09-22' },
    { userId: '1', amount: 430, category: 'Groceries', date: '2024-09-20' },
   { userId: '1', amount: 50, category: 'Rent', date: '2024-09-22' },
   
   { userId: '1', amount: 300, category: 'Groceries', date: '2024-09-20' },
    { userId: '1', amount: 800, category: 'Utilities', date: '2024-09-21' },
    { userId: '1', amount: 150, category: 'Rent', date: '2024-09-22' },
    { userId: '1', amount: 430, category: 'Groceries', date: '2024-09-20' },
   { userId: '1', amount: 50, category: 'Rent', date: '2024-09-22' },
]; 

// Mock authentication middleware
app.use((req, res, next) => {
  // Simulate a logged-in user
  req.user = { id: '1' }; // For testing, you can change this to '2' to see different results
  next();
});

// Get finance data for a particular user
app.get('/api/finance', (req, res) => {
  const userId = req.user.id; // Assume user ID comes from authentication middleware
  // Filter finance data for the logged-in user
  const userFinanceData = financeData.filter(data => data.userId === userId);
  res.json(userFinanceData);
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Finance API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
