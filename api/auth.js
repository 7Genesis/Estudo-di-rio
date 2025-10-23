export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { username, password } = req.body;
  
  const users = [
    { username: 'rh@empresa.com', password: 'rh123', role: 'RH', name: 'RH' },
    { username: 'admin@empresa.com', password: 'admin123', role: 'ADMIN', name: 'Admin' }
  ];
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  
  return res.json({
    token: 'demo-token-' + Date.now(),
    user: { role: user.role, name: user.name, username: user.username }
  });
}
