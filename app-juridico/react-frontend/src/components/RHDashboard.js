import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RHDashboard = () => {
  const [pending, setPending] = useState([]);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  const fetchPending = async () => {
    setErr('');
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(`${API_URL}/rh/pending-employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPending(r.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Erro ao carregar pendentes');
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id) => {
    setOk(''); setErr('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/rh/approve-employee/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOk('Aprovado com sucesso');
      fetchPending();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Erro ao aprovar');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Pendentes</Typography>
        {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">Nenhum pendente</TableCell></TableRow>
              ) : pending.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.name || '-'}</TableCell>
                  <TableCell>{p.email || '-'}</TableCell>
                  <TableCell>{p.cpf || '-'}</TableCell>
                  <TableCell>
                    <Button variant="contained" size="small" onClick={() => approve(p.id)}>Aprovar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default RHDashboard;