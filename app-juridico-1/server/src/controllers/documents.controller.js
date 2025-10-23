const documentsService = require('../services/documents.service');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

exports.uploadDocument = async (req, res) => {
  try {
    const document = await documentsService.uploadDocument(req.params.id, req.file);
    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer upload do documento', error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await documentsService.getDocuments(req.params.id);
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar documentos', error: error.message });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const document = await documentsService.approveDocument(req.params.docId);
    return res.json(document);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao aprovar documento', error: error.message });
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const document = await documentsService.rejectDocument(req.params.docId, req.body.reason);
    return res.json(document);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao reprovar documento', error: error.message });
  }
};

exports.requestChanges = async (req, res) => {
  try {
    const document = await documentsService.requestChanges(req.params.docId, req.body.comment);
    return res.json(document);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao solicitar ajustes', error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const file = await documentsService.downloadDocument(req.params.docId);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    return res.sendFile(file.path);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao baixar documento', error: error.message });
  }
};