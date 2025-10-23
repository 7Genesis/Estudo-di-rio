import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    AppBar, 
    Toolbar, 
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline
} from '@mui/material';
import {
    People as PeopleIcon,
    Add as AddIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';

const drawerWidth = 240;

function Dashboard() {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Dashboard
            </Typography>
            {/* Adicione estatísticas e gráficos aqui */}
        </Box>
    );
}

function App() {
    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Sistema RH - Gestão de Funcionários
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { 
                            width: drawerWidth, 
                            boxSizing: 'border-box' 
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem button component={Link} to="/">
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                            <ListItem button component={Link} to="/funcionarios">
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Funcionários" />
                            </ListItem>
                            <ListItem button component={Link} to="/adicionar">
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Adicionar" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/funcionarios" element={<EmployeeList />} />
                        <Route 
                            path="/adicionar" 
                            element={
                                <EmployeeForm 
                                    onEmployeeAdded={() => window.location.href = '/funcionarios'} 
                                />
                            } 
                        />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;