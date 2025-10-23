import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Grid, 
    Paper, 
    Typography, 
    Box,
    Card,
    CardContent
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const API_URL = '/api'; // Mude aqui também

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        media: 0,
        max: 0,
        min: 0,
        byStatus: {},
        top: []
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${API_URL}/dashboard`);
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao buscar dashboard:', error);
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Dashboard - Estatísticas
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Funcionários
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.total}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Média Salarial
                                    </Typography>
                                    <Typography variant="h5">
                                        R$ {stats.media.toFixed(2)}
                                    </Typography>
                                </Box>
                                <AttachMoneyIcon sx={{ fontSize: 48, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Maior Salário
                                    </Typography>
                                    <Typography variant="h5">
                                        R$ {stats.max.toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ fontSize: 48, color: 'error.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Menor Salário
                                    </Typography>
                                    <Typography variant="h5">
                                        R$ {stats.min.toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingDownIcon sx={{ fontSize: 48, color: 'warning.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Status dos Funcionários
                        </Typography>
                        {Object.entries(stats.byStatus).map(([status, count]) => (
                            <Box key={status} sx={{ mb: 1 }}>
                                <Typography>
                                    {status}: <strong>{count}</strong>
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Top 3 Maiores Salários
                        </Typography>
                        {stats.top.map((emp, idx) => (
                            <Box key={emp.id} sx={{ mb: 1 }}>
                                <Typography>
                                    {idx + 1}. {emp.name} - R$ {Number(emp.salary).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;cd "/Users/macbook/Estudo-di-rio/app-juridico"
npm start