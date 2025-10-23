const express = require('express');
const { 
  uploadDocument, 
  getDocumentsByEmployee, 
  approveDocument, 
  rejectDocument, 
  requestDocumentChanges, 
  downloadDocument 
} = require('../controllers/documents.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router();

// Upload document
router.post('/:id/documents', authenticateToken, authorizeRole('FUNCIONARIO', 'ADMIN'), uploadDocument);

// List documents by employee
router.get('/:id/documents', authenticateToken, authorizeRole('RH', 'ADMIN'), getDocumentsByEmployee);

// Approve document
router.patch('/documents/:docId/approve', authenticateToken, authorizeRole('RH', 'ADMIN'), approveDocument);

// Reject document
router.patch('/documents/:docId/reject', authenticateToken, authorizeRole('RH', 'ADMIN'), rejectDocument);

// Request changes for document
router.patch('/documents/:docId/request-changes', authenticateToken, authorizeRole('RH', 'ADMIN'), requestDocumentChanges);

// Download document
router.get('/documents/:docId/download', authenticateToken, authorizeRole('RH', 'ADMIN', 'FUNCIONARIO'), downloadDocument);

module.exports = router;