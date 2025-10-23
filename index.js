const express = require('express');
const app = express();

app.use(express.json());

app.get('/', function(req, res) {
  res.send('Hub Evoluti 360 - Online');
});

app.get('/api/health', function(req, res) {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.post('/api/marketing/leads', function(req, res) {
  const body = req.body || {};
  const name = body.name;
  const email = body.email;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e email obrigatorios' });
  }
  
  res.status(201).json({ message: 'Lead recebido' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', function() {
  console.log('Server rodando na porta ' + PORT);
});
