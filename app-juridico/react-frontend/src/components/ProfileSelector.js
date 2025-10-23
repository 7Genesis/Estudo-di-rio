import React from 'react';
import { Container, Paper, Typography, Grid, Button } from '@mui/material';
import { Business as BusinessIcon, Person as PersonIcon } from '@mui/icons-material';

const ProfileSelector = ({ user, onSelectProfile }) => {
  const canRH = user?.role === 'RH' || user?.role === 'ADMIN' || user?.profiles?.includes?.('RH');

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>Selecione o perfil</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={canRH ? 6 : 12}>
            <Button fullWidth variant="outlined" onClick={() => onSelectProfile('FUNCIONARIO')}
              sx={{ height: 140, flexDirection: 'column' }}>
              <PersonIcon sx={{ fontSize: 56, mb: 1 }} color="primary" />
              Funcionário
            </Button>
          </Grid>
          {canRH && (
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="outlined" onClick={() => onSelectProfile('RH')}
                sx={{ height: 140, flexDirection: 'column' }}>
                <BusinessIcon sx={{ fontSize: 56, mb: 1 }} color="secondary" />
                RH
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileSelector;