const api = '';

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function load() {
  try {
    const dash = await fetchJson('/api/dashboard');
    document.getElementById('stats').innerHTML = `
      <p>Total: ${dash.total}</p>
      <p>Média salarial: R$ ${dash.media.toFixed(2)}</p>
      <p>Maior: R$ ${dash.max.toFixed(2)} | Menor: R$ ${dash.min.toFixed(2)}</p>
      <p>Por status: ${Object.entries(dash.byStatus).map(([k,v]) => `${k}:${v}`).join(' | ')}</p>
      <h4>Top salários</h4>
      <ul>${dash.top.map(t => `<li>${t.id} — ${t.name} — R$ ${Number(t.salary).toFixed(2)}</li>`).join('')}</ul>
    `;
    const employees = await fetchJson('/api/employees');
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = employees.map(e => `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.position}</td>
        <td>R$ ${Number(e.salary).toFixed(2)}</td>
        <td>${e.status}</td>
        <td>
          <button data-id="${e.id}" class="del">Deletar</button>
        </td>
      </tr>
    `).join('');
    document.querySelectorAll('.del').forEach(b => b.addEventListener('click', async ev => {
      const id = ev.currentTarget.dataset.id;
      if (!confirm('Deletar funcionário ID ' + id + '?')) return;
      await fetchJson('/api/employees/' + id, { method: 'DELETE' });
      load();
    }));
  } catch (err) {
    console.error(err);
    document.getElementById('stats').textContent = 'Erro ao carregar';
  }
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = {
    name: fd.get('name'),
    position: fd.get('position'),
    salary: Number(fd.get('salary')),
    status: fd.get('status')
  };
  await fetchJson('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  e.target.reset();
  load();
});

load();