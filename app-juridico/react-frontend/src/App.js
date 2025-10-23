import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Stack, Tabs, Tab, Alert, Snackbar, IconButton } from '@mui/material';
import { Logout as LogoutIcon, Download as DownloadIcon, Close as CloseIcon } from '@mui/icons-material';
import Login from './components/Login';
import ProfileSelector from './components/ProfileSelector';
import PortalFuncionario from './components/PortalFuncionario';
import RHDashboard from './components/RHDashboard';
import EmployeeList from './components/EmployeeList';
import TerminationCalculator from './components/TerminationCalculator';

const userCan = (u, profile) => {
  if (!u) return false;
  if (u.role === 'ADMIN') return true;
  if (profile === 'RH') return u.role === 'RH' || u.profiles?.includes?.('RH');
  if (profile === 'FUNCIONARIO') return u.role === 'FUNCIONARIO' || u.profiles?.includes?.('FUNCIONARIO');
  return false;
};

function App() {
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rhTab, setRhTab] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('selectedProfile');
    if (token && savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      if (savedProfile && userCan(u, savedProfile)) {
        setSelectedProfile(savedProfile);
      } else if (userCan(u, 'FUNCIONARIO') && !userCan(u, 'RH')) {
        setSelectedProfile('FUNCIONARIO');
        localStorage.setItem('selectedProfile', 'FUNCIONARIO');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Detectar se pode instalar PWA
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const logout = () => { localStorage.clear(); setUser(null); setSelectedProfile(null); };

  if (loading) return null;
  if (!user) return <Login onLogin={setUser} />;
  if (!selectedProfile) return <ProfileSelector user={user} onSelectProfile={(p)=>{ if(userCan(user,p)){ setSelectedProfile(p); localStorage.setItem('selectedProfile', p); } }} />;

  if (selectedProfile === 'FUNCIONARIO' && !userCan(user,'RH')) {
    return (
      <Box>
        <AppBar position="static"><Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Portal do Funcionário</Typography>
          <Button color="inherit" onClick={logout}>Sair</Button>
        </Toolbar></AppBar>
        <PortalFuncionario user={user} />
      </Box>
    );
  }

  // RH/Admin
  if (selectedProfile === 'RH' || (selectedProfile === 'ADMIN' && user?.role === 'ADMIN')) {
    return (
      <Box>
        <AppBar position="static"><Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Portal RH</Typography>
          <Button color="inherit" onClick={logout}>Sair</Button>
        </Toolbar></AppBar>
        
        <Tabs value={rhTab} onChange={(e, v) => setRhTab(v)} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Pendentes" />
          <Tab label="Funcionários" />
          <Tab label="Cálculo de Rescisão" />
        </Tabs>
        
        {rhTab === 0 && <RHDashboard />}
        {rhTab === 1 && <EmployeeList />}
        {rhTab === 2 && <TerminationCalculator />}
      </Box>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Sistema RH</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/">Pendentes</Button>
            <Button color="inherit" component={Link} to="/employees">Funcionários</Button>
            <Button color="inherit" onClick={()=>{ setSelectedProfile(null); localStorage.removeItem('selectedProfile'); }}>Trocar Perfil</Button>
            <Button color="inherit" onClick={logout}>Sair</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<RHDashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      {/* Prompt de instalação */}
      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 80 }}
      >
        <Alert
          severity="info"
          action={
            <Box>
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleInstallClick}
                startIcon={<DownloadIcon />}
              >
                Instalar
              </Button>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setShowInstallPrompt(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          Instale o app para usar offline e no celular!
        </Alert>
      </Snackbar>
    </Router>
  );
}

export default App;
