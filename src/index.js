const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./lib/prisma');

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

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await prisma.$disconnect();
      console.log('Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));