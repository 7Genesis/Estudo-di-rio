import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Alert
} from '@mui/material';
import {
    Upload as UploadIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';

const API_URL = '/api';

const DocumentManager = ({ employeeId, employeeName }) => {
    const [documents, setDocuments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('Contrato');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);

    const documentTypes = [
        'Contrato',
        'RG',
        'CPF',
        'Comprovante de Residência',
        'Carteira de Trabalho',
        'Certificados',
        'Atestados',
        'Outros'
    ];

    useEffect(() => {
        if (employeeId) {
            fetchDocuments();
        }
    }, [employeeId]);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${API_URL}/employees/${employeeId}/documents`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
            setError('Erro ao carregar documentos');
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Arquivo muito grande. Tamanho máximo: 10MB');
                return;
            }
            
            setSelectedFile(file);
            if (!documentName) {
                setDocumentName(file.name);
            }
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Selecione um arquivo');
            return;
        }

        if (!documentName.trim()) {
            setError('Digite um nome para o documento');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', documentName);
        formData.append('type', documentType);
        formData.append('description', description);

        try {
            await axios.post(
                `${API_URL}/employees/${employeeId}/documents`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Documento enviado com sucesso!');
            setOpenDialog(false);
            resetForm();
            fetchDocuments();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            const errorMsg = error.response?.data?.message || 'Erro ao enviar documento';
            setError(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (docId, originalName) => {
        try {
            const response = await axios.get(
                `${API_URL}/employees/${employeeId}/documents/${docId}/download`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar documento:', error);
            setError('Erro ao baixar documento');
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Deseja realmente deletar este documento?')) return;

        try {
            await axios.delete(`${API_URL}/employees/${employeeId}/documents/${docId}`);
            setSuccess('Documento removido com sucesso!');
            fetchDocuments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao deletar documento:', error);
            setError('Erro ao remover documento');
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setDocumentName('');
        setDocumentType('Contrato');
        setDescription('');
        setError('');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                        Documentos - {employeeName}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Adicionar Documento
                    </Button>
                </Box>

                {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>Tipo</strong></TableCell>
                                <TableCell><strong>Nome</strong></TableCell>
                                <TableCell><strong>Descrição</strong></TableCell>
                                <TableCell><strong>Tamanho</strong></TableCell>
                                <TableCell><strong>Data Upload</strong></TableCell>
                                <TableCell align="center"><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="textSecondary" sx={{ py: 3 }}>
                                            Nenhum documento cadastrado
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documents.map((doc) => (
                                    <TableRow key={doc.id} hover>
                                        <TableCell>
                                            <Chip label={doc.type} size="small" color="primary" />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                {doc.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{doc.description || '-'}</TableCell>
                                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                                        <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleDownload(doc.id, doc.originalName)}
                                                title="Baixar"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(doc.id)}
                                                title="Deletar"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog 
                open={openDialog} 
                onClose={() => { 
                    if (!uploading) {
                        setOpenDialog(false); 
                        resetForm(); 
                    }
                }} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>Adicionar Documento</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={uploading}
                        >
                            {selectedFile ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
                            <input
                                type="file"
                                hidden
                                onChange={handleFileSelect}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
                            />
                        </Button>

                        {selectedFile && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <strong>Arquivo selecionado:</strong><br />
                                {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Nome do Documento"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            margin="normal"
                            required
                            disabled={uploading}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Tipo de Documento</InputLabel>
                            <Select
                                value={documentType}
                                label="Tipo de Documento"
                                onChange={(e) => setDocumentType(e.target.value)}
                                disabled={uploading}
                            >
                                {documentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Descrição (opcional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                            disabled={uploading}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => { 
                            setOpenDialog(false); 
                            resetForm(); 
                        }}
                        disabled={uploading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleUpload} 
                        variant="contained" 
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Enviando...' : 'Enviar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DocumentManager;