const eventosService = require('../services/eventos.service');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Criar evento
exports.createEvent = async (req, res) => {
  try {
    const event = await eventosService.createEvent(req.body);
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar evento', error: error.message });
  }
};

// Validar evento
exports.validateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await eventosService.validateEvent(id);
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao validar evento', error: error.message });
  }
};

// Listar eventos
exports.listEvents = async (req, res) => {
  try {
    const events = await eventosService.listEvents();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar eventos', error: error.message });
  }
};

// Obter detalhes do evento
exports.getEventDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await eventosService.getEventDetails(id);
    if (!event) return res.status(404).json({ message: 'Evento não encontrado' });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter detalhes do evento', error: error.message });
  }
};