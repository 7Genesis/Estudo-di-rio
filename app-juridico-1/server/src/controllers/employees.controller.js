const employeesService = require('../services/employees.service');

// Criar funcionário
exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeesService.createEmployee(req.body);
    return res.status(201).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar funcionário', error: error.message });
  }
};

// Listar funcionários
exports.listEmployees = async (req, res) => {
  try {
    const employees = await employeesService.listEmployees();
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar funcionários', error: error.message });
  }
};

// Obter funcionário por ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeesService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter funcionário', error: error.message });
  }
};

// Atualizar funcionário
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeesService.updateEmployee(req.params.id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    return res.json(updatedEmployee);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar funcionário', error: error.message });
  }
};

// Deletar funcionário
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await employeesService.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    return res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar funcionário', error: error.message });
  }
};