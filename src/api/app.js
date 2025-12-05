const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const { jsonParser, urlEncodedParser, errorHandler } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(jsonParser);
app.use(urlEncodedParser);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`User Management API running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Users API available at http://localhost:${PORT}/api/users`);
});

module.exports = app;