const employees = [];

// Função para adicionar um novo funcionário
const addEmployee = (employeeData) => {
  const id = employees.length + 1;
  const newEmployee = { id, ...employeeData };
  employees.push(newEmployee);
  return newEmployee;
};

// Função para listar todos os funcionários
const listEmployees = () => {
  return employees;
};

// Função para encontrar um funcionário pelo ID
const findEmployeeById = (id) => {
  return employees.find(employee => employee.id === id);
};

// Função para atualizar os dados de um funcionário
const updateEmployee = (id, updatedData) => {
  const index = employees.findIndex(employee => employee.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...updatedData };
  return employees[index];
};

// Função para deletar um funcionário
const deleteEmployee = (id) => {
  const index = employees.findIndex(employee => employee.id === id);
  if (index === -1) return null;
  return employees.splice(index, 1)[0];
};

module.exports = {
  addEmployee,
  listEmployees,
  findEmployeeById,
  updateEmployee,
  deleteEmployee
};