// ============================================================
// CONFIGURAÇÃO
// ============================================================
const STRUCT_CONFIG = [
  { id: 'coracao',   name: 'Coração',            color: '#ff4466', cat: 'Órgão Principal' },
  { id: 'arterias',  name: 'Artérias',           color: '#ff2244', cat: 'Vasos Sanguíneos' },
  { id: 'veias',     name: 'Veias',              color: '#4488ff', cat: 'Vasos Sanguíneos' },
  { id: 'capilares', name: 'Capilares',          color: '#ffaacc', cat: 'Vasos Sanguíneos' },
  { id: 'globulos',  name: 'Glóbulos Vermelhos', color: '#ff4466', cat: 'Células' },
  { id: 'pulmoes',   name: 'Pulmões',            color: '#cc88cc', cat: 'Órgãos' },
];

const STRUCT_INFO = {
  coracao: {
    description: 'Órgão muscular oco que funciona como bomba dupla, impulsionando o sangue por todo o sistema circulatório. Localiza-se no mediastino, entre os pulmões, ligeiramente à esquerda.',
    function: 'Bombeia sangue oxigenado para o corpo via aorta e sangue desoxigenado para os pulmões via artéria pulmonar. Gera 60-100 batimentos por minuto em repouso.',
  },
  arterias: {
    description: 'Vasos de paredes espessas e musculosas que transportam sangue do coração aos tecidos. A aorta, maior artéria do corpo, tem ~2,5 cm de diâmetro.',
    function: 'Distribuir sangue oxigenado (exceto artéria pulmonar) sob alta pressão para todos os órgãos e tecidos periféricos.',
  },
  veias: {
    description: 'Vasos de paredes mais finas que retornam o sangue ao coração. Possuem válvulas venosas que impedem refluxo e atuam como reservatório de volume.',
    function: 'Retornar sangue desoxigenado (exceto veias pulmonares) dos tecidos ao átrio direito, com auxílio da contração muscular esquelética.',
  },
  capilares: {
    description: 'Vasos microscópicos de parede única (endotélio) que formam redes entre arteríolas e vênulas. Diâmetro de 5-10 µm, apenas um eritrócito por vez.',
    function: 'Permitir difusão de O₂, CO₂, nutrientes e resíduos entre o sangue e os tecidos adjacentes (troca capilar).',
  },
  globulos: {
    description: 'Eritrócitos (hemácias) - células anucleadas em disco bicôncavo com ~7 µm, ricas em hemoglobina (~270 milhões por célula).',
    function: 'Transportar O₂ dos pulmões aos tecidos e CO₂ dos tecidos aos pulmões. Cada hemácia vive ~120 dias.',
  },
  pulmoes: {
    description: 'Órgãos pares, esponjosos e elásticos na cavidade torácica. O pulmão direito tem 3 lobos, o esquerdo 2 lobos (devido ao espaço cardíaco).',
    function: 'Realizar hematose: oxigenação do sangue venoso e eliminação de CO₂. Área de superfície alveolar total de ~70 m².',
  },
};

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(14, 8, 16);

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

const DEFAULT_CAMERA_POS = new THREE.Vector3(14, 8, 16);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// ILUMINAÇÃO
// ============================================================
const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x6060ff, 0x404040, 0.6);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.8);
mainLight.position.set(10, 15, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
fillLight.position.set(-8, 3, -10);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff4466, 0.3);
rimLight.position.set(-5, -10, -8);
scene.add(rimLight);

// ============================================================
// MATERIAIS
// ============================================================
function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.4,
    metalness: opts.metalness ?? 0.0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color(color),
    emissiveIntensity: opts.emissiveIntensity ?? 0.15,
    side: opts.side ?? THREE.FrontSide,
  });
}

const heartMat = makeMat('#ff4466', { roughness: 0.3, emissiveIntensity: 0.4 });
const arteryMat = makeMat('#ff2244', { roughness: 0.5, emissiveIntensity: 0.12 });
const veinMat = makeMat('#4488ff', { roughness: 0.5, emissiveIntensity: 0.12 });
const capillaryMat = makeMat('#ffaacc', { roughness: 0.6, transparent: true, opacity: 0.7, emissiveIntensity: 0.08 });
const bloodMat = makeMat('#ff4466', { roughness: 0.2, emissiveIntensity: 0.6 });
const lungMat = makeMat('#cc88cc', { roughness: 0.6, transparent: true, opacity: 0.35, emissiveIntensity: 0.05 });

// ============================================================
// CRIAÇÃO DAS ESTRUTURAS
// ============================================================
const structures = {};
const hitTargets = [];
const vesselData = [];
const bloodParticles = [];
let speed = 1;

// --- Heart ---
function createHeart() {
  const group = new THREE.Group();
  group.name = 'Coração';

  const geo = new THREE.SphereGeometry(1.0, 36, 36);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    y *= 1.3;
    if (y < -0.2) {
      const t = Math.min(1, (-y - 0.2) / 1.1);
      const taper = 1 - 0.45 * t;
      x *= taper; z *= taper;
    }
    if (y > 0.3) {
      const cf = Math.min(1, (y - 0.3) / 0.5);
      const sp = Math.exp(-x * x * 3) * Math.exp(-z * z * 3);
      x += Math.sign(x) * 0.2 * cf * sp;
    }
    z *= 0.8;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, heartMat);
  mesh.name = 'coracao';
  mesh.userData.org = 'coracao';
  mesh.castShadow = true;

  const glowGeo = new THREE.SphereGeometry(1.35, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({ color: '#ff4466', transparent: true, opacity: 0.08, side: THREE.BackSide });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.name = 'coracao-glow';

  group.add(mesh);
  group.add(glow);
  group.userData.heartMesh = mesh;
  group.userData.glowMesh = glow;

  structures.coracao = group;
  return group;
}

// --- Vessel helper ---
function createVessel(points, color, radius, structId, segments) {
  segments = segments || 48;
  const pts = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeGeo = new THREE.TubeGeometry(curve, segments, radius, 8, false);
  const mat = structId === 'veias' ? veinMat : arteryMat;
  const mesh = new THREE.Mesh(tubeGeo, mat);
  mesh.userData.org = structId;
  mesh.castShadow = true;

  const data = { curve, mesh, id: structId, particles: [] };

  const numP = Math.max(4, Math.floor(curve.getLength() * 0.7));
  for (let i = 0; i < numP; i++) {
    const t = i / numP;
    const pm = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(radius * 0.3, 0.04), 6, 6),
      bloodMat
    );
    const pos = curve.getPoint(t);
    pm.position.copy(pos);
    pm.userData.org = 'globulos';
    data.particles.push({ mesh: pm, t: t, speed: 0.04 + Math.random() * 0.03 });
    bloodParticles.push(pm);
  }

  vesselData.push(data);
  return mesh;
}

// --- Arteries ---
function createArteries() {
  const group = new THREE.Group();
  group.name = 'Artérias';

  const aorta = [
    { x: 0, y: -0.3, z: 0.2 }, { x: 0.1, y: 0.8, z: 0.3 },
    { x: 0.4, y: 1.8, z: 0.4 }, { x: 1.2, y: 2.8, z: 0.3 },
    { x: 2.4, y: 3.1, z: 0.1 }, { x: 3.2, y: 2.6, z: -0.1 },
    { x: 3.6, y: 1.5, z: -0.2 }, { x: 3.5, y: 0.2, z: -0.1 },
    { x: 3.2, y: -1.2, z: 0.1 }, { x: 2.8, y: -2.8, z: 0.2 },
    { x: 2.3, y: -4.2, z: 0.15 },
  ];
  group.add(createVessel(aorta, '#ff2244', 0.22, 'arterias', 64));

  const carotid = [
    { x: 1.2, y: 2.8, z: 0.3 }, { x: 0.9, y: 3.6, z: 0.2 },
    { x: 0.6, y: 4.8, z: -0.1 }, { x: 0.3, y: 6.2, z: -0.2 },
  ];
  group.add(createVessel(carotid, '#ff2244', 0.1, 'arterias', 32));

  const subclavian = [
    { x: 2.4, y: 3.1, z: 0.1 }, { x: 3.0, y: 3.6, z: 0.2 },
    { x: 3.8, y: 4.0, z: 0.1 }, { x: 4.8, y: 3.8, z: -0.1 },
  ];
  group.add(createVessel(subclavian, '#ff2244', 0.09, 'arterias', 24));

  const paL = [
    { x: 0, y: -0.1, z: 0.3 }, { x: -0.6, y: 0.4, z: 0.5 },
    { x: -1.5, y: 0.7, z: 0.3 }, { x: -2.4, y: 0.5, z: 0 },
  ];
  const paR = [
    { x: 0, y: -0.1, z: 0.3 }, { x: 0.6, y: 0.4, z: 0.5 },
    { x: 1.5, y: 0.7, z: 0.3 }, { x: 2.4, y: 0.5, z: 0 },
  ];
  group.add(createVessel(paL, '#ff4466', 0.12, 'arterias', 24));
  group.add(createVessel(paR, '#ff4466', 0.12, 'arterias', 24));

  structures.arterias = group;
  return group;
}

// --- Veins ---
function createVeins() {
  const group = new THREE.Group();
  group.name = 'Veias';

  const svc = [
    { x: -0.6, y: 5.5, z: -0.3 }, { x: -0.4, y: 4.0, z: -0.2 },
    { x: -0.2, y: 2.5, z: 0 },    { x: 0, y: 1.2, z: 0.2 },
  ];
  group.add(createVessel(svc, '#4488ff', 0.17, 'veias', 32));

  const ivc = [
    { x: 0.6, y: -5.0, z: 0.3 },  { x: 0.4, y: -3.5, z: 0.2 },
    { x: 0.2, y: -2.0, z: 0.1 },  { x: 0, y: -0.5, z: 0.2 },
  ];
  group.add(createVessel(ivc, '#4488ff', 0.17, 'veias', 32));

  const jugular = [
    { x: -0.8, y: 6.0, z: -0.2 }, { x: -0.7, y: 4.5, z: -0.1 },
    { x: -0.6, y: 3.5, z: -0.1 },
  ];
  group.add(createVessel(jugular, '#4488ff', 0.08, 'veias', 20));

  const pvl = [
    { x: -2.4, y: 0.2, z: 0 },    { x: -1.5, y: 0.1, z: 0.2 },
    { x: -0.5, y: 0.3, z: 0.1 },  { x: 0, y: 0.8, z: 0 },
  ];
  const pvr = [
    { x: 2.4, y: 0.2, z: 0 },     { x: 1.5, y: 0.1, z: 0.2 },
    { x: 0.5, y: 0.3, z: 0.1 },  { x: 0, y: 0.8, z: 0 },
  ];
  group.add(createVessel(pvl, '#ff6688', 0.1, 'veias', 20));
  group.add(createVessel(pvr, '#ff6688', 0.1, 'veias', 20));

  structures.veias = group;
  return group;
}

// --- Capillaries ---
function createCapillaries() {
  const group = new THREE.Group();
  group.name = 'Capilares';

  function addBranch(origin, dir, depth, maxD) {
    if (depth > maxD) return;
    const len = 0.35 + Math.random() * 0.25;
    const dn = dir.clone().normalize();
    const end = origin.clone().add(dn.clone().multiplyScalar(len));

    const curve = new THREE.CatmullRomCurve3([origin, end]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 3, 0.012 * (1 - depth * 0.25), 4, false),
      capillaryMat
    );
    tube.userData.org = 'capilares';
    group.add(tube);

    const branches = 1 + (depth < maxD - 1 ? Math.floor(Math.random() * 2) : 0);
    for (let i = 0; i < branches; i++) {
      const nd = new THREE.Vector3(
        dn.x + (Math.random() - 0.5) * 0.7,
        dn.y + (Math.random() - 0.5) * 0.7,
        dn.z + (Math.random() - 0.5) * 0.7
      ).normalize();
      addBranch(end, nd, depth + 1, maxD);
    }
  }

  const origins = [
    { p: new THREE.Vector3(0.4, 6.0, -0.2), d: new THREE.Vector3(0, 1, 0) },
    { p: new THREE.Vector3(-0.6, 6.0, -0.2), d: new THREE.Vector3(0, 1, 0) },
    { p: new THREE.Vector3(4.8, 3.8, -0.1), d: new THREE.Vector3(1, 0.3, 0) },
    { p: new THREE.Vector3(-4.0, 3.5, 0), d: new THREE.Vector3(-1, 0.2, 0) },
    { p: new THREE.Vector3(0.6, -5.0, 0.3), d: new THREE.Vector3(0, -1, 0) },
    { p: new THREE.Vector3(-0.4, -5.0, 0.2), d: new THREE.Vector3(0, -1, 0) },
    { p: new THREE.Vector3(3.0, -3.5, 0.2), d: new THREE.Vector3(0.5, -0.5, 0) },
    { p: new THREE.Vector3(-2.4, 0.5, 0), d: new THREE.Vector3(-0.3, 0, 0.3) },
    { p: new THREE.Vector3(2.4, 0.5, 0), d: new THREE.Vector3(0.3, 0, 0.3) },
  ];

  for (const o of origins) {
    addBranch(o.p, o.d, 0, 3);
  }

  structures.capilares = group;
  return group;
}

// --- Lungs ---
function createLungs() {
  const group = new THREE.Group();
  group.name = 'Pulmões';

  function makeLobe(sx, sy, sz, ox) {
    const g = new THREE.SphereGeometry(1, 20, 20);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i) * sx, y = p.getY(i) * sy, z = p.getZ(i) * sz;
      if (x > 0.1 * sx) x += 0.1;
      if (x < -0.1 * sx) x -= 0.1;
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, lungMat);
    m.position.x = ox;
    m.userData.org = 'pulmoes';
    return m;
  }

  group.add(makeLobe(0.65, 1.4, 0.5, -2.5));
  group.add(makeLobe(0.65, 1.4, 0.5, 2.5));
  group.add(makeLobe(0.45, 0.8, 0.4, -2.5));
  group.add(makeLobe(0.45, 0.8, 0.4, 2.5));
  group.position.y = 0.2;

  structures.pulmoes = group;
  return group;
}

// ============================================================
// MONTAGEM DA CENA
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const starField = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: '#ffffff', size: 0.025, transparent: true, opacity: 0.35 })
);
const starPos = new Float32Array(2000);
for (let i = 0; i < 2000; i++) starPos[i] = (Math.random() - 0.5) * 150;
starField.geometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(starField);

const groundGlow = new THREE.Mesh(
  new THREE.RingGeometry(5, 10, 48),
  new THREE.MeshBasicMaterial({ color: '#ff4466', transparent: true, opacity: 0.04, side: THREE.DoubleSide })
);
groundGlow.position.y = -4.8;
groundGlow.rotation.x = -Math.PI / 2;
scene.add(groundGlow);

function buildScene() {
  mainGroup.add(createHeart());
  mainGroup.add(createArteries());
  mainGroup.add(createVeins());
  mainGroup.add(createCapillaries());
  mainGroup.add(createLungs());

  const pGroup = new THREE.Group();
  pGroup.name = 'Glóbulos Vermelhos';
  for (const p of bloodParticles) pGroup.add(p);
  structures.globulos = pGroup;
  mainGroup.add(pGroup);

  collectHitTargets(mainGroup);
}

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.org) hitTargets.push(obj);
  if (obj.children) for (const c of obj.children) collectHitTargets(c);
}

buildScene();

// ============================================================
// ANIMAÇÃO
// ============================================================
const clock = new THREE.Clock();
let heartPhase = 0;

function updateAnimations(time, delta) {
  const d = delta * speed;

  heartPhase += d * 1.8;
  const pulse = 1 + 0.05 * Math.sin(heartPhase * 2);
  if (structures.coracao) {
    structures.coracao.scale.set(pulse, pulse * 1.02, pulse);
    if (structures.coracao.userData.glowMesh) {
      structures.coracao.userData.glowMesh.material.opacity = 0.06 + 0.05 * Math.sin(heartPhase * 2);
    }
  }

  for (const vd of vesselData) {
    for (const p of vd.particles) {
      p.t += d * p.speed;
      if (p.t > 1) p.t -= 1;
      if (p.t < 0) p.t += 1;
      const pos = vd.curve.getPoint(p.t);
      p.mesh.position.copy(pos);
      const s = 0.8 + 0.4 * Math.sin(p.t * Math.PI * 4 + heartPhase);
      p.mesh.scale.set(s, s, s);
    }
  }

  if (structures.pulmoes) {
    const br = 1 + 0.015 * Math.sin(time * 0.4);
    structures.pulmoes.scale.set(br, br, br);
  }
}

// ============================================================
// RAYCASTER E SELEÇÃO
// ============================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');
let currentHighlight = null;

function getStructId(hit) {
  let obj = hit.object;
  while (obj) {
    if (obj.userData.org) return obj.userData.org;
    obj = obj.parent;
  }
  return null;
}

function highlightStructure(id) {
  if (currentHighlight) {
    for (const m of currentHighlight.meshes) {
      if (m.material) {
        m.material.emissive = new THREE.Color(m.userData._origC || '#000');
        m.material.emissiveIntensity = m.userData._origE || 0.1;
      }
    }
  }

  if (!id) {
    currentHighlight = null;
    infoPanel.classList.remove('visible');
    return;
  }

  const config = STRUCT_CONFIG.find(c => c.id === id);
  const info = STRUCT_INFO[id];
  if (!config || !info) return;

  const meshes = [];
  const grp = structures[id];
  if (grp) {
    grp.traverse(c => {
      if (c.isMesh && c.material) {
        if (!c.userData._origC) {
          c.userData._origC = c.material.emissive ? c.material.emissive.getHex() : 0;
          c.userData._origE = c.material.emissiveIntensity || 0;
        }
        meshes.push(c);
      }
    });
  }
  for (const vd of vesselData) {
    if (vd.id === id && vd.mesh.material) {
      if (!vd.mesh.userData._origC) {
        vd.mesh.userData._origC = vd.mesh.material.emissive.getHex();
        vd.mesh.userData._origE = vd.mesh.material.emissiveIntensity;
      }
      meshes.push(vd.mesh);
    }
  }

  for (const m of meshes) {
    m.material.emissive = new THREE.Color('#6c5ce7');
    m.material.emissiveIntensity = 0.4;
  }

  currentHighlight = { id, meshes };

  infoName.textContent = config.name;
  infoDesc.textContent = info.description;
  infoFunc.textContent = `Função: ${info.function}`;
  infoPanel.classList.add('visible');
}

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(hitTargets, false);
  if (intersects.length > 0) {
    const id = getStructId(intersects[0]);
    if (id) { highlightStructure(id); return; }
  }
  highlightStructure(null);
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);

// ============================================================
// INTERFACE
// ============================================================
function createUI() {
  const list = document.getElementById('structure-list');
  list.innerHTML = '';

  for (const config of STRUCT_CONFIG) {
    const item = document.createElement('label');
    item.className = 'structure-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = true; cb.dataset.id = config.id;
    const dot = document.createElement('span');
    dot.className = 'color-dot'; dot.style.background = config.color;
    const label = document.createElement('span');
    label.className = 'structure-label'; label.textContent = config.name;

    item.append(cb, dot, label);
    cb.addEventListener('change', () => {
      const g = structures[config.id];
      if (g) g.visible = cb.checked;
      if (config.id === 'arterias' || config.id === 'veias') {
        for (const vd of vesselData) if (vd.id === config.id) vd.mesh.visible = cb.checked;
      }
      if (config.id === 'globulos') {
        for (const p of bloodParticles) p.visible = cb.checked;
      }
    });
    list.appendChild(item);
  }

  const bg = document.getElementById('btn-group');
  const sa = document.createElement('button');
  sa.className = 'btn btn-primary'; sa.textContent = 'Mostrar Tudo';
  sa.addEventListener('click', () => {
    for (const [, g] of Object.entries(structures)) g.visible = true;
    for (const vd of vesselData) vd.mesh.visible = true;
    for (const p of bloodParticles) p.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = true);
  });
  const ha = document.createElement('button');
  ha.className = 'btn btn-danger'; ha.textContent = 'Ocultar Tudo';
  ha.addEventListener('click', () => {
    for (const [, g] of Object.entries(structures)) g.visible = false;
    for (const vd of vesselData) vd.mesh.visible = false;
    for (const p of bloodParticles) p.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = false);
  });
  const rc = document.createElement('button');
  rc.className = 'btn'; rc.textContent = 'Resetar Câmera';
  rc.addEventListener('click', resetCamera);
  bg.append(sa, ha, rc);

  document.querySelectorAll('#speed-controls button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#speed-controls button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      speed = parseFloat(b.dataset.speed);
    });
  });
}

createUI();

// ============================================================
// REDIMENSIONAMENTO
// ============================================================
function onResize() {
  const w = container.clientWidth, h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// ============================================================
// RENDERIZAÇÃO
// ============================================================
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  controls.update();
  updateAnimations(elapsed, delta);
  renderer.render(scene, camera);
}
animate();

console.log('Sistema Circulatório Humano carregado!');
