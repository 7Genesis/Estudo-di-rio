const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hub Evoluti Online'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server on :${PORT}`));