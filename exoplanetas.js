// ============================================================
// DADOS DOS 10 SISTEMAS
// ============================================================
const SYSTEMS = [
  {
    id: 'solar', name: 'Sistema Solar',
    desc: 'Nosso sistema. 8 planetas, estrela G2V. O sistema mais bem estudado.',
    star: { name: 'Sol', type: 'G2V (anã amarela)', radius: 2.5, color: '#ffdd44', emissive: '#ff8800' },
    planets: [
      { name: 'Mercúrio', r: 0.25, orb: 3.5, spd: 1.8, col: '#b5b5b5' },
      { name: 'Vênus',    r: 0.45, orb: 5.0, spd: 1.4, col: '#e8cda0' },
      { name: 'Terra',    r: 0.50, orb: 6.5, spd: 1.2, col: '#4a90d9' },
      { name: 'Marte',    r: 0.35, orb: 8.0, spd: 1.0, col: '#c1440e' },
      { name: 'Júpiter',  r: 1.30, orb: 10.5, spd: 0.6, col: '#d4a574' },
      { name: 'Saturno',  r: 1.10, orb: 13.0, spd: 0.45, col: '#ead6b8' },
      { name: 'Urano',    r: 0.70, orb: 15.5, spd: 0.3, col: '#7ec8e3' },
      { name: 'Netuno',   r: 0.65, orb: 18.0, spd: 0.2, col: '#3f54ba' },
    ],
  },
  {
    id: 'trappist1', name: 'TRAPPIST-1',
    desc: 'Sistema com 7 planetas rochosos. Estrela anã ultra-fria M8V. Todos bem medidos.',
    star: { name: 'TRAPPIST-1', type: 'M8V (anã vermelha)', radius: 0.9, color: '#ff6633', emissive: '#cc3300' },
    planets: [
      { name: 'TRAPPIST-1b', r: 0.30, orb: 1.8, spd: 6.0, col: '#aa7744' },
      { name: 'TRAPPIST-1c', r: 0.28, orb: 2.5, spd: 4.5, col: '#cc8855' },
      { name: 'TRAPPIST-1d', r: 0.22, orb: 3.2, spd: 3.5, col: '#6699aa' },
      { name: 'TRAPPIST-1e', r: 0.26, orb: 3.9, spd: 2.8, col: '#558877' },
      { name: 'TRAPPIST-1f', r: 0.28, orb: 4.6, spd: 2.2, col: '#779966' },
      { name: 'TRAPPIST-1g', r: 0.30, orb: 5.3, spd: 1.8, col: '#997766' },
      { name: 'TRAPPIST-1h', r: 0.22, orb: 6.0, spd: 1.5, col: '#668899' },
    ],
  },
  {
    id: 'kepler90', name: 'Kepler-90',
    desc: '8 planetas como o Solar System. Estrela G2. Sistema compacto descoberto pelo Kepler.',
    star: { name: 'Kepler-90', type: 'G2V (anã amarela)', radius: 2.2, color: '#ffdd44', emissive: '#ff8800' },
    planets: [
      { name: 'Kepler-90b', r: 0.30, orb: 2.0, spd: 5.0, col: '#aa8866' },
      { name: 'Kepler-90c', r: 0.25, orb: 2.8, spd: 3.8, col: '#bb9977' },
      { name: 'Kepler-90d', r: 0.40, orb: 3.8, spd: 2.8, col: '#ccaa88' },
      { name: 'Kepler-90e', r: 0.35, orb: 5.0, spd: 2.0, col: '#7799bb' },
      { name: 'Kepler-90f', r: 0.30, orb: 6.2, spd: 1.5, col: '#88aacc' },
      { name: 'Kepler-90g', r: 0.55, orb: 7.5, spd: 1.2, col: '#ddaa77' },
      { name: 'Kepler-90h', r: 0.60, orb: 9.0, spd: 0.9, col: '#ccbbaa' },
      { name: 'Kepler-90i', r: 0.20, orb: 1.4, spd: 7.0, col: '#998866' },
    ],
  },
  {
    id: 'hd10180', name: 'HD 10180',
    desc: 'Sistema rico com até 7 planetas. Estrela similar ao Sol. Arquitetura orbital complexa.',
    star: { name: 'HD 10180', type: 'G1V (anã amarela)', radius: 2.3, color: '#ffdd44', emissive: '#ff8800' },
    planets: [
      { name: 'HD 10180b', r: 0.20, orb: 1.8, spd: 6.0, col: '#886644' },
      { name: 'HD 10180c', r: 0.30, orb: 2.8, spd: 4.0, col: '#aa7755' },
      { name: 'HD 10180d', r: 0.35, orb: 3.8, spd: 3.0, col: '#cc9966' },
      { name: 'HD 10180e', r: 0.40, orb: 5.0, spd: 2.2, col: '#669988' },
      { name: 'HD 10180f', r: 0.45, orb: 6.5, spd: 1.6, col: '#5588aa' },
      { name: 'HD 10180g', r: 0.30, orb: 8.0, spd: 1.2, col: '#7799bb' },
      { name: 'HD 10180h', r: 0.50, orb: 10.0, spd: 0.8, col: '#aa9977' },
    ],
  },
  {
    id: 'hr8799', name: 'HR 8799',
    desc: 'Sistema com 4 gigantes gasosos orbitando estrela A5V. Imagens diretas obtidas.',
    star: { name: 'HR 8799', type: 'A5V (anã branco-azulada)', radius: 3.0, color: '#eeeeff', emissive: '#ccddff' },
    planets: [
      { name: 'HR 8799e', r: 0.90, orb: 4.0, spd: 2.5, col: '#ddaa66' },
      { name: 'HR 8799d', r: 1.00, orb: 6.0, spd: 1.6, col: '#ccbb88' },
      { name: 'HR 8799c', r: 1.10, orb: 8.5, spd: 1.0, col: '#bbaa77' },
      { name: 'HR 8799b', r: 1.20, orb: 11.5, spd: 0.6, col: '#aa9966' },
    ],
  },
  {
    id: 'kepler11', name: 'Kepler-11',
    desc: '6 planetas muito próximos entre si. Estrela G4V. Sistema compacto e denso.',
    star: { name: 'Kepler-11', type: 'G4V (anã amarela)', radius: 2.1, color: '#ffdd44', emissive: '#ff8800' },
    planets: [
      { name: 'Kepler-11b', r: 0.30, orb: 1.5, spd: 7.0, col: '#aa7744' },
      { name: 'Kepler-11c', r: 0.35, orb: 2.2, spd: 5.0, col: '#cc8844' },
      { name: 'Kepler-11d', r: 0.40, orb: 3.0, spd: 3.5, col: '#bb9966' },
      { name: 'Kepler-11e', r: 0.45, orb: 3.8, spd: 2.8, col: '#7799aa' },
      { name: 'Kepler-11f', r: 0.35, orb: 4.6, spd: 2.0, col: '#88aabb' },
      { name: 'Kepler-11g', r: 0.50, orb: 5.5, spd: 1.5, col: '#aa8877' },
    ],
  },
  {
    id: '55cancri', name: '55 Cancri',
    desc: '5 planetas orbitando estrela K4V. Um dos primeiros sistemas multiplanetários descobertos.',
    star: { name: '55 Cancri A', type: 'K4V (anã laranja)', radius: 2.0, color: '#ffaa33', emissive: '#ee7700' },
    planets: [
      { name: '55 Cancri e', r: 0.28, orb: 1.8, spd: 6.0, col: '#cc6644' },
      { name: '55 Cancri b', r: 0.90, orb: 3.5, spd: 3.0, col: '#ddaa77' },
      { name: '55 Cancri c', r: 0.75, orb: 5.5, spd: 2.0, col: '#ccbb88' },
      { name: '55 Cancri d', r: 0.85, orb: 8.0, spd: 1.2, col: '#bbaa77' },
      { name: '55 Cancri f', r: 0.65, orb: 10.5, spd: 0.8, col: '#aa9977' },
    ],
  },
  {
    id: 'hd219134', name: 'HD 219134',
    desc: '6 planetas. Estrela K3V próxima (21 anos-luz). Um dos sistemas mais próximos da Terra.',
    star: { name: 'HD 219134', type: 'K3V (anã laranja)', radius: 1.9, color: '#ffaa33', emissive: '#ee7700' },
    planets: [
      { name: 'HD 219134b', r: 0.30, orb: 1.6, spd: 6.5, col: '#997755' },
      { name: 'HD 219134c', r: 0.35, orb: 2.4, spd: 4.5, col: '#aa8866' },
      { name: 'HD 219134d', r: 0.25, orb: 3.2, spd: 3.2, col: '#779966' },
      { name: 'HD 219134e', r: 0.40, orb: 4.2, spd: 2.4, col: '#6699aa' },
      { name: 'HD 219134f', r: 0.45, orb: 5.5, spd: 1.6, col: '#88aacc' },
      { name: 'HD 219134g', r: 0.50, orb: 7.0, spd: 1.0, col: '#bb9977' },
    ],
  },
  {
    id: 'toi178', name: 'TOI-178',
    desc: '6 planetas em cadeia de ressonância orbital. Estrela K. Arquitetura notável.',
    star: { name: 'TOI-178', type: 'K5V (anã laranja)', radius: 1.8, color: '#ff9933', emissive: '#ee6600' },
    planets: [
      { name: 'TOI-178b', r: 0.22, orb: 1.5, spd: 7.0, col: '#887766' },
      { name: 'TOI-178c', r: 0.26, orb: 2.2, spd: 5.0, col: '#997766' },
      { name: 'TOI-178d', r: 0.30, orb: 3.0, spd: 3.6, col: '#668877' },
      { name: 'TOI-178e', r: 0.34, orb: 3.8, spd: 2.8, col: '#7799aa' },
      { name: 'TOI-178f', r: 0.38, orb: 4.6, spd: 2.0, col: '#5588aa' },
      { name: 'TOI-178g', r: 0.42, orb: 5.5, spd: 1.5, col: '#88aabb' },
    ],
  },
  {
    id: 'lhs1140', name: 'LHS 1140',
    desc: '2 planetas confirmados. Estrela anã vermelha M4.5V. Inclui planeta rochoso na zona habitável.',
    star: { name: 'LHS 1140', type: 'M4.5V (anã vermelha)', radius: 0.7, color: '#ff5533', emissive: '#cc2200' },
    planets: [
      { name: 'LHS 1140b', r: 0.32, orb: 2.5, spd: 4.0, col: '#558877' },
      { name: 'LHS 1140c', r: 0.28, orb: 4.0, spd: 2.5, col: '#669988' },
    ],
  },
];

window.currentSystemIdx = 0;

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000008);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
camera.position.set(18, 14, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
container.appendChild(renderer.domElement);

// ============================================================
// CONTROLES
// ============================================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);
controls.update();

const DEF_CAM = new THREE.Vector3(18, 14, 20);
function resetCamera() { camera.position.copy(DEF_CAM); controls.target.set(0, 0, 0); controls.update(); }

// ============================================================
// ILUMINAÇÃO
// ============================================================
scene.add(new THREE.AmbientLight(0x222244, 0.25));
const sunLight = new THREE.PointLight(0xffffff, 2.0, 80);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024; sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);
scene.add(new THREE.DirectionalLight(0x4444aa, 0.15).position.set(-15, 10, -20));

// ============================================================
// MATERIAIS
// ============================================================
function makeMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.05,
    emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color('#000000'),
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    side: opts.side ?? THREE.FrontSide,
  });
}

const matOrbit = new THREE.LineBasicMaterial({ color: '#555577', transparent: true, opacity: 0.15 });

// ============================================================
// ESTRELAS
// ============================================================
(function createStars() {
  const count = 5000, geo = new THREE.BufferGeometry(), pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1), r = 100 + Math.random() * 250;
    pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=r*Math.cos(p); pos[i*3+2]=r*Math.sin(p)*Math.sin(t);
    const c = 0.3 + Math.random() * 0.7, tint = Math.random();
    col[i*3]=tint<0.1?c:c; col[i*3+1]=c; col[i*3+2]=tint>0.9?c:c;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.7 })));
})();

// ============================================================
// ESTADO
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);
let bodies = {};
let structures = {};
let hitTargets = [];
let currentHighlight = null;
let isExploded = false;
let explodeProgress = 0;
let targetExplodeProgress = 0;
const originalPositions = new Map();
const simClock = new THREE.Clock();
let rotationEnabled = true;
let speedMultiplier = 1;

// ============================================================
// CONSTRUIR SISTEMA
// ============================================================
function buildSystem(sysIdx) {
  while (mainGroup.children.length) { const c = mainGroup.children[0]; mainGroup.remove(c); if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); }
  bodies = {}; structures = {}; hitTargets = []; currentHighlight = null; originalPositions.clear();
  isExploded = false; explodeProgress = 0; targetExplodeProgress = 0;
  window.currentSystemIdx = sysIdx;

  const sys = SYSTEMS[sysIdx];
  const sd = sys.star;

  // Star
  const starMat = makeMat(sd.color, { roughness: 0.2, emissive: sd.emissive, emissiveIntensity: 0.5 });
  const starMesh = new THREE.Mesh(new THREE.SphereGeometry(sd.radius, 40, 40), starMat);
  starMesh.userData.orgId = 'star';
  starMesh.castShadow = true;
  mainGroup.add(starMesh);
  structures.star = starMesh;

  const glow1 = new THREE.Mesh(new THREE.SphereGeometry(sd.radius * 1.12, 24, 24),
    new THREE.MeshBasicMaterial({ color: sd.color, transparent: true, opacity: 0.08 }));
  glow1.userData.orgId = 'star'; mainGroup.add(glow1);
  const glow2 = new THREE.Mesh(new THREE.SphereGeometry(sd.radius * 1.35, 20, 20),
    new THREE.MeshBasicMaterial({ color: sd.emissive, transparent: true, opacity: 0.03 }));
  glow2.userData.orgId = 'star'; mainGroup.add(glow2);

  bodies.star = { mesh: starMesh, angle: 0 };

  // Orbits
  const orbGroup = new THREE.Group(); orbGroup.name = 'Órbitas';
  for (const p of sys.planets) {
    if (p.orb <= 0) continue;
    const pts = []; const segs = 48;
    for (let i = 0; i <= segs; i++) { const a = (i/segs)*Math.PI*2; pts.push(new THREE.Vector3(p.orb*Math.cos(a), 0, p.orb*Math.sin(a))); }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matOrbit);
    line.userData.orgId = 'orbits';
    orbGroup.add(line);
  }
  structures.orbits = orbGroup; mainGroup.add(orbGroup);

  // Planets
  for (let i = 0; i < sys.planets.length; i++) {
    const p = sys.planets[i];
    const mat = makeMat(p.col, { roughness: 0.5 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 24, 18), mat);
    mesh.userData.orgId = 'p_' + i;
    mesh.castShadow = true;

    const group = new THREE.Group();
    group.add(mesh);
    const angle0 = Math.random() * Math.PI * 2;
    group.position.x = p.orb * Math.cos(angle0);
    group.position.z = p.orb * Math.sin(angle0);
    mainGroup.add(group);

    structures['p_' + i] = group;
    bodies['p_' + i] = { group, mesh, data: p, angle: angle0 };
  }

  // Collect targets
  mainGroup.traverse(c => { if (c.isMesh && c.userData.orgId && c.userData.orgId !== 'orbits') hitTargets.push(c); });

  // Store positions for explode
  for (const [id, g] of Object.entries(structures)) {
    if (g && g.isObject3D) originalPositions.set(id, g.position.clone());
  }

  updateUI();
  updateSystemInfo();
  highlight(null);
}

// ============================================================
// UI DINÂMICA
// ============================================================
function updateUI() {
  const list = document.getElementById('structure-list');
  list.innerHTML = '';
  const sys = SYSTEMS[window.currentSystemIdx];

  const starItem = makeCheckItem('star', sys.star.name, '#ffdd44', true);
  list.appendChild(starItem);

  for (let i = 0; i < sys.planets.length; i++) {
    const p = sys.planets[i];
    const item = makeCheckItem('p_' + i, p.name, p.col, true);
    list.appendChild(item);
  }

  const orbItem = makeCheckItem('orbits', 'Órbitas', '#555577', true);
  list.appendChild(orbItem);

  // Buttons
  const btnGroup = document.getElementById('btn-group');
  btnGroup.innerHTML = '';
  const mk = (t, c, fn) => { const b = document.createElement('button'); b.className='btn '+c; b.textContent=t; b.addEventListener('click',fn); btnGroup.appendChild(b); return b; };
  mk('Mostrar Tudo', 'btn-primary', () => {
    for (const [id,g] of Object.entries(structures)) g.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = true);
  });
  mk('Ocultar Tudo', 'btn-danger', () => {
    for (const [id,g] of Object.entries(structures)) g.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  });
  mk('Resetar Câmera', '', resetCamera);
  const eb = mk('Explodir', 'btn-warning', () => {
    isExploded = !isExploded;
    targetExplodeProgress = isExploded ? 1 : 0;
    eb.textContent = isExploded ? 'Restaurar' : 'Explodir';
  });

  // Speed
  const spdLabel = document.createElement('div');
  spdLabel.style.cssText = 'width:100%;font-size:10px;color:#a0a0cc;text-align:center;margin-top:4px;';
  spdLabel.textContent = 'VELOCIDADE ORBITAL';
  btnGroup.appendChild(spdLabel);
  const spdRow = document.createElement('div'); spdRow.style.cssText = 'display:flex;gap:4px;width:100%;';
  const speeds = [0.5, 1, 3, 10, 30, 100];
  for (const s of speeds) {
    const sb = document.createElement('button');
    sb.className = 'btn';
    sb.textContent = s + '×';
    sb.style.cssText = `flex:1;min-width:0;padding:6px 2px;font-size:9px;border-color:${s===speedMultiplier?'#7c4dff':'var(--border-color)'};background:${s===speedMultiplier?'rgba(124,77,255,0.15)':'transparent'};color:${s===speedMultiplier?'#7c4dff':'var(--text-primary)'}`;
    sb.addEventListener('click', () => {
      speedMultiplier = s;
      spdRow.querySelectorAll('button').forEach(b => { b.style.borderColor='var(--border-color)'; b.style.background='transparent'; b.style.color='var(--text-primary)'; });
      sb.style.borderColor='#7c4dff'; sb.style.background='rgba(124,77,255,0.15)'; sb.style.color='#7c4dff';
    });
    spdRow.appendChild(sb);
  }
  btnGroup.appendChild(spdRow);
}

function makeCheckItem(id, label, color, checked) {
  const item = document.createElement('label'); item.className = 'structure-item';
  const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=checked; cb.dataset.id=id;
  const dot = document.createElement('span'); dot.className='color-dot'; dot.style.background=color;
  const lbl = document.createElement('span'); lbl.className='structure-label'; lbl.textContent=label;
  item.append(cb,dot,lbl);
  cb.addEventListener('change', () => { if (structures[id]) structures[id].visible = cb.checked; });
  return item;
}

function updateSystemInfo() {
  const sys = SYSTEMS[window.currentSystemIdx];
  document.getElementById('system-info').innerHTML =
    `<strong>${sys.name}</strong><br>${sys.desc}<br>Estrela: ${sys.star.type} | ${sys.planets.length} planetas`;
}

// ============================================================
// SELEÇÃO
// ============================================================
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');

function getObjId(obj) { while (obj) { if (obj.userData.orgId) return obj.userData.orgId; obj = obj.parent; } return null; }

function highlight(id) {
  if (currentHighlight) {
    for (const m of currentHighlight.meshes) { if (m.material) { m.material.emissive=new THREE.Color('#000000'); m.material.emissiveIntensity=0; } }
  }
  if (!id) { currentHighlight=null; infoPanel.classList.remove('visible'); return; }

  const sys = SYSTEMS[window.currentSystemIdx];
  let name = '', desc = '', func = '';
  if (id === 'star') {
    name = sys.star.name;
    desc = `Estrela tipo ${sys.star.type}.`;
    func = `Estrela central do sistema ${sys.name}.`;
  } else if (id.startsWith('p_')) {
    const idx = parseInt(id.slice(2));
    const p = sys.planets[idx];
    if (p) { name = p.name; desc = `Planeta do sistema ${sys.name}.`; func = `Planeta ${idx+1} do sistema.`; }
  }

  if (!name) return;

  const meshes = []; const g = structures[id];
  if (g) g.traverse(c => { if (c.isMesh) meshes.push(c); });
  for (const m of meshes) { if (m.material) { m.material.emissive=new THREE.Color('#7c4dff'); m.material.emissiveIntensity=0.3; } }
  currentHighlight = { id, meshes };
  infoName.textContent = name; infoDesc.textContent = desc; infoFunc.textContent = `Dados: ${func}`;
  infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2(((e.clientX-rect.left)/rect.width)*2-1, -((e.clientY-rect.top)/rect.height)*2+1);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hitTargets, false);
  highlight(hits.length ? getObjId(hits[0]) : null);
});

// ============================================================
// SELECTOR
// ============================================================
const sel = document.getElementById('system-selector');
for (let i = 0; i < SYSTEMS.length; i++) {
  const opt = document.createElement('option');
  opt.value = i; opt.textContent = SYSTEMS[i].name;
  sel.appendChild(opt);
}
sel.addEventListener('change', () => { buildSystem(parseInt(sel.value)); });
buildSystem(0);

// ============================================================
// ANIMAÇÕES
// ============================================================
function updateAnimations(time, delta) {
  if (rotationEnabled) mainGroup.rotation.y += delta * 0.005;

  for (const key of Object.keys(bodies)) {
    const b = bodies[key];
    if (!b || !b.data) continue;
    b.angle += delta * b.data.spd * speedMultiplier;
    if (b.data.orb > 0) {
      b.group.position.x = b.data.orb * Math.cos(b.angle);
      b.group.position.z = b.data.orb * Math.sin(b.angle);
      b.mesh.rotation.y += delta * 0.5;
    }
  }

  // Star pulse
  if (bodies.star) {
    const pulse = 0.7 + 0.3 * Math.sin(time * 0.4);
    bodies.star.mesh.material.emissiveIntensity = 0.3 + 0.4 * pulse;
  }

  // Explode
  if (Math.abs(explodeProgress - targetExplodeProgress) > 0.001) {
    explodeProgress += (targetExplodeProgress - explodeProgress) * 0.06;
    for (const [id, g] of Object.entries(structures)) {
      const orig = originalPositions.get(id);
      if (orig && g) {
        const dir = orig.clone().normalize();
        const len = orig.length();
        g.position.copy(dir.multiplyScalar(len + 4 * explodeProgress));
      }
    }
  }
}

// ============================================================
// RESIZE / LOOP
// ============================================================
window.addEventListener('resize', () => {
  const w = container.clientWidth, h = container.clientHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateAnimations(simClock.getElapsedTime(), simClock.getDelta());
  renderer.render(scene, camera);
}
animate();

console.log('🌌 Simulação de Sistemas Exoplanetários carregada!');
