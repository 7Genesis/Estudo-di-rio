import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Tabs, Tab } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = ({ onLogin }) => {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitEmployee = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const email = employeeEmail.trim().toLowerCase();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!re.test(email)) { 
        setError('Email inválido'); 
        setLoading(false); 
        return; 
      }
      
      console.log('🔵 Enviando para:', `${API_URL}/auth/employee-start`);
      console.log('🔵 Email:', email);
      
      const r = await axios.post(`${API_URL}/auth/employee-start`, { email });
      
      console.log('✅ Resposta:', r.data);
      
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      localStorage.setItem('selectedProfile', 'FUNCIONARIO');
      
      if (onLogin) {
        onLogin(r.data.user);
      }
    } catch (err) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Response:', err?.response?.data);
      console.error('❌ Status:', err?.response?.status);
      setError(err?.response?.data?.message || err?.message || 'Erro ao entrar como funcionário');
    } finally { 
      setLoading(false); 
    }
  };

  const submitRH = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const r = await axios.post(`${API_URL}/auth/login`, {
        username: loginData.username.trim().toLowerCase(),
        password: loginData.password
      });
      
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      localStorage.setItem('selectedProfile', 'RH');
      
      if (onLogin) {
        onLogin(r.data.user);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao fazer login');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sistema RH
        </Typography>
        
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered sx={{ mb: 2 }}>
          <Tab label="Funcionário" />
          <Tab label="RH/Admin" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {tab === 0 && (
          <Box component="form" onSubmit={submitEmployee}>
            <TextField 
              fullWidth 
              label="Seu e-mail" 
              type="email" 
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)} 
              required 
              margin="normal"
              placeholder="seu.email@empresa.com"
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Entrando...' : 'Entrar como Funcionário'}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={submitRH}>
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} 
              required 
              margin="normal"
            />
            <TextField 
              fullWidth 
              label="Senha" 
              type="password" 
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
              required 
              margin="normal"
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Entrando...' : 'Entrar (RH/Admin)'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;