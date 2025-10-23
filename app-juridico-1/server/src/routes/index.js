const express = require('express');
const authRoutes = require('./auth.routes');
const employeesRoutes = require('./employees.routes');
const documentsRoutes = require('./documents.routes');
const eventosRoutes = require('./eventos.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/employees', employeesRoutes);
router.use('/documents', documentsRoutes);
router.use('/eventos', eventosRoutes);

module.exports = router;