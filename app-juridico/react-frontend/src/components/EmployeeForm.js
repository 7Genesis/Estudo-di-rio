import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Grid, TextField, Button, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    phone: '',
    birthDate: '',
    address: ''
  });

  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'RH') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Acesso restrito ao RH.</Alert>
      </Container>
    );
  }

  const save = async () => {
    setOk('');
    setErr('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.post(`${API_URL}/employees`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOk('Funcionário salvo com sucesso!');
      onEmployeeAdded && onEmployeeAdded(resp.data);
      setForm({ name: '', email: '', cpf: '', rg: '', phone: '', birthDate: '', address: '' });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Erro ao salvar funcionário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Cadastro/Edição de Funcionário (RH)</Typography>
        {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Grid container spacing={2}>
          {[
            { key: 'name', label: 'Nome' },
            { key: 'email', label: 'Email' },
            { key: 'cpf', label: 'CPF' },
            { key: 'rg', label: 'RG' },
            { key: 'phone', label: 'Telefone' },
            { key: 'birthDate', label: 'Nascimento', type: 'date', shrink: true },
          ].map(({ key, label, type, shrink }) => (
            <Grid item xs={12} md={6} key={key}>
              <TextField
                fullWidth
                label={label}
                type={type || 'text'}
                InputLabelProps={shrink ? { shrink: true } : undefined}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Grid>
        </Grid>

        <Button sx={{ mt: 3 }} variant="contained" onClick={save} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;