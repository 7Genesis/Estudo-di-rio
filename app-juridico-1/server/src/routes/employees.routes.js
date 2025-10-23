const express = require('express');
const { 
  createEmployee, 
  getEmployees, 
  updateEmployee, 
  deleteEmployee, 
  approveEmployee 
} = require('../controllers/employees.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router();

// Create a new employee
router.post('/', authenticateToken, authorizeRole('RH', 'ADMIN'), createEmployee);

// Get all employees
router.get('/', authenticateToken, authorizeRole('RH', 'ADMIN'), getEmployees);

// Update an existing employee
router.put('/:id', authenticateToken, authorizeRole('RH', 'ADMIN'), updateEmployee);

// Delete an employee
router.delete('/:id', authenticateToken, authorizeRole('RH', 'ADMIN'), deleteEmployee);

// Approve an employee
router.post('/approve/:id', authenticateToken, authorizeRole('RH', 'ADMIN'), approveEmployee);

module.exports = router;