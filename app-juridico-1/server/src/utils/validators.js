const { isEmail, isCPF } = require('validator');

const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email é obrigatório' };
  }
  if (!isEmail(email)) {
    return { valid: false, message: 'Email inválido' };
  }
  return { valid: true };
};

const validateCPF = (cpf) => {
  if (!cpf) {
    return { valid: false, message: 'CPF é obrigatório' };
  }
  const cleanedCpf = String(cpf).replace(/\D/g, '');
  if (cleanedCpf.length !== 11) {
    return { valid: false, message: 'CPF deve ter 11 dígitos' };
  }
  if (!isCPF(cleanedCpf)) {
    return { valid: false, message: 'CPF inválido' };
  }
  return { valid: true };
};

const validateEmployeeData = (data) => {
  const { name, email, cpf } = data;
  const emailValidation = validateEmail(email);
  const cpfValidation = validateCPF(cpf);

  if (!name) {
    return { valid: false, message: 'Nome é obrigatório' };
  }
  if (!emailValidation.valid) {
    return emailValidation;
  }
  if (!cpfValidation.valid) {
    return cpfValidation;
  }
  return { valid: true };
};

module.exports = {
  validateEmail,
  validateCPF,
  validateEmployeeData,
};