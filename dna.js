// ============================================================
// CONFIGURAÇÃO DA DUPLA HÉLICE
// ============================================================
const NUM_PAIRS = 28;
const HELIX_RADIUS = 2.0;
const RISE_PER_PAIR = 0.5;
const TWIST_PER_PAIR = Math.PI * 2 / 10;
const DNA_HEIGHT = NUM_PAIRS * RISE_PER_PAIR;
const EXPLODE_FACTOR = 1.6;

const BASES = ['A', 'T', 'G', 'C'];
const COMPLEMENT = { A: 'T', T: 'A', G: 'C', C: 'G' };
const BASE_COLORS = { A: '#4CAF50', T: '#F44336', G: '#2196F3', C: '#FF9800' };
const BASE_NAMES = { A: 'Adenina', T: 'Timina', G: 'Guanina', C: 'Citosina' };
const BASE_PURINE = { A: true, T: false, G: true, C: false };

function generateSequence() {
  const seq = [];
  for (let i = 0; i < NUM_PAIRS; i++) {
    seq.push(BASES[Math.floor(Math.random() * 4)]);
  }
  return seq;
}
const SEQUENCE = generateSequence();

const STRUCTURE_CONFIG = [
  { id: 'backbone',       name: 'Arcabouço (Açúcar-Fosfato)', color: '#8a8a8a' },
  { id: 'adenine',        name: 'Adenina (A)',               color: '#4CAF50' },
  { id: 'thymine',        name: 'Timina (T)',                color: '#F44336' },
  { id: 'guanine',        name: 'Guanina (G)',               color: '#2196F3' },
  { id: 'cytosine',       name: 'Citosina (C)',              color: '#FF9800' },
  { id: 'basePairs',      name: 'Pares de Bases',            color: '#ffffff' },
  { id: 'hydrogenBonds',  name: 'Pontes de Hidrogênio',      color: '#00e5ff' },
  { id: 'sugars',         name: 'Açúcares (Desoxirribose)',  color: '#66bb6a' },
  { id: 'phosphates',     name: 'Grupos Fosfato',            color: '#42a5f5' },
];

const STRUCTURE_INFO = {
  backbone: {
    description: 'Cadeia alternante de moléculas de desoxirribose e fosfato unidas por ligações fosfodiéster 5\'→3\', formando duas fitas antiparalelas.',
    function: 'Suporte estrutural da dupla hélice; protege as bases nitrogenadas e determina a polaridade da fita.',
  },
  adenine: {
    description: 'Base nitrogenada púrica (derivada da purina) com anel duplo. Emparelha-se com Timina por 2 pontes de hidrogênio.',
    function: 'Codificação da informação genética; complementar à Timina; participa da síntese de ATP e NAD.',
  },
  thymine: {
    description: 'Base nitrogenada pirimídica com anel simples. Emparelha-se com Adenina por 2 pontes de hidrogênio. Exclusiva do DNA.',
    function: 'Codificação genética; complementar à Adenina; substituída por Uracila no RNA.',
  },
  guanine: {
    description: 'Base nitrogenada púrica com anel duplo. Emparelha-se com Citosina por 3 pontes de hidrogênio.',
    function: 'Codificação genética; as três pontes de hidrogênio conferem maior estabilidade ao par G-C.',
  },
  cytosine: {
    description: 'Base nitrogenada pirimídica com anel simples. Emparelha-se com Guanina por 3 pontes de hidrogênio.',
    function: 'Codificação genética; complementar à Guanina; sua metilação regula a expressão gênica.',
  },
  basePairs: {
    description: 'Conjunto de bases nitrogenadas emparelhadas no centro da dupla hélice. A-T (2 ligações) e G-C (3 ligações).',
    function: 'Armazenamento da informação genética na sequência linear de pares de bases.',
  },
  hydrogenBonds: {
    description: 'Ligações intermoleculares fracas (2 entre A-T, 3 entre G-C) que mantém as duas fitas unidas.',
    function: 'Permitem a separação temporária das fitas durante replicação, transcrição e reparo do DNA.',
  },
  sugars: {
    description: 'Moléculas de desoxirribose (C₅H₁₀O₄), pentose com 5 carbonos (1\' a 5\'), formando o backbone.',
    function: 'Componente estrutural; o carbono 3\' e 5\' formam ligações fosfodiéster com os fosfatos.',
  },
  phosphates: {
    description: 'Grupos fosfato (PO₄³⁻) carregados negativamente que conectam açúcares adjacentes.',
    function: 'Conferem carga negativa ao DNA; ligam nucleotídeos formando a cadeia polinucleotídica.',
  },
};

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1e);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(12, 8, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// ============================================================
// CONTROLES
// ============================================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 40;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(12, 8, 14);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// ILUMINAÇÃO
// ============================================================
scene.add(new THREE.AmbientLight(0x404060, 0.5));
scene.add(new THREE.HemisphereLight(0x6060ff, 0x404040, 0.7));

const mainLight = new THREE.DirectionalLight(0xffeedd, 2.0);
mainLight.position.set(15, 20, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.camera.near = 1;
mainLight.shadow.camera.far = 40;
mainLight.shadow.camera.left = -15;
mainLight.shadow.camera.right = 15;
mainLight.shadow.camera.top = 15;
mainLight.shadow.camera.bottom = -15;
scene.add(mainLight);
scene.add(new THREE.DirectionalLight(0x8888ff, 0.4).position.set(-10, 5, -15));
scene.add(new THREE.DirectionalLight(0xffffff, 0.3).position.set(-5, -15, -10));

// ============================================================
// MATERIAIS
// ============================================================
function makeMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.4,
    metalness: opts.metalness ?? 0.0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    clearcoat: opts.clearcoat ?? 0.0,
    side: opts.side ?? THREE.FrontSide,
  });
}

const matBackbone  = makeMat('#8a8a8a', { roughness: 0.3, metalness: 0.1 });
const matAdenine   = makeMat('#4CAF50', { roughness: 0.5, clearcoat: 0.2 });
const matThymine   = makeMat('#F44336', { roughness: 0.5, clearcoat: 0.2 });
const matGuanine   = makeMat('#2196F3', { roughness: 0.5, clearcoat: 0.2 });
const matCytosine  = makeMat('#FF9800', { roughness: 0.5, clearcoat: 0.2 });
const matH1        = new THREE.MeshBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.4 });
const matHSolid    = new THREE.MeshBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.6 });
const matSugar     = makeMat('#66bb6a', { roughness: 0.6 });
const matPhosphate = makeMat('#42a5f5', { roughness: 0.3, clearcoat: 0.2 });
const matRung      = new THREE.MeshPhysicalMaterial({
  color: '#ffffff', transparent: true, opacity: 0.08, roughness: 0.2, side: THREE.DoubleSide,
});

const BASE_MATERIALS = { A: matAdenine, T: matThymine, G: matGuanine, C: matCytosine };

// ============================================================
// CRIAÇÃO DOS COMPONENTES DO DNA
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

function getBasePos(i, side) {
  const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
  const angle = i * TWIST_PER_PAIR + (side === 2 ? Math.PI : 0);
  return new THREE.Vector3(
    HELIX_RADIUS * Math.cos(angle), y, HELIX_RADIUS * Math.sin(angle)
  );
}

// --- Backbone (Arcabouço) ---
function createBackbone() {
  const group = new THREE.Group();
  group.name = 'Arcabouço';

  for (let side = 0; side < 2; side++) {
    const pts = [];
    for (let i = 0; i <= NUM_PAIRS; i++) {
      const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
      const angle = i * TWIST_PER_PAIR + (side === 1 ? Math.PI : 0);
      const r = HELIX_RADIUS + 0.05;
      pts.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, NUM_PAIRS * 3, 0.14, 8, false),
      matBackbone
    );
    tube.userData.organelleId = 'backbone';
    tube.castShadow = true;
    group.add(tube);

    for (let i = 0; i <= NUM_PAIRS; i += 2) {
      const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
      const angle = i * TWIST_PER_PAIR + (side === 1 ? Math.PI : 0);
      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), matBackbone);
      joint.position.set(HELIX_RADIUS * Math.cos(angle), y, HELIX_RADIUS * Math.sin(angle));
      joint.userData.organelleId = 'backbone';
      group.add(joint);
    }
  }

  return group;
}

// --- Açúcares ---
function createSugars() {
  const group = new THREE.Group();
  group.name = 'Açúcares';
  const sugarGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.16, 5);

  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < NUM_PAIRS; i++) {
      const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
      const angle = i * TWIST_PER_PAIR + (side === 1 ? Math.PI : 0);
      const r = HELIX_RADIUS - 0.1;
      const sugar = new THREE.Mesh(sugarGeo, matSugar);
      sugar.position.set(r * Math.cos(angle), y - 0.05, r * Math.sin(angle));
      sugar.rotation.y = angle;
      sugar.userData.organelleId = 'sugars';
      group.add(sugar);
    }
  }
  return group;
}

// --- Fosfatos ---
function createPhosphates() {
  const group = new THREE.Group();
  group.name = 'Fosfatos';
  const phosGeo = new THREE.SphereGeometry(0.1, 6, 6);

  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < NUM_PAIRS; i++) {
      const y = (i + 0.5) * RISE_PER_PAIR - DNA_HEIGHT / 2;
      const angle = (i + 0.5) * TWIST_PER_PAIR + (side === 1 ? Math.PI : 0);
      const r = HELIX_RADIUS + 0.1;
      const phos = new THREE.Mesh(phosGeo, matPhosphate);
      phos.position.set(r * Math.cos(angle), y, r * Math.sin(angle));
      phos.userData.organelleId = 'phosphates';
      group.add(phos);
    }
  }
  return group;
}

// --- Bases Nitrogenadas ---
function createBases() {
  const groups = { A: new THREE.Group(), T: new THREE.Group(), G: new THREE.Group(), C: new THREE.Group() };
  for (const k of Object.keys(groups)) {
    groups[k].name = BASE_NAMES[k];
  }
  const pairGroup = new THREE.Group();
  pairGroup.name = 'Pares de Bases';

  for (let i = 0; i < NUM_PAIRS; i++) {
    const base = SEQUENCE[i];
    const comp = COMPLEMENT[base];
    const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
    const angle = i * TWIST_PER_PAIR;

    const p1 = getBasePos(i, 1);
    const p2 = getBasePos(i, 2);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    const isPurine1 = BASE_PURINE[base];
    const isPurine2 = BASE_PURINE[comp];
    const len1 = isPurine1 ? 0.85 : 0.55;
    const len2 = isPurine2 ? 0.85 : 0.55;
    const w1 = isPurine1 ? 0.2 : 0.14;
    const w2 = isPurine2 ? 0.2 : 0.14;

    const dir1 = new THREE.Vector3().subVectors(mid, p1).normalize();
    const dir2 = new THREE.Vector3().subVectors(mid, p2).normalize();

    const base1 = createBaseShape(base, p1, dir1, len1, w1, angle);
    const base2 = createBaseShape(comp, p2, dir2, len2, w2, angle + Math.PI);

    groups[base].add(base1);
    groups[comp].add(base2);

    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, p1.distanceTo(p2) * 0.7, 4),
      matRung
    );
    rung.position.copy(mid);
    rung.lookAt(p1);
    rung.rotateX(Math.PI / 2);
    rung.userData.organelleId = 'basePairs';
    pairGroup.add(rung);
  }

  const result = new THREE.Group();
  for (const k of Object.keys(groups)) result.add(groups[k]);
  result.add(pairGroup);
  return result;
}

function createBaseShape(base, pos, dir, len, width, rotY) {
  const geo = new THREE.BoxGeometry(width, 0.06, len);
  const mesh = new THREE.Mesh(geo, BASE_MATERIALS[base]);
  const center = pos.clone().add(dir.clone().multiplyScalar(len * 0.5));
  mesh.position.copy(center);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  mesh.rotation.y += rotY * 0.1;
  mesh.userData.organelleId = base === 'A' ? 'adenine' : base === 'T' ? 'thymine' : base === 'G' ? 'guanine' : 'cytosine';
  mesh.userData.baseType = base;
  return mesh;
}

// --- Pontes de Hidrogênio ---
function createHydrogenBonds() {
  const group = new THREE.Group();
  group.name = 'Pontes de Hidrogênio';

  for (let i = 0; i < NUM_PAIRS; i++) {
    const y = i * RISE_PER_PAIR - DNA_HEIGHT / 2;
    const angle = i * TWIST_PER_PAIR;
    const p1 = getBasePos(i, 1);
    const p2 = getBasePos(i, 2);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    const numBonds = SEQUENCE[i] === 'G' ? 3 : 2;
    const spread = 0.08;

    for (let b = 0; b < numBonds; b++) {
      const offset = (b - (numBonds - 1) / 2) * spread;
      const start = new THREE.Vector3(mid.x - 0.04, y + offset, mid.z);
      const end = new THREE.Vector3(mid.x + 0.04, y + offset, mid.z);
      const bond = createBondLine(start, end);
      bond.userData.organelleId = 'hydrogenBonds';
      group.add(bond);
    }
  }
  return group;
}

function createBondLine(start, end) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(0.015, 0.015, len, 4);
  const mesh = new THREE.Mesh(geo, matHSolid);
  mesh.position.copy(start).add(dir.multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}

// ============================================================
// ESTRELAS
// ============================================================
function createStars() {
  const starField = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: '#ffffff', size: 0.04, transparent: true, opacity: 0.5 })
  );
  const pos = new Float32Array(2000);
  for (let i = 0; i < 2000; i++) pos[i] = (Math.random() - 0.5) * 150;
  starField.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(starField);
}
createStars();

// ============================================================
// MONTAGEM DA CENA
// ============================================================
const structures = {};
const hitTargets = [];
let currentHighlight = null;

const backboneGroup = createBackbone();
structures.backbone = backboneGroup;
mainGroup.add(backboneGroup);

const sugarsGroup = createSugars();
structures.sugars = sugarsGroup;
mainGroup.add(sugarsGroup);

const phosphatesGroup = createPhosphates();
structures.phosphates = phosphatesGroup;
mainGroup.add(phosphatesGroup);

const basesGroup = createBases();
structures.adenine = basesGroup.children.find(c => c.name === 'Adenina');
structures.thymine = basesGroup.children.find(c => c.name === 'Timina');
structures.guanine = basesGroup.children.find(c => c.name === 'Guanina');
structures.cytosine = basesGroup.children.find(c => c.name === 'Citosina');
structures.basePairs = basesGroup.children.find(c => c.name === 'Pares de Bases');
mainGroup.add(basesGroup);

const hBondsGroup = createHydrogenBonds();
structures.hydrogenBonds = hBondsGroup;
mainGroup.add(hBondsGroup);

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.organelleId) hitTargets.push(obj);
  if (obj.children) for (const c of obj.children) collectHitTargets(c);
}
collectHitTargets(mainGroup);

const originalPositions = new Map();
function storePositions() {
  originalPositions.clear();
  for (const [id, g] of Object.entries(structures)) {
    if (g && g.isObject3D) originalPositions.set(id, g.position.clone());
  }
}
storePositions();

// ============================================================
// ANIMAÇÕES
// ============================================================
const clock = new THREE.Clock();
let cellRotationEnabled = true;
let isExploded = false;
let explodeProgress = 0;
let targetExplodeProgress = 0;

function updateAnimations(time, delta) {
  if (cellRotationEnabled) mainGroup.rotation.y += delta * 0.04;

  if (Math.abs(explodeProgress - targetExplodeProgress) > 0.001) {
    explodeProgress += (targetExplodeProgress - explodeProgress) * 0.06;
    for (const [id, g] of Object.entries(structures)) {
      const orig = originalPositions.get(id);
      if (orig && g) {
        if (id === 'basePairs' || id === 'hydrogenBonds') continue;
        const dir = orig.clone().normalize();
        const len = orig.length();
        const targetLen = len + 3 * explodeProgress;
        g.position.copy(dir.multiplyScalar(targetLen));
      }
    }
  }
}

// ============================================================
// SELEÇÃO
// ============================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');

function getOrganelleId(obj) {
  while (obj) {
    if (obj.userData.organelleId) return obj.userData.organelleId;
    obj = obj.parent;
  }
  return null;
}

function highlight(id) {
  if (currentHighlight) {
    for (const mesh of currentHighlight.meshes) {
      if (mesh.material) { mesh.material.emissive = new THREE.Color('#000000'); mesh.material.emissiveIntensity = 0; }
    }
  }
  if (!id) { currentHighlight = null; infoPanel.classList.remove('visible'); return; }

  const config = STRUCTURE_CONFIG.find(c => c.id === id);
  const info = STRUCTURE_INFO[id];
  if (!config || !info) return;

  const meshes = [];
  const group = structures[id];
  if (group) group.traverse(c => { if (c.isMesh) meshes.push(c); });

  for (const mesh of meshes) {
    if (mesh.material) { mesh.material.emissive = new THREE.Color('#00e5ff'); mesh.material.emissiveIntensity = 0.25; }
  }
  currentHighlight = { id, meshes };
  infoName.textContent = config.name;
  infoDesc.textContent = info.description;
  infoFunc.textContent = `Função: ${info.function}`;
  infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hitTargets, false);
  highlight(hits.length ? getOrganelleId(hits[0]) : null);
});

// ============================================================
// INTERFACE
// ============================================================
function createUI() {
  const list = document.getElementById('structure-list');
  for (const config of STRUCTURE_CONFIG) {
    const item = document.createElement('label');
    item.className = 'structure-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = true; cb.dataset.id = config.id;
    const dot = document.createElement('span');
    dot.className = 'color-dot'; dot.style.background = config.color;
    const label = document.createElement('span');
    label.className = 'structure-label'; label.textContent = config.name;
    item.append(cb, dot, label);
    cb.addEventListener('change', () => { if (structures[config.id]) structures[config.id].visible = cb.checked; });
    list.appendChild(item);
  }

  const btnGroup = document.getElementById('btn-group');
  const makeBtn = (text, cls, fn) => {
    const b = document.createElement('button');
    b.className = `btn ${cls}`; b.textContent = text; b.addEventListener('click', fn);
    btnGroup.appendChild(b);
    return b;
  };

  makeBtn('Mostrar Tudo', 'btn-primary', () => {
    for (const [id, g] of Object.entries(structures)) g.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = true);
  });
  makeBtn('Ocultar Tudo', 'btn-danger', () => {
    for (const [id, g] of Object.entries(structures)) g.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  });
  makeBtn('Resetar Câmera', '', resetCamera);

  const explodeBtn = makeBtn('Explodir', 'btn-warning', () => {
    isExploded = !isExploded;
    targetExplodeProgress = isExploded ? 1 : 0;
    explodeBtn.textContent = isExploded ? 'Restaurar' : 'Explodir';
  });
}
createUI();

// ============================================================
// REDIMENSIONAMENTO
// ============================================================
window.addEventListener('resize', () => {
  const w = container.clientWidth, h = container.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ============================================================
// LOOP
// ============================================================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateAnimations(clock.getElapsedTime(), clock.getDelta());
  renderer.render(scene, camera);
}
animate();

console.log('🧬 Simulação 3D de DNA carregada!');
