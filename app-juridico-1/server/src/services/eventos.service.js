const events = []; // Array para armazenar eventos

const nextId = (arr) => (arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1);

// Criar evento
const createEvent = (payload) => {
  const event = {
    id: nextId(events),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(event);
  return event;
};

// Obter evento por ID
const getEventById = (id) => {
  return events.find(event => event.id === id);
};

// Listar eventos
const listEvents = () => {
  return events;
};

// Atualizar evento
const updateEvent = (id, updatedData) => {
  const index = events.findIndex(event => event.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updatedData, updatedAt: new Date().toISOString() };
  return events[index];
};

// Deletar evento
const deleteEvent = (id) => {
  const index = events.findIndex(event => event.id === id);
  if (index === -1) return null;
  return events.splice(index, 1)[0];
};

module.exports = {
  createEvent,
  getEventById,
  listEvents,
  updateEvent,
  deleteEvent,
};