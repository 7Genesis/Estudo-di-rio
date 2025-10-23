const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Função para salvar um arquivo no sistema de arquivos
const saveFile = (file) => {
  const filePath = path.join(UPLOAD_DIR, file.filename);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(filePath);
    });
  });
};

// Função para deletar um arquivo do sistema de arquivos
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Função para listar arquivos no diretório de uploads
const listFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};

module.exports = {
  saveFile,
  deleteFile,
  listFiles,
};