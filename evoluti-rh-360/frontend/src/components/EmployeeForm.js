import React, { useState } from 'react';
import axios from 'axios';
import { 
    TextField, 
    Button, 
    Box, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel 
} from '@mui/material';

const EmployeeForm = ({ onEmployeeAdded }) => {
    const [formData, setFormData] = useState({
        nome: '',
        cargo: '',
        departamento: '',
        salario: '',
        status: 'Ativo'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/employees', formData);
            setFormData({
                nome: '',
                cargo: '',
                departamento: '',
                salario: '',
                status: 'Ativo'
            });
            onEmployeeAdded();
        } catch (error) {
            console.error('Erro ao adicionar funcionário:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ m: 2 }}>
            <TextField
                fullWidth
                margin="normal"
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="cargo"
                label="Cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="departamento"
                label="Departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="salario"
                label="Salário"
                type="number"
                value={formData.salario}
                onChange={handleChange}
                required
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="Ativo">Ativo</MenuItem>
                    <MenuItem value="Inativo">Inativo</MenuItem>
                    <MenuItem value="Férias">Férias</MenuItem>
                </Select>
            </FormControl>
            <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
            >
                Adicionar Funcionário
            </Button>
        </Box>
    );
};

export default EmployeeForm;