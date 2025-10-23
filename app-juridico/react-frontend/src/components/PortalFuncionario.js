import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Grid, TextField, Button, Alert, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PortalFuncionario = ({ user }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    phone: '',
    birthDate: '',
    address: '',
    gender: '',
    sexualOrientation: '' // NOVO CAMPO
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  // Preencher email do usuário ao carregar
  useEffect(() => {
    if (user?.username) {
      setForm(prev => ({
        ...prev,
        email: user.username,
        name: user.name || ''
      }));
    }
  }, [user]);

  const validateCPF = (cpf) => {
    const clean = cpf.replace(/\D/g, '');
    return clean.length === 11;
  };

  const formatCPF = (value) => {
    const clean = value.replace(/\D/g, '').slice(0, 11);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0,3)}.${clean.slice(3)}`;
    if (clean.length <= 9) return `${clean.slice(0,3)}.${clean.slice(3,6)}.${clean.slice(6)}`;
    return `${clean.slice(0,3)}.${clean.slice(3,6)}.${clean.slice(6,9)}-${clean.slice(9)}`;
  };

  const formatPhone = (value) => {
    const clean = value.replace(/\D/g, '').slice(0, 11);
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `(${clean.slice(0,2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0,2)}) ${clean.slice(2,6)}-${clean.slice(6)}`;
    return `(${clean.slice(0,2)}) ${clean.slice(2,7)}-${clean.slice(7)}`;
  };

  const submit = async () => {
    setOk(''); setErr('');
    
    // Validações
    if (!form.name || !form.email || !form.cpf) {
      setErr('Preencha os campos obrigatórios: Nome, Email e CPF');
      return;
    }
    
    if (!validateCPF(form.cpf)) {
      setErr('CPF inválido. Digite 11 dígitos.');
      return;
    }
    
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setErr('Email inválido');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/employee/self-data`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOk('✅ Dados enviados para análise do RH com sucesso!');
      
      // Limpar apenas os campos preenchidos (mantém email)
      setTimeout(() => {
        setForm({
          name: '',
          email: user?.username || '',
          cpf: '',
          rg: '',
          phone: '',
          birthDate: '',
          address: '',
          gender: '',
          sexualOrientation: '' // NOVO CAMPO
        });
        setOk('');
      }, 2000);
    } catch (e) {
      console.error('Erro ao enviar dados:', e?.response?.data);
      setErr(e?.response?.data?.message || 'Erro ao enviar dados');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Complete seu cadastro
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Preencha seus dados pessoais. Campos com <strong>*</strong> são obrigatórios.
        </Typography>

        {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              required
              label="Nome Completo" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              disabled={loading}
              error={!form.name}
              helperText={!form.name ? 'Campo obrigatório' : ''}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              required
              label="Email Pessoal" 
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              disabled={loading}
              error={!form.email}
              helperText={form.email ? 'Email usado no login' : 'Campo obrigatório'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              required
              label="CPF" 
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(e) => setForm({...form, cpf: formatCPF(e.target.value)})}
              disabled={loading}
              error={!form.cpf || (form.cpf && !validateCPF(form.cpf))}
              helperText={!form.cpf ? 'Campo obrigatório' : (!validateCPF(form.cpf) ? 'CPF inválido (11 dígitos)' : '')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="RG" 
              placeholder="00.000.000-0"
              value={form.rg}
              onChange={(e) => setForm({...form, rg: e.target.value})}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Telefone" 
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: formatPhone(e.target.value)})}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              type="date" 
              label="Data de Nascimento" 
              InputLabelProps={{ shrink: true }}
              value={form.birthDate}
              onChange={(e) => setForm({...form, birthDate: e.target.value})}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Endereço Completo" 
              placeholder="Rua, número, bairro, cidade - UF"
              multiline
              rows={2}
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sexo</InputLabel>
              <Select value={form.gender} label="Sexo"
                onChange={(e) => setForm({...form, gender: e.target.value})}>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
                <MenuItem value="Prefiro não informar">Prefiro não informar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <InputLabel>Orientação Sexual</InputLabel>
              <Select value={form.sexualOrientation} label="Orientação Sexual"
                onChange={(e) => setForm({...form, sexualOrientation: e.target.value})}>
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="Heterossexual">Heterossexual</MenuItem>
                <MenuItem value="Homossexual">Homossexual</MenuItem>
                <MenuItem value="Bissexual">Bissexual</MenuItem>
                <MenuItem value="Pansexual">Pansexual</MenuItem>
                <MenuItem value="Assexual">Assexual</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
                <MenuItem value="Prefiro não informar">Prefiro não informar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              setForm({
                name: '',
                email: user?.username || '',
                cpf: '',
                rg: '',
                phone: '',
                birthDate: '',
                address: '',
                gender: '',
                sexualOrientation: '' // NOVO CAMPO
              });
              setErr('');
              setOk('');
            }}
            disabled={loading}
          >
            Limpar
          </Button>
          <Button 
            variant="contained" 
            onClick={submit} 
            disabled={loading || !form.name || !form.email || !form.cpf || !validateCPF(form.cpf)}
          >
            {loading ? 'Enviando...' : 'Enviar ao RH'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortalFuncionario;