import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Grid, TextField, Button, Alert, Box,
  FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Card, CardContent, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete,
  FormControlLabel, Checkbox
} from '@mui/material';
import { Calculate as CalculateIcon, Edit as EditIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TerminationCalculator = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    salary: '',
    position: '',
    corporateEmail: '',
    admissionDate: ''
  });
  
  const [calcForm, setCalcForm] = useState({
    terminationType: 'SEM_JUSTA_CAUSA',
    terminationDate: new Date().toISOString().split('T')[0],
    hasNotice: true,
    workedNotice: false
  });

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(r.data || []);
    } catch (e) {
      setError('Erro ao carregar funcionários');
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const openEdit = (emp) => {
    setEditForm({
      salary: emp.salary || '',
      position: emp.position || emp.cargo || '',
      corporateEmail: emp.corporateEmail || '',
      admissionDate: emp.admissionDate || emp.dataAdmissao || ''
    });
    setEditDialog(true);
  };

  const saveEmploymentData = async () => {
    if (!selectedEmployee) return;
    setError(''); setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/employees/${selectedEmployee.id}/employment-data`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('✅ Dados atualizados com sucesso');
      setEditDialog(false);
      fetchEmployees();
      // Atualizar funcionário selecionado
      const updated = employees.find(e => e.id === selectedEmployee.id);
      if (updated) {
        setSelectedEmployee({ ...updated, ...editForm });
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao atualizar dados');
    }
  };

  const calculate = async () => {
    if (!selectedEmployee) {
      setError('Selecione um funcionário');
      return;
    }
    
    setError(''); setSuccess(''); setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const r = await axios.post(
        `${API_URL}/employees/${selectedEmployee.id}/calculate-termination`,
        calcForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCalculation(r.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao calcular rescisão');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cálculo de Rescisão de Contrato
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Grid container spacing={3}>
          {/* Seleção de Funcionário */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>1. Selecionar Funcionário</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(opt) => `${opt.name} - ${opt.email} ${opt.corporateEmail ? `(${opt.corporateEmail})` : ''}`}
                      value={selectedEmployee}
                      onChange={(e, newValue) => {
                        setSelectedEmployee(newValue);
                        setCalculation(null);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Buscar funcionário" placeholder="Digite o nome ou email" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={!selectedEmployee}
                      onClick={() => openEdit(selectedEmployee)}
                      startIcon={<EditIcon />}
                    >
                      Editar Dados Trabalhistas
                    </Button>
                  </Grid>
                </Grid>

                {selectedEmployee && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Cargo</Typography>
                        <Typography variant="body2"><strong>{selectedEmployee.position || selectedEmployee.cargo || '-'}</strong></Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Salário</Typography>
                        <Typography variant="body2"><strong>{selectedEmployee.salary ? formatCurrency(selectedEmployee.salary) : '-'}</strong></Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Data Admissão</Typography>
                        <Typography variant="body2"><strong>{selectedEmployee.admissionDate || selectedEmployee.dataAdmissao || '-'}</strong></Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Email Corporativo</Typography>
                        <Typography variant="body2"><strong>{selectedEmployee.corporateEmail || '-'}</strong></Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Parâmetros da Rescisão */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>2. Configurar Rescisão</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Rescisão</InputLabel>
                      <Select
                        value={calcForm.terminationType}
                        label="Tipo de Rescisão"
                        onChange={(e) => setCalcForm({...calcForm, terminationType: e.target.value})}
                      >
                        <MenuItem value="SEM_JUSTA_CAUSA">Sem Justa Causa</MenuItem>
                        <MenuItem value="COM_JUSTA_CAUSA">Com Justa Causa</MenuItem>
                        <MenuItem value="PEDIDO_DEMISSAO">Pedido de Demissão</MenuItem>
                        <MenuItem value="ACORDO">Acordo (Art. 484-A)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Rescisão"
                      InputLabelProps={{ shrink: true }}
                      value={calcForm.terminationDate}
                      onChange={(e) => setCalcForm({...calcForm, terminationDate: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={calcForm.hasNotice}
                            onChange={(e) => setCalcForm({...calcForm, hasNotice: e.target.checked})}
                          />
                        }
                        label="Aviso Prévio"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={calcForm.workedNotice}
                            disabled={!calcForm.hasNotice}
                            onChange={(e) => setCalcForm({...calcForm, workedNotice: e.target.checked})}
                          />
                        }
                        label="Aviso Trabalhado"
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!selectedEmployee || loading}
                  onClick={calculate}
                  startIcon={<CalculateIcon />}
                >
                  {loading ? 'Calculando...' : 'Calcular Rescisão'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Resultado */}
          {calculation && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>3. Resultado do Cálculo</Typography>
                  
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption">Funcionário</Typography>
                        <Typography variant="body2"><strong>{calculation.employeeName}</strong></Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption">Período Trabalhado</Typography>
                        <Typography variant="body2">
                          <strong>
                            {calculation.workPeriod.years} ano(s), {calculation.workPeriod.months} mês(es), {calculation.workPeriod.days} dia(s)
                          </strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption">Tipo de Rescisão</Typography>
                        <Typography variant="body2"><strong>{calculation.terminationType.replace(/_/g, ' ')}</strong></Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Verbas Rescisórias</strong></TableCell>
                          <TableCell align="right"><strong>Valor</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Salário Proporcional</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.salarioProporcional)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>13º Salário Proporcional</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.decimoTerceiroProp)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Férias Proporcionais + 1/3</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.feriasProporcionais)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Férias Vencidas + 1/3</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.feriasVencidas)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Aviso Prévio Indenizado</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.avisoPrevoIndenizado)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Multa 40% FGTS</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.multaFGTS)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Saldo FGTS</TableCell>
                          <TableCell align="right">{formatCurrency(calculation.values.saldoFGTS)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}><Divider /></TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'success.light' }}>
                          <TableCell><strong>TOTAL A RECEBER</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(calculation.total)}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Atenção:</strong> Este é um cálculo estimativo. Consulte um contador ou advogado trabalhista para valores exatos.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Dialog Editar Dados Trabalhistas */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Dados Trabalhistas</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cargo/Função"
                value={editForm.position}
                onChange={(e) => setEditForm({...editForm, position: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Salário Mensal (R$)"
                type="number"
                value={editForm.salary}
                onChange={(e) => setEditForm({...editForm, salary: e.target.value})}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Data de Admissão"
                InputLabelProps={{ shrink: true }}
                value={editForm.admissionDate}
                onChange={(e) => setEditForm({...editForm, admissionDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Corporativo"
                type="email"
                value={editForm.corporateEmail}
                onChange={(e) => setEditForm({...editForm, corporateEmail: e.target.value})}
                placeholder="funcionario@empresa.com"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveEmploymentData}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TerminationCalculator;