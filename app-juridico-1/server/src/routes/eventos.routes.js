const express = require('express');
const { 
  createEvent, 
  validateEvent, 
  getEventById, 
  listEvents 
} = require('../controllers/eventos.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router();

// Criar evento
router.post('/', authenticateToken, authorizeRole('RH', 'ADMIN'), createEvent);

// Validar evento
router.post('/:id/validar', authenticateToken, authorizeRole('RH', 'ADMIN'), validateEvent);

// Obter evento por ID
router.get('/:id', authenticateToken, authorizeRole('RH', 'ADMIN'), getEventById);

// Listar eventos
router.get('/', authenticateToken, authorizeRole('RH', 'ADMIN'), listEvents);

module.exports = router;