import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Alert, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box,
  Tabs, Tab
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Description as ContractIcon, CloudUpload as UploadIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edição inline
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  
  // Modais
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [contractDialog, setContractDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Contrato
  const [contractTab, setContractTab] = useState(0); // 0=URL, 1=Upload
  const [contractUrl, setContractUrl] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(r.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao carregar funcionários');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // Editar
  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditForm({ ...emp });
    setEditDialog(true);
  };

  const saveEdit = async () => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/employees/${selectedEmployee.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('✅ Funcionário editado com sucesso');
      setEditDialog(false);
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao editar');
    }
  };

  // Deletar
  const openDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/employees/${selectedEmployee.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('✅ Funcionário deletado com sucesso');
      setDeleteDialog(false);
      setSelectedEmployee(null);
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error('❌ Erro ao deletar:', e);
      setError(e?.response?.data?.message || 'Erro ao deletar');
      setDeleteDialog(false);
    }
  };

  // Contrato
  const openContract = (emp) => {
    setSelectedEmployee(emp);
    setContractUrl(emp.contractUrl || '');
    setContractFile(null);
    setContractTab(0);
    setContractDialog(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Arquivo muito grande. Máximo: 5MB');
        return;
      }
      setContractFile(file);
      setError('');
    }
  };

  const saveContract = async () => {
    setError(''); setSuccess('');
    setUploadLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      let payload = {};
      
      if (contractTab === 0) {
        // URL
        if (!contractUrl) {
          setError('Informe a URL do contrato');
          setUploadLoading(false);
          return;
        }
        payload = { contractUrl };
      } else {
        // Upload
        if (!contractFile) {
          setError('Selecione um arquivo PDF');
          setUploadLoading(false);
          return;
        }
        
        // Converter para base64
        const reader = new FileReader();
        reader.readAsDataURL(contractFile);
        await new Promise((resolve) => {
          reader.onload = () => {
            payload = {
              contractFile: reader.result, // base64
              contractFileName: contractFile.name
            };
            resolve();
          };
        });
      }
      
      await axios.post(`${API_URL}/employees/${selectedEmployee.id}/contract`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('✅ Contrato vinculado com sucesso');
      setContractDialog(false);
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao vincular contrato');
    } finally {
      setUploadLoading(false);
    }
  };

  const downloadContract = async (empId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/employees/${empId}/contract/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'contrato.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      setError('Erro ao baixar contrato');
    }
  };

  // Edição inline de salário/cargo
  const startInlineEdit = (emp) => {
    setEditingId(emp.id);
    setEditingData({
      salary: emp.salary || '',
      position: emp.position || '',
      corporateEmail: emp.corporateEmail || ''
    });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const saveInlineEdit = async (empId) => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/employees/${empId}/employment-data`, editingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('✅ Dados atualizados');
      setEditingId(null);
      setEditingData({});
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro ao atualizar');
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando funcionários...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Funcionários Aprovados</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Email Corp.</strong></TableCell>
                <TableCell><strong>Cargo</strong></TableCell>
                <TableCell><strong>Salário</strong></TableCell>
                <TableCell><strong>CPF</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Contrato</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Nenhum funcionário aprovado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : employees.map(emp => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.name || '-'}</TableCell>
                  <TableCell>{emp.email || '-'}</TableCell>
                  <TableCell>
                    {editingId === emp.id ? (
                      <TextField
                        size="small"
                        value={editingData.corporateEmail}
                        onChange={(e) => setEditingData({...editingData, corporateEmail: e.target.value})}
                        placeholder="email@empresa.com"
                        sx={{ minWidth: 180 }}
                      />
                    ) : (
                      emp.corporateEmail || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === emp.id ? (
                      <TextField
                        size="small"
                        value={editingData.position}
                        onChange={(e) => setEditingData({...editingData, position: e.target.value})}
                        placeholder="Cargo"
                        sx={{ minWidth: 150 }}
                      />
                    ) : (
                      emp.position || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === emp.id ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editingData.salary}
                        onChange={(e) => setEditingData({...editingData, salary: e.target.value})}
                        placeholder="0.00"
                        sx={{ minWidth: 120 }}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      />
                    ) : (
                      formatCurrency(emp.salary)
                    )}
                  </TableCell>
                  <TableCell>{emp.cpf || '-'}</TableCell>
                  <TableCell>{emp.cellphone || emp.phone || '-'}</TableCell>
                  <TableCell>
                    {(emp.contractUrl || emp.contractFile) ? (
                      <Chip 
                        label={emp.contractFile ? 'PDF' : 'URL'}
                        color="primary" 
                        size="small" 
                        icon={<ContractIcon />}
                        onClick={() => {
                          if (emp.contractFile) {
                            downloadContract(emp.id, emp.contractFileName);
                          } else {
                            window.open(emp.contractUrl, '_blank');
                          }
                        }}
                        clickable
                      />
                    ) : (
                      <Chip label="Sem contrato" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingId === emp.id ? (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => saveInlineEdit(emp.id)}
                          title="Salvar"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={cancelInlineEdit}
                          title="Cancelar"
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => startInlineEdit(emp)}
                          title="Editar Cargo/Salário"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => openEdit(emp)} 
                          title="Editar Dados Completos"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="secondary" 
                          onClick={() => openContract(emp)} 
                          title="Vincular Contrato"
                        >
                          <ContractIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => openDelete(emp)} 
                          title="Deletar"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Editar - atualizar com novos campos */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Funcionário</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Nome Completo" 
                value={editForm.name || ''} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Email Pessoal" 
                type="email" 
                value={editForm.email || ''} 
                onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Email Corporativo" 
                type="email" 
                value={editForm.corporateEmail || ''} 
                onChange={(e) => setEditForm({...editForm, corporateEmail: e.target.value})} 
                placeholder="funcionario@empresa.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Cargo/Função" 
                value={editForm.position || ''} 
                onChange={(e) => setEditForm({...editForm, position: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="Salário (R$)" 
                type="number"
                value={editForm.salary || ''} 
                onChange={(e) => setEditForm({...editForm, salary: e.target.value})} 
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="CPF" 
                value={editForm.cpf || ''} 
                onChange={(e) => setEditForm({...editForm, cpf: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                label="RG" 
                value={editForm.rg || ''} 
                onChange={(e) => setEditForm({...editForm, rg: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Telefone/Celular" 
                value={editForm.cellphone || editForm.phone || ''} 
                onChange={(e) => setEditForm({...editForm, cellphone: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Data Nascimento" 
                InputLabelProps={{ shrink: true }}
                value={editForm.birthDate || ''} 
                onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                type="date" 
                label="Data de Admissão" 
                InputLabelProps={{ shrink: true }}
                value={editForm.admissionDate || ''} 
                onChange={(e) => setEditForm({...editForm, admissionDate: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Endereço" 
                multiline 
                rows={2} 
                value={editForm.address || ''} 
                onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveEdit}>Salvar Alterações</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Deletar */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar o funcionário <strong>{selectedEmployee?.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Contrato */}
      <Dialog open={contractDialog} onClose={() => setContractDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vincular Contrato</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Funcionário: <strong>{selectedEmployee?.name}</strong>
            </Typography>
            
            <Tabs value={contractTab} onChange={(e, v) => setContractTab(v)} sx={{ mt: 2, mb: 2 }}>
              <Tab label="URL/Link" />
              <Tab label="Upload PDF" />
            </Tabs>

            {contractTab === 0 ? (
              <TextField 
                fullWidth 
                label="URL do Contrato" 
                placeholder="https://drive.google.com/file/d/..." 
                value={contractUrl}
                onChange={(e) => setContractUrl(e.target.value)}
                helperText="Cole o link público do contrato"
              />
            ) : (
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {contractFile ? contractFile.name : 'Selecionar PDF (máx 5MB)'}
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {contractFile && (
                  <Alert severity="success">
                    Arquivo selecionado: {contractFile.name} ({(contractFile.size / 1024).toFixed(2)} KB)
                  </Alert>
                )}
              </Box>
            )}

            {selectedEmployee?.contractUrl && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Contrato atual (URL): <a href={selectedEmployee.contractUrl} target="_blank" rel="noopener noreferrer">Visualizar</a>
              </Alert>
            )}
            {selectedEmployee?.contractFile && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Contrato atual (PDF): {selectedEmployee.contractFileName}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContractDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={saveContract} 
            disabled={uploadLoading || (contractTab === 0 ? !contractUrl : !contractFile)}
          >
            {uploadLoading ? 'Salvando...' : 'Salvar Contrato'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeList;