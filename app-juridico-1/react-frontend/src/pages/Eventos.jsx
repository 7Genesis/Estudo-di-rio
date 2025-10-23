import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get('/api/eventos');
        setEventos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) return <div>Carregando eventos...</div>;
  if (error) return <div>Erro ao carregar eventos: {error}</div>;

  return (
    <div>
      <h1>Eventos</h1>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            <strong>Tipo:</strong> {evento.tipo} <br />
            <strong>Status:</strong> {evento.status} <br />
            <strong>Data:</strong> {new Date(evento.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Eventos;