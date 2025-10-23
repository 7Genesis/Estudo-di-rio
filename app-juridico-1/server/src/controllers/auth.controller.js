const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Função para login
const login = (req, res) => {
  const { username, password } = req.body;

  // Aqui você deve validar as credenciais do usuário
  // Exemplo: buscar usuário no banco de dados

  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Credenciais inválidas' });
};

// Função para registro (exemplo)
const register = (req, res) => {
  const { username, password } = req.body;

  // Aqui você deve implementar a lógica para registrar um novo usuário
  // Exemplo: salvar usuário no banco de dados

  return res.status(201).json({ message: 'Usuário registrado com sucesso' });
};

// Exportar as funções
module.exports = {
  login,
  register,
};