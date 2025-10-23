const express = require('express');
const { login, employeeStart } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Login RH/Admin
router.post('/login', login);

// Login Funcionário (auto-cria)
router.post('/employee-start', employeeStart);

module.exports = router;