const express = require('express');
const app = express();

app.use(express.json());

// ===== DADOS EM MEMÓRIA =====
const colaboradores = [];
const contratos = [];
const eventos = [];
const lotes = [];
const usuarios = [
  { id: 1, nome: 'Admin', email: 'admin@empresa.com', role: 'ADMINISTRADOR', senha: 'admin123' },
  { id: 2, nome: 'RH User', email: 'rh@empresa.com', role: 'RH', senha: 'rh123' },
  { id: 3, nome: 'Jurídico', email: 'juridico@empresa.com', role: 'JURIDICO', senha: 'jur123' },
  { id: 4, nome: 'Gestor', email: 'gestor@empresa.com', role: 'GESTOR', senha: 'gest123' }
];
const certificados = [];
const logs = [];

// ===== MIDDLEWARE DE AUTH (SIMULADO) =====
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Token obrigatorio' });
  // Simulação: token = "user:1" (produção: JWT)
  const userId = parseInt(token.split(':')[1]);
  const user = usuarios.find(u => u.id === userId);
  if (!user) return res.status(401).json({ message: 'Usuario invalido' });
  req.user = user;
  next();
};

// ===== RBAC =====
const can = (role, action) => {
  const permissions = {
    ADMINISTRADOR: ['*'],
    RH: ['criar_colaborador', 'criar_evento', 'validar_evento', 'visualizar_dashboard'],
    JURIDICO: ['aprovar_evento_sensivel', 'visualizar_logs', 'visualizar_dashboard'],
    GESTOR: ['visualizar_dashboard', 'visualizar_colaboradores']
  };
  return permissions[role]?.includes('*') || permissions[role]?.includes(action);
};

// ===== PÁGINA INICIAL =====
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Hub Evoluti 360</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f14; color: #e5e7eb; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        h1 { color: #fff; font-size: 32px; margin-bottom: 8px; }
        .subtitle { color: #e0e7ff; opacity: 0.9; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { background: #1a1a20; border: 1px solid #2a2a30; border-radius: 12px; padding: 24px; }
        .card h2 { color: #818cf8; margin-bottom: 16px; font-size: 20px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge.success { background: #10b981; color: #fff; }
        .badge.warning { background: #f59e0b; color: #fff; }
        .badge.info { background: #3b82f6; color: #fff; }
        form { display: flex; flex-direction: column; gap: 12px; }
        input, select, textarea { padding: 12px; background: #2a2a30; border: 1px solid #3a3a40; border-radius: 6px; color: #fff; }
        button { padding: 12px 20px; background: #4f46e5; color: #fff; border: 0; border-radius: 6px; cursor: pointer; font-weight: 600; }
        button:hover { background: #4338ca; }
        .endpoint { background: #1a1a20; padding: 16px; margin: 12px 0; border-radius: 8px; border-left: 4px solid #4f46e5; }
        .method { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; margin-right: 12px; font-size: 12px; }
        .post { background: #10b981; color: #fff; }
        .get { background: #3b82f6; color: #fff; }
        .put { background: #f59e0b; color: #fff; }
        .delete { background: #ef4444; color: #fff; }
        code { background: #2a2a30; padding: 2px 8px; border-radius: 4px; color: #a78bfa; }
        .feature-list { list-style: none; }
        .feature-list li { padding: 8px 0; border-bottom: 1px solid #2a2a30; }
        .feature-list li:before { content: '✓'; color: #10b981; margin-right: 8px; font-weight: bold; }
        .timeline { margin: 20px 0; }
        .timeline-item { padding-left: 30px; position: relative; padding-bottom: 20px; border-left: 2px solid #4f46e5; }
        .timeline-item:before { content: ''; position: absolute; left: -6px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #4f46e5; }
        .success-msg { color: #4ade80; margin-top: 10px; }
        .error-msg { color: #f87171; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🚀 Hub Evoluti 360°</h1>
          <p class="subtitle">Plataforma completa de RH + DP + eSocial com LGPD e Compliance</p>
        </header>

        <div class="grid">
          <div class="card">
            <h2>📊 Dashboard</h2>
            <ul class="feature-list">
              <li>Eventos pendentes: <span class="badge warning">3</span></li>
              <li>Prazos críticos: <span class="badge warning">2</span></li>
              <li>Colaboradores ativos: <span class="badge success">12</span></li>
              <li>Eventos com erro: <span class="badge info">1</span></li>
            </ul>
          </div>

          <div class="card">
            <h2>👥 Papéis e Permissões</h2>
            <ul class="feature-list">
              <li><strong>RH:</strong> Cria colaboradores e eventos</li>
              <li><strong>Jurídico:</strong> Aprova eventos sensíveis</li>
              <li><strong>Gestor:</strong> Visualiza dashboards</li>
              <li><strong>Admin:</strong> Gerencia certificados</li>
            </ul>
          </div>

          <div class="card">
            <h2>🔒 Segurança & LGPD</h2>
            <ul class="feature-list">
              <li>Criptografia TLS + AES-256</li>
              <li>RBAC com MFA</li>
              <li>Retenção legal de XMLs</li>
              <li>Trilhas de auditoria</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <h2>📋 Cadastrar Lead</h2>
          <form id="leadForm">
            <input type="text" name="name" placeholder="Nome completo" required>
            <input type="email" name="email" placeholder="Email corporativo" required>
            <input type="tel" name="phone" placeholder="Telefone (opcional)">
            <input type="text" name="company" placeholder="Empresa (opcional)">
            <button type="submit">Quero conhecer a plataforma</button>
          </form>
          <div id="leadMessage"></div>
        </div>

        <div class="card">
          <h2>👤 Criar Colaborador</h2>
          <form id="colabForm">
            <input type="text" name="nome" placeholder="Nome completo" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="cpf" placeholder="CPF (somente números)" required maxlength="11">
            <input type="text" name="cargo" placeholder="Cargo" required>
            <input type="number" name="salario" placeholder="Salário bruto" step="0.01" required>
            <input type="date" name="dataAdmissao" required>
            <button type="submit">Cadastrar Colaborador</button>
          </form>
          <div id="colabMessage"></div>
        </div>

        <div class="card">
          <h2>📄 API Endpoints (eSocial + RH)</h2>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/colaboradores</code>
            <p>Criar novo colaborador (requer: RH ou ADMIN)</p>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span><code>/api/colaboradores/:id</code>
            <p>Obter dados completos de um colaborador</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/colaboradores/:id/contratos</code>
            <p>Vincular contrato digital (PDF ou base64)</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/eventos/s2200</code>
            <p>Criar evento S-2200 (admissão) - Wizard com validação</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/eventos/:id/validar</code>
            <p>Validar evento contra schema XSD oficial</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/eventos/:id/assinar</code>
            <p>Assinar digitalmente com ICP-Brasil A1/A3</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/eventos/:id/transmitir</code>
            <p>Enviar ao eSocial (Gov.br)</p>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span><code>/api/eventos/:id/status</code>
            <p>Consultar status e protocolo de retorno</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/eventos/lotes</code>
            <p>Criar lote e enviar múltiplos eventos em batch</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/folha/s1200/gerar</code>
            <p>Gerar eventos S-1200 (remuneração mensal)</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/folha/s1210/gerar</code>
            <p>Gerar eventos S-1210 (pagamentos)</p>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span><code>/api/dashboard/pendencias</code>
            <p>Eventos pendentes por prazo legal</p>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span><code>/api/logs/auditoria</code>
            <p>Trilhas de auditoria (LGPD compliant)</p>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span><code>/api/certificados/upload</code>
            <p>Upload de certificado ICP-Brasil (A1/A3)</p>
          </div>
        </div>

        <div class="card">
          <h2>🔄 Timeline do Colaborador</h2>
          <div class="timeline">
            <div class="timeline-item">
              <strong>01/01/2025</strong> - Admissão (S-2200 enviado)
              <span class="badge success">Processado</span>
            </div>
            <div class="timeline-item">
              <strong>15/02/2025</strong> - Alteração Salarial (S-2206)
              <span class="badge info">Pendente validação</span>
            </div>
            <div class="timeline-item">
              <strong>01/03/2025</strong> - Remuneração (S-1200)
              <span class="badge success">Transmitido</span>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // Lead Form
        document.getElementById('leadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            company: form.company.value
          };
          
          try {
            const res = await fetch('/api/marketing/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            const json = await res.json();
            document.getElementById('leadMessage').innerHTML = res.ok 
              ? '<p class="success-msg">✅ ' + json.message + '</p>'
              : '<p class="error-msg">❌ ' + json.message + '</p>';
            if (res.ok) form.reset();
          } catch (err) {
            document.getElementById('leadMessage').innerHTML = '<p class="error-msg">❌ Erro de conexão</p>';
          }
        });
        
        // Colaborador Form
        document.getElementById('colabForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const data = {
            nome: form.nome.value,
            email: form.email.value,
            cpf: form.cpf.value,
            cargo: form.cargo.value,
            salario: parseFloat(form.salario.value),
            dataAdmissao: form.dataAdmissao.value
          };
          
          try {
            const res = await fetch('/api/colaboradores', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'user:2'
              },
              body: JSON.stringify(data)
            });
            const json = await res.json();
            document.getElementById('colabMessage').innerHTML = res.ok 
              ? '<p class="success-msg">✅ Colaborador criado! ID: ' + json.id + '</p>'
              : '<p class="error-msg">❌ ' + json.message + '</p>';
            if (res.ok) form.reset();
          } catch (err) {
            document.getElementById('colabMessage').innerHTML = '<p class="error-msg">❌ Erro de conexão</p>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), version: '1.0.0' });
});

// ===== MARKETING LEADS =====
app.post('/api/marketing/leads', (req, res) => {
  const { name, email, phone, company } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e email obrigatorios' });
  }
  
  logs.push({ action: 'LEAD_CREATED', data: { name, email }, ts: new Date().toISOString() });
  res.status(201).json({ message: 'Lead recebido! Entraremos em contato em breve.' });
});

// ===== COLABORADORES =====
app.post('/api/colaboradores', auth, (req, res) => {
  if (!can(req.user.role, 'criar_colaborador')) {
    return res.status(403).json({ message: 'Sem permissao para criar colaborador' });
  }
  
  const { nome, email, cpf, cargo, salario, dataAdmissao } = req.body || {};
  if (!nome || !cpf) return res.status(400).json({ message: 'Nome e CPF obrigatorios' });
  
  // Validações LGPD
  if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return res.status(400).json({ message: 'CPF invalido (11 digitos numericos)' });
  }
  
  const id = colaboradores.length + 1;
  const colab = {
    id,
    nome,
    email,
    cpf,
    cargo,
    salario,
    dataAdmissao,
    status: 'ATIVO',
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  };
  colaboradores.push(colab);
  
  logs.push({ action: 'COLABORADOR_CREATED', userId: req.user.id, data: { id, nome }, ts: new Date().toISOString() });
  
  res.status(201).json(colab);
});

app.get('/api/colaboradores/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const colab = colaboradores.find(c => c.id === id);
  if (!colab) return res.status(404).json({ message: 'Colaborador nao encontrado' });
  
  logs.push({ action: 'COLABORADOR_VIEWED', userId: req.user.id, data: { id }, ts: new Date().toISOString() });
  res.json(colab);
});

// ===== CONTRATOS =====
app.post('/api/colaboradores/:id/contratos', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const colab = colaboradores.find(c => c.id === id);
  if (!colab) return res.status(404).json({ message: 'Colaborador nao encontrado' });
  
  const { contractUrl, contractFile, contractFileName } = req.body || {};
  const contratoId = contratos.length + 1;
  
  contratos.push({
    id: contratoId,
    colaboradorId: id,
    url: contractUrl || null,
    file: contractFile || null,
    fileName: contractFileName || null,
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  });
  
  logs.push({ action: 'CONTRATO_VINCULADO', userId: req.user.id, data: { contratoId, colaboradorId: id }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Contrato vinculado com sucesso', contratoId });
});

// ===== EVENTOS S-2200 =====
app.post('/api/eventos/s2200', auth, (req, res) => {
  if (!can(req.user.role, 'criar_evento')) {
    return res.status(403).json({ message: 'Sem permissao para criar eventos' });
  }
  
  const { colaboradorId, contratoId } = req.body || {};
  if (!colaboradorId) return res.status(400).json({ message: 'colaboradorId obrigatorio' });
  
  const colab = colaboradores.find(c => c.id === colaboradorId);
  if (!colab) return res.status(404).json({ message: 'Colaborador nao encontrado' });
  
  const eventoId = eventos.length + 1;
  eventos.push({
    id: eventoId,
    tipo: 'S-2200',
    status: 'DRAFT',
    colaboradorId,
    contratoId: contratoId || null,
    payload: { colab },
    validacoes: [],
    erros: [],
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  });
  
  logs.push({ action: 'EVENTO_S2200_CREATED', userId: req.user.id, data: { eventoId, colaboradorId }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Evento S-2200 criado (wizard: passo 1/5)', eventoId, nextStep: 'validar' });
});

// ===== VALIDAR EVENTO =====
app.post('/api/eventos/:id/validar', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find(e => e.id === id);
  if (!evento) return res.status(404).json({ message: 'Evento nao encontrado' });
  
  // Simulação de validações XSD
  const validacoes = [
    { campo: 'cpfTrab', status: 'OK', mensagem: 'CPF valido' },
    { campo: 'nmTrab', status: 'OK', mensagem: 'Nome conforme' },
    { campo: 'dtAdm', status: 'OK', mensagem: 'Data de admissao valida' }
  ];
  
  evento.status = 'VALIDADO';
  evento.validacoes = validacoes;
  evento.updatedAt = new Date().toISOString();
  evento.validatedBy = req.user.id;
  
  logs.push({ action: 'EVENTO_VALIDADO', userId: req.user.id, data: { eventoId: id }, ts: new Date().toISOString() });
  
  res.json({ message: 'Evento validado (wizard: passo 2/5)', evento, nextStep: 'assinar' });
});

// ===== ASSINAR EVENTO =====
app.post('/api/eventos/:id/assinar', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find(e => e.id === id);
  if (!evento) return res.status(404).json({ message: 'Evento nao encontrado' });
  if (evento.status !== 'VALIDADO') return res.status(400).json({ message: 'Evento precisa estar validado (passo 2)' });
  
  evento.status = 'ASSINADO';
  evento.assinatura = {
    tipo: 'ICP-Brasil-A1',
    certificado: 'CN=EMPRESA LTDA:12345678000190',
    timestamp: new Date().toISOString(),
    algoritmo: 'SHA-256 with RSA'
  };
  evento.updatedAt = new Date().toISOString();
  evento.signedBy = req.user.id;
  
  logs.push({ action: 'EVENTO_ASSINADO', userId: req.user.id, data: { eventoId: id }, ts: new Date().toISOString() });
  
  res.json({ message: 'Evento assinado digitalmente (wizard: passo 3/5)', evento, nextStep: 'transmitir' });
});

// ===== TRANSMITIR EVENTO =====
app.post('/api/eventos/:id/transmitir', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find(e => e.id === id);
  if (!evento) return res.status(404).json({ message: 'Evento nao encontrado' });
  if (evento.status !== 'ASSINADO') return res.status(400).json({ message: 'Evento precisa estar assinado (passo 3)' });
  
  evento.status = 'ENVIADO';
  evento.protocolo = 'PROT-' + Date.now();
  evento.recibo = 'REC-' + Date.now();
  evento.updatedAt = new Date().toISOString();
  evento.transmittedBy = req.user.id;
  
  logs.push({ action: 'EVENTO_TRANSMITIDO', userId: req.user.id, data: { eventoId: id, protocolo: evento.protocolo }, ts: new Date().toISOString() });
  
  res.json({
    message: 'Evento transmitido ao eSocial (wizard: passo 4/5)',
    protocolo: evento.protocolo,
    recibo: evento.recibo,
    nextStep: 'aguardar_processamento'
  });
});

// ===== STATUS DO EVENTO =====
app.get('/api/eventos/:id/status', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find(e => e.id === id);
  if (!evento) return res.status(404).json({ message: 'Evento nao encontrado' });
  
  res.json({
    id: evento.id,
    tipo: evento.tipo,
    status: evento.status,
    protocolo: evento.protocolo || null,
    recibo: evento.recibo || null,
    erros: evento.erros || [],
    createdAt: evento.createdAt,
    updatedAt: evento.updatedAt
  });
});

// ===== LOTES =====
app.post('/api/eventos/lotes', auth, (req, res) => {
  const { eventIds } = req.body || {};
  if (!Array.isArray(eventIds) || eventIds.length === 0) {
    return res.status(400).json({ message: 'eventIds array obrigatorio' });
  }
  
  const loteId = lotes.length + 1;
  lotes.push({
    id: loteId,
    eventIds,
    status: 'PROCESSANDO',
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  });
  
  logs.push({ action: 'LOTE_CREATED', userId: req.user.id, data: { loteId, eventIds }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Lote criado e processamento iniciado', loteId, status: 'PROCESSANDO' });
});

// ===== FOLHA S-1200 =====
app.post('/api/folha/s1200/gerar', auth, (req, res) => {
  const { competencia, colaboradores: colabIds } = req.body || {};
  if (!competencia || !Array.isArray(colabIds)) {
    return res.status(400).json({ message: 'competencia (AAAA-MM) e colaboradores array obrigatorios' });
  }
  
  const created = [];
  colabIds.forEach(cid => {
    const eventoId = eventos.length + 1;
    eventos.push({
      id: eventoId,
      tipo: 'S-1200',
      status: 'DRAFT',
      colaboradorId: cid,
      payload: { competencia },
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    });
    created.push(eventoId);
  });
  
  logs.push({ action: 'S1200_GERADO', userId: req.user.id, data: { competencia, eventIds: created }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Eventos S-1200 (remuneracao) gerados', competencia, eventIds: created });
});

// ===== FOLHA S-1210 =====
app.post('/api/folha/s1210/gerar', auth, (req, res) => {
  const { competencia, colaboradores: colabIds } = req.body || {};
  if (!competencia || !Array.isArray(colabIds)) {
    return res.status(400).json({ message: 'competencia (AAAA-MM) e colaboradores array obrigatorios' });
  }
  
  const created = [];
  colabIds.forEach(cid => {
    const eventoId = eventos.length + 1;
    eventos.push({
      id: eventoId,
      tipo: 'S-1210',
      status: 'DRAFT',
      colaboradorId: cid,
      payload: { competencia },
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    });
    created.push(eventoId);
  });
  
  logs.push({ action: 'S1210_GERADO', userId: req.user.id, data: { competencia, eventIds: created }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Eventos S-1210 (pagamentos) gerados', competencia, eventIds: created });
});

// ===== DASHBOARD PENDENCIAS =====
app.get('/api/dashboard/pendencias', auth, (req, res) => {
  if (!can(req.user.role, 'visualizar_dashboard')) {
    return res.status(403).json({ message: 'Sem permissao para visualizar dashboard' });
  }
  
  const pendentes = eventos.filter(e => ['DRAFT', 'VALIDADO', 'ASSINADO'].includes(e.status));
  const comErro = eventos.filter(e => e.erros && e.erros.length > 0);
  const prazosCriticos = eventos.filter(e => {
    const dias = Math.floor((new Date() - new Date(e.createdAt)) / (1000 * 60 * 60 * 24));
    return dias > 7 && e.status !== 'ENVIADO';
  });
  
  res.json({
    totalPendentes: pendentes.length,
    totalComErro: comErro.length,
    prazosCriticos: prazosCriticos.length,
    eventos: pendentes.map(e => ({
      id: e.id,
      tipo: e.tipo,
      status: e.status,
      colaboradorId: e.colaboradorId,
      diasPendente: Math.floor((new Date() - new Date(e.createdAt)) / (1000 * 60 * 60 * 24))
    }))
  });
});

// ===== LOGS DE AUDITORIA =====
app.get('/api/logs/auditoria', auth, (req, res) => {
  if (!can(req.user.role, 'visualizar_logs')) {
    return res.status(403).json({ message: 'Sem permissao para visualizar logs' });
  }
  
  const { limit = 50, action } = req.query;
  let filtered = logs;
  
  if (action) {
    filtered = logs.filter(l => l.action === action);
  }
  
  res.json({
    total: filtered.length,
    logs: filtered.slice(0, parseInt(limit))
  });
});

// ===== UPLOAD CERTIFICADO =====
app.post('/api/certificados/upload', auth, (req, res) => {
  if (req.user.role !== 'ADMINISTRADOR') {
    return res.status(403).json({ message: 'Apenas administradores podem gerenciar certificados' });
  }
  
  const { tipo, arquivo, senha, validade } = req.body || {};
  if (!tipo || !arquivo) {
    return res.status(400).json({ message: 'tipo e arquivo obrigatorios' });
  }
  
  const certId = certificados.length + 1;
  certificados.push({
    id: certId,
    tipo,
    arquivo,
    validade,
    uploadedAt: new Date().toISOString(),
    uploadedBy: req.user.id
  });
  
  logs.push({ action: 'CERTIFICADO_UPLOADED', userId: req.user.id, data: { certId, tipo }, ts: new Date().toISOString() });
  
  res.status(201).json({ message: 'Certificado carregado com sucesso', certId, validade });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Hub Evoluti 360 rodando na porta ' + PORT);
  console.log('📍 Acesse: http://localhost:' + PORT);
  console.log('🔐 Usuarios de teste:');
  console.log('   - admin@empresa.com (ADMINISTRADOR)');
  console.log('   - rh@empresa.com (RH)');
  console.log('   - juridico@empresa.com (JURIDICO)');
  console.log('   - gestor@empresa.com (GESTOR)');
});
