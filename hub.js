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
  {
    id: 'galaxias',
    title: 'Galáxias: Formação e Colisão',
    icon: '🌀',
    description: 'Galáxias espirais com 15.000 estrelas, colisão entre galáxias e agrupamentos',
    file: 'galaxias.html',
    color: '#7c4dff',
  },
  {
    id: 'buracosnegros',
    title: 'Buracos Negros e Discos de Acreção',
    icon: '🕳️',
    description: 'Disco de acreção, anel de fótons, jatos relativísticos e sistema binário',
    file: 'buracosnegros.html',
    color: '#ff0055',
  },
  {
    id: 'vialactea',
    title: 'Movimento de Estrelas na Via Láctea',
    icon: '🌌',
    description: 'Braços espirais, bojo galáctico, halo estelar e aglomerados globulares',
    file: 'vialactea.html',
    color: '#4488ff',
  },
  {
    id: 'missoes',
    title: 'Missões Espaciais Históricas',
    icon: '🚀',
    description: 'Trajetórias de Apollo 11, Voyager, Cassini, Hubble, ISS e mais 9 missões',
    file: 'missoes.html',
    color: '#ff8800',
  },
  {
    id: 'campograv',
    title: 'Campo Gravitacional e Órbitas',
    icon: '🌍',
    description: 'Poço gravitacional, órbitas de satélites e simulação N-corpos',
    file: 'campograv.html',
    color: '#44dd88',
  },
  {
    id: 'proteinas',
    title: 'Síntese de Proteínas',
    icon: '🧬',
    description: 'Tradução do mRNA no ribossomo com tRNAs e cadeia polipeptídica',
    file: 'proteinas.html',
    color: '#44aaff',
  },
  {
    id: 'divisaocelular',
    title: 'Divisão Celular',
    icon: '🔬',
    description: 'Mitose e Meiose com cromossomos, fuso mitótico e centríolos',
    file: 'divisaocelular.html',
    color: '#ff66aa',
  },
  {
    id: 'circulatorio',
    title: 'Sistema Circulatório Humano',
    icon: '❤️',
    description: 'Coração pulsante, artérias, veias, capilares e glóbulos vermelhos em fluxo contínuo',
    file: 'circulatorio.html',
    color: '#ff4466',
  },
  {
    id: 'coracao',
    title: 'Coração em Tempo Real',
    icon: '💓',
    description: '4 câmaras, válvulas, sistema elétrico com ECG, BPM ajustável e ciclo cardíaco',
    file: 'coracao.html',
    color: '#ff2244',
  },
  {
    id: 'neuronios',
    title: 'Rede de Neurônios',
    icon: '🧠',
    description: 'Corpo celular, dendritos, axônios e sinapses com transmissão de impulsos',
    file: 'neuronios.html',
    color: '#ffaa44',
  },
  {
    id: 'imunologico',
    title: 'Sistema Imunológico',
    icon: '🛡️',
    description: 'Macrófagos, linfócitos T, anticorpos e citocinas combatendo infecções',
    file: 'imunologico.html',
    color: '#44ff88',
  },
  {
    id: 'celulavegetal',
    title: 'Célula Vegetal',
    icon: '🌿',
    description: 'Parede celular, cloroplastos, vacúolo e 10 organelas vegetais em 3D',
    file: 'celulavegetal.html',
    color: '#44cc44',
  },
  {
    id: 'pendulos',
    title: 'Pêndulo Simples e Duplo',
    icon: '⏱️',
    description: 'Oscilação de pêndulos simples, duplo e triplo com trajetórias',
    file: 'pendulos.html',
    color: '#44ccff',
  },
  {
    id: 'ondas',
    title: 'Interferência de Ondas',
    icon: '🌊',
    description: 'Fontes coerentes, fenda dupla e padrões de interferência 3D',
    file: 'ondas.html',
    color: '#00ccff',
  },
  {
    id: 'campoeletrico',
    title: 'Campos Eletromagnéticos 3D',
    icon: '⚡',
    description: 'Campo elétrico, magnético e onda eletromagnética em 3D',
    file: 'campoeletrico.html',
    color: '#ffcc00',
  },
  {
    id: 'colisoes',
    title: 'Colisões entre Partículas',
    icon: '💥',
    description: 'Colisão elástica, inelástica e simulação de múltiplas partículas',
    file: 'colisoes.html',
    color: '#ff6644',
  },
  {
    id: 'projetil',
    title: 'Movimento de Projéteis',
    icon: '🎯',
    description: 'Lançamento oblíquo com/sem resistência do ar, ângulo e velocidade ajustáveis',
    file: 'projetil.html',
    color: '#ff8800',
  },
  {
    id: 'optica',
    title: 'Óptica Geométrica 3D',
    icon: '🔦',
    description: 'Lentes convexas, côncavas, espelhos e prismas com raios de luz',
    file: 'optica.html',
    color: '#00ddff',
  },
  {
    id: 'relatividade',
    title: 'Relatividade Especial',
    icon: '⚡',
    description: 'Contração de Lorentz, dilatação temporal e cone de luz',
    file: 'relatividade.html',
    color: '#aa44ff',
  },
  {
    id: 'decaimento',
    title: 'Decaimento Radioativo',
    icon: '☢️',
    description: 'Decaimento alfa, beta e gama com simulação estatística de meia-vida',
    file: 'decaimento.html',
    color: '#44ff88',
  },
  {
    id: 'moleculas',
    title: 'Estruturas Moleculares 3D',
    icon: '🧪',
    description: 'Visualize H2O, CO2, CH4, NH3, Benzeno e Etanol em 3D',
    file: 'moleculas.html',
    color: '#ff6688',
  },
  {
    id: 'difusao',
    title: 'Difusão de Moléculas',
    icon: '💨',
    description: 'Difusão simples, osmose e efeito da temperatura em partículas',
    file: 'difusao.html',
    color: '#44aaff',
  },
  {
    id: 'ligacoes',
    title: 'Ligações Químicas',
    icon: '⚗️',
    description: 'Ligações iônicas, covalentes, metálicas e pontes de hidrogênio',
    file: 'ligacoes.html',
    color: '#88ddff',
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
