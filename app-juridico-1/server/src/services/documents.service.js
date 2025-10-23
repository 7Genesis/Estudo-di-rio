const documents = [];

// Função para criar um novo documento
const createDocument = (employeeId, type, notes, expiryDate) => {
  const id = documents.length + 1;
  const newDocument = {
    id,
    employeeId,
    type,
    status: 'PENDENTE',
    notes,
    expiryDate: expiryDate || null,
    currentVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  documents.push(newDocument);
  return newDocument;
};

// Função para listar documentos de um funcionário
const getDocumentsByEmployeeId = (employeeId) => {
  return documents.filter(doc => doc.employeeId === employeeId);
};

// Função para aprovar um documento
const approveDocument = (docId) => {
  const doc = documents.find(d => d.id === docId);
  if (doc) {
    doc.status = 'APROVADO';
    doc.updatedAt = new Date().toISOString();
    return doc;
  }
  return null;
};

// Função para reprovar um documento
const rejectDocument = (docId, reason) => {
  const doc = documents.find(d => d.id === docId);
  if (doc) {
    doc.status = 'REPROVADO';
    doc.notes = reason;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }
  return null;
};

// Função para solicitar ajustes em um documento
const requestDocumentChanges = (docId, comment) => {
  const doc = documents.find(d => d.id === docId);
  if (doc) {
    doc.status = 'AJUSTES_SOLICITADOS';
    doc.notes = comment;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }
  return null;
};

// Função para obter detalhes de um documento
const getDocumentById = (docId) => {
  return documents.find(d => d.id === docId);
};

// Função para excluir um documento
const deleteDocument = (docId) => {
  const index = documents.findIndex(d => d.id === docId);
  if (index !== -1) {
    return documents.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  createDocument,
  getDocumentsByEmployeeId,
  approveDocument,
  rejectDocument,
  requestDocumentChanges,
  getDocumentById,
  deleteDocument,
};