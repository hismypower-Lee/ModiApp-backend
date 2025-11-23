const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');

app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ModiApp API Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});