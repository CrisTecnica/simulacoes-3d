const STORAGE_KEY = 'simulacoes3d_user_sims';

const DEFAULT_SIMS = [
  {
    id: 'celula',
    title: 'Célula Animal',
    icon: '🔬',
    description: 'Explore organelas e estruturas celulares em 3D com modelos PBR',
    file: 'celula.html',
    color: '#6c5ce7',
  },
  {
    id: 'dna',
    title: 'Dupla Hélice de DNA',
    icon: '🧬',
    description: 'Visualize a estrutura molecular do DNA com pares de bases e pontes de H',
    file: 'dna.html',
    color: '#00e5ff',
  },
  {
    id: 'solar',
    title: 'Sistema Solar',
    icon: '🌌',
    description: 'Planetas, órbitas e o Sol em uma simulação 3D interativa',
    file: 'solar.html',
    color: '#f39c12',
  },
  {
    id: 'exoplanetas',
    title: 'Sistemas Exoplanetários',
    icon: '🪐',
    description: 'Explore 10 sistemas planetários: TRAPPIST-1, Kepler-90, HR 8799 e mais',
    file: 'exoplanetas.html',
    color: '#7c4dff',
  },
  {
    id: 'eclipse',
    title: 'Eclipses Solares e Lunares',
    icon: '🌑',
    description: 'Observe o alinhamento Sol-Terra-Lua com cone de sombra e raios de luz',
    file: 'eclipse.html',
    color: '#ff6b00',
  },
];

function loadUserSims() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUserSims(sims) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sims));
}

function getAllSims() {
  return [...DEFAULT_SIMS, ...loadUserSims()];
}

function renderGrid() {
  const grid = document.getElementById('sim-grid');
  const all = getAllSims();
  grid.innerHTML = '';

  if (all.length === 0) {
    grid.innerHTML = '<div class="empty-state">Nenhuma simulação encontrada.<br>Clique em <strong>+ Nova Simulação</strong> para adicionar.</div>';
    return;
  }

  for (const sim of all) {
    const card = document.createElement('div');
    card.className = 'sim-card';
    card.style.setProperty('--accent', sim.color);

    const isDefault = DEFAULT_SIMS.some(d => d.id === sim.id);

    const icon = document.createElement('div');
    icon.className = 'sim-icon';
    icon.textContent = sim.icon;

    const info = document.createElement('div');
    info.className = 'sim-info';

    const title = document.createElement('div');
    title.className = 'sim-title';
    title.textContent = sim.title;

    const desc = document.createElement('div');
    desc.className = 'sim-desc';
    desc.textContent = sim.description;

    info.append(title, desc);

    const badge = document.createElement('div');
    badge.className = 'sim-badge';
    badge.textContent = isDefault ? 'Padrão' : 'Custom';

    const actions = document.createElement('div');
    actions.className = 'sim-actions';

    const openBtn = document.createElement('button');
    openBtn.className = 'sim-btn-open';
    openBtn.textContent = 'Abrir';
    openBtn.addEventListener('click', () => window.open(sim.file, '_blank'));

    actions.appendChild(openBtn);

    if (!isDefault) {
      const delBtn = document.createElement('button');
      delBtn.className = 'sim-btn-del';
      delBtn.textContent = '✕';
      delBtn.title = 'Remover simulação';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Remover "${sim.title}"?`)) {
          const userSims = loadUserSims();
          saveUserSims(userSims.filter(s => s.id !== sim.id));
          renderGrid();
        }
      });
      actions.appendChild(delBtn);
    }

    card.append(icon, info, badge, actions);
    grid.appendChild(card);
  }
}

// ---- Modal ----
const modal = document.getElementById('modal-overlay');
const form = document.getElementById('sim-form');
const cancelBtn = document.getElementById('modal-close');

document.getElementById('add-sim-btn').addEventListener('click', () => {
  modal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('f-title').value.trim();
  const icon = document.getElementById('f-icon').value.trim();
  const desc = document.getElementById('f-desc').value.trim();
  const file = document.getElementById('f-file').value.trim();
  const color = document.getElementById('f-color').value;

  if (!title || !icon || !file) return;

  const userSims = loadUserSims();
  const newId = 'user_' + Date.now();

  userSims.push({ id: newId, title, icon, description: desc, file, color });
  saveUserSims(userSims);
  renderGrid();

  form.reset();
  modal.classList.add('hidden');
});

renderGrid();
