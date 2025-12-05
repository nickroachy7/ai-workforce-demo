const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
];

let nextId = 3;

// GET /api/users - Get all users
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const newUser = {
      id: nextId++,
      name,
      email,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Check if email already exists for another user
    const existingUser = users.find(u => u.email === email && u.id !== userId);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use by another user'
      });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: users[userIndex],
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

module.exports = router;