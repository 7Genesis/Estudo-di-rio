import React, { useState } from 'react';

const featuresA = [
  'Cargos e Salários',
  'Avaliação de Desempenho',
  'Descrição de Cargos',
  'Feedback, T&D e PDIs',
  'Pesquisa de Clima',
  'E muito mais!'
];

const featuresB = [
  'Portal do Colaborador',
  'Portal do Gestor',
  'Férias',
  'Departamento Pessoal',
  'Frequência',
  'Avaliação de Desempenho',
  'Feedbacks',
  'Relatórios Gerenciais',
  'Comunicação',
  'Saúde Ocupacional'
];

export default function Landing() {
  const API = process.env.REACT_APP_API_URL || '/api';
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });

  const sendLead = async (e) => {
    e.preventDefault();
    setSending(true); setErr(''); setOk(false);
    try {
      const r = await fetch(`${API}/marketing/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'landing-rh' })
      });
      if (!r.ok) throw new Error((await r.json()).message || 'Erro ao enviar');
      setOk(true);
      setForm({ name: '', email: '', phone: '', company: '' });
    } catch (e) { setErr(e.message); }
    finally { setSending(false); }
  };

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial', background: '#0b0b0f', color: '#fff', minHeight: '100vh' }}>
      <header style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Hub Evoluti 360°</h1>
        <button onClick={() => setShowForm(true)} style={btnPrimary}>Saiba mais</button>
      </header>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
        <div style={hero}>
          <h2 style={{ fontSize: 36, marginBottom: 12 }}>RH + DP + Ponto + Assinatura Eletrônica</h2>
          <p style={{ color: '#cfd3dc', fontSize: 18, marginBottom: 24 }}>
            Plataforma completa para tirar o RH do papel: processos digitais, fluxos aprovativos e eSocial.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setShowForm(true)} style={btnPrimary}>Quero conhecer</button>
            <a href="#recursos" style={btnGhost}>Ver recursos</a>
          </div>
        </div>

        <div id="recursos" style={grid}>
          <Card title="Desenhada por RHs">
            <ul style={ul}>
              {featuresA.map((f, i) => <li key={i}>✅ {f}</li>)}
            </ul>
          </Card>

          <Card title="Módulos completos">
            <ul style={ul}>
              {featuresB.map((f, i) => <li key={i}>✅ {f}</li>)}
            </ul>
          </Card>

          <Card title="Compliance e Segurança">
            <ul style={ul}>
              <li>✅ Assinatura ICP-Brasil A1/A3</li>
              <li>✅ TLS em trânsito, AES-256 em repouso</li>
              <li>✅ RBAC, MFA e trilhas de auditoria</li>
              <li>✅ Retenção legal de XML/recibos</li>
            </ul>
          </Card>

          <Card title="eSocial ponta-a-ponta">
            <ul style={ul}>
              <li>✅ Wizards por evento com validação instantânea</li>
              <li>✅ Pré-visualização do XML</li>
              <li>✅ S-2200, S-1200, S-1210 e lotes</li>
              <li>✅ Reprocesso com histórico e backoff</li>
            </ul>
          </Card>
        </div>

        <div style={{ textAlign: 'center', margin: '40px 0 80px' }}>
          <button onClick={() => setShowForm(true)} style={btnPrimary}>Agendar demonstração</button>
        </div>
      </section>

      {showForm && (
        <div style={modalBack} onClick={() => setShowForm(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Fale com um especialista</h3>
            <form onSubmit={sendLead}>
              <input style={input} placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <input style={input} placeholder="Telefone (opcional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input style={input} placeholder="Empresa (opcional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              {err && <p style={{ color: '#ff7b7b', marginTop: 6 }}>{err}</p>}
              {ok && <p style={{ color: '#4ade80', marginTop: 6 }}>Recebido! Em breve entraremos em contato.</p>}
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" style={btnPrimary} disabled={sending}>{sending ? 'Enviando...' : 'Enviar'}</button>
                <button type="button" style={btnGhost} onClick={() => setShowForm(false)}>Fechar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const hero = {
  padding: '48px 28px',
  borderRadius: 16,
  background: 'linear-gradient(135deg,#ff7a18,#af002d 80%)'
};

const grid = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: 24 };

const ul = { margin: 0, paddingLeft: 0, listStyle: 'none', lineHeight: 1.9 };

const card = { background: '#14141a', border: '1px solid #23232b', borderRadius: 12, padding: 18 };

function Card({ title, children }) {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

const btnPrimary = {
  background: '#4f46e5', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 10, cursor: 'pointer'
};

const btnGhost = {
  background: 'transparent', color: '#e5e7eb', border: '1px solid #30303a', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', textDecoration: 'none'
};

const modalBack = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'grid', placeItems: 'center', padding: 16, zIndex: 50
};

const modal = {
  width: '100%', maxWidth: 520, background: '#0f0f14', color: '#fff', border: '1px solid #23232b', borderRadius: 12, padding: 16
};