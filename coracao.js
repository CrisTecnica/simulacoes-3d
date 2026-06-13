// ============================================================
// CONFIGURAÇÃO
// ============================================================
const STRUCT_CONFIG = [
  { id: 'atrioDireito',     name: 'Átrio Direito',       color: '#ff4466', cat: 'Câmaras' },
  { id: 'atrioEsquerdo',    name: 'Átrio Esquerdo',      color: '#ff6688', cat: 'Câmaras' },
  { id: 'ventriculoDireito',name: 'Ventrículo Direito',  color: '#cc2255', cat: 'Câmaras' },
  { id: 'ventriculoEsquerdo',name: 'Ventrículo Esquerdo',color: '#ff2244', cat: 'Câmaras' },
  { id: 'valvulas',         name: 'Válvulas Cardíacas',  color: '#ffaa44', cat: 'Estruturas' },
  { id: 'sistemaEletrico',  name: 'Sistema Elétrico',    color: '#44ff88', cat: 'Estruturas' },
  { id: 'miocardio',        name: 'Miocárdio',           color: '#882244', cat: 'Tecido' },
];

const STRUCT_INFO = {
  atrioDireito: {
    description: 'Câmara superior direita que recebe sangue venoso (pobre em O₂) da veia cava superior, veia cava inferior e seio coronário.',
    function: 'Receber sangue desoxigenado da circulação sistêmica e bombeá-lo para o ventrículo direito através da válvula tricúspide.',
  },
  atrioEsquerdo: {
    description: 'Câmara superior esquerda que recebe sangue oxigenado dos pulmões através das quatro veias pulmonares.',
    function: 'Receber sangue oxigenado da circulação pulmonar e bombeá-lo para o ventrículo esquerdo através da válvula mitral.',
  },
  ventriculoDireito: {
    description: 'Câmara inferior direita que bombeia sangue para os pulmões. Tem paredes mais finas que o VE (menor resistência).',
    function: 'Bombear sangue desoxigenado para os pulmões através da artéria pulmonar (válvula pulmonar).',
  },
  ventriculoEsquerdo: {
    description: 'Câmara inferior esquerda com paredes musculares espessas (~12 mm). Gera pressão de ~120 mmHg na sístole.',
    function: 'Bombear sangue oxigenado para a aorta e todo o corpo (circulação sistêmica) através da válvula aórtica.',
  },
  valvulas: {
    description: 'Quatro válvulas que garantem fluxo unidirecional: tricúspide (AD→VD), mitral (AE→VE), pulmonar (VD→artéria), aórtica (VE→aorta).',
    function: 'Impedir refluxo sanguíneo durante as fases de contração e relaxamento cardíacos (sístole e diástole).',
  },
  sistemaEletrico: {
    description: 'Nó SA (marca-passo), Nó AV, Feixe de His, ramos e Fibras de Purkinje. Gera e conduz impulsos elétricos.',
    function: 'Iniciar e propagar o potencial de ação cardíaco, coordenando a contração rítmica das câmaras (60-100 bpm em repouso).',
  },
  miocardio: {
    description: 'Músculo cardíaco (miocárdio) - tecido muscular estriado involuntário com células ramificadas interconectadas por discos intercalares.',
    function: 'Gerar força de contração para bombear sangue. Tem alta densidade mitocondrial e contrai automaticamente (automaticidade).',
  },
};

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 60);
camera.position.set(5, 2.5, 6);

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
controls.minDistance = 2;
controls.maxDistance = 20;
controls.target.set(0, 0.2, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(5, 2.5, 6);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.2, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// ILUMINAÇÃO
// ============================================================
scene.add(new THREE.AmbientLight(0x404060, 0.5));
scene.add(new THREE.HemisphereLight(0x6060ff, 0x404040, 0.6));

const mainLight = new THREE.DirectionalLight(0xffeedd, 2.0);
mainLight.position.set(6, 10, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.6);
fillLight.position.set(-4, 2, -6);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff2244, 0.3);
rimLight.position.set(-3, -5, -4);
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
    emissiveIntensity: opts.emissiveIntensity ?? 0.2,
    side: opts.side ?? THREE.FrontSide,
  });
}

const raMat = makeMat('#ff4466', { roughness: 0.35, emissiveIntensity: 0.25 });
const laMat = makeMat('#ff6688', { roughness: 0.35, emissiveIntensity: 0.2 });
const rvMat = makeMat('#cc2255', { roughness: 0.3, emissiveIntensity: 0.3 });
const lvMat = makeMat('#ff2244', { roughness: 0.25, emissiveIntensity: 0.35 });
const valveMat = makeMat('#ffaa44', { roughness: 0.3, metalness: 0.2, emissiveIntensity: 0.3 });
const valveClosedMat = makeMat('#ff6600', { roughness: 0.2, emissiveIntensity: 0.5 });
const elecMat = new THREE.MeshBasicMaterial({ color: '#44ff88' });
const elecMatBright = new THREE.MeshBasicMaterial({ color: '#88ffbb' });
const myoMat = makeMat('#882244', { transparent: true, opacity: 0.18, roughness: 0.6, side: THREE.DoubleSide, emissiveIntensity: 0.05 });

// ============================================================
// CRIAÇÃO DAS ESTRUTURAS
// ============================================================
const structures = {};
const hitTargets = [];
const chamberMeshes = [];
let speed = 1, bpm = 72;

// Chamber geometries
function makeChamber(sx, sy, sz, colorMat, orgId, deform) {
  const geo = new THREE.SphereGeometry(1, 28, 28);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * sx, y = pos.getY(i) * sy, z = pos.getZ(i) * sz;
    if (deform) deform(x, y, z, pos, i);
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, colorMat);
  mesh.userData.org = orgId;
  mesh.castShadow = true;
  chamberMeshes.push(mesh);
  return mesh;
}

function createAtrioDireito() {
  const g = new THREE.Group();
  g.name = 'Átrio Direito';
  const m = makeChamber(0.7, 0.55, 0.5, raMat, 'atrioDireito', (x, y, z, pos, i) => {
    if (x < -0.2) { const t = (-x - 0.2) / 0.5; pos.setX(i, x + 0.08 * Math.min(1, t)); }
    if (y < -0.3) { const t = (-y - 0.3) / 0.25; pos.setY(i, y - 0.1 * Math.min(1, t)); }
  });
  m.position.set(0.55, 1.0, 0);
  g.add(m);
  structures.atrioDireito = g;
  return g;
}

function createAtrioEsquerdo() {
  const g = new THREE.Group();
  g.name = 'Átrio Esquerdo';
  const m = makeChamber(0.6, 0.55, 0.55, laMat, 'atrioEsquerdo', (x, y, z, pos, i) => {
    if (x > 0.2) { const t = (x - 0.2) / 0.4; pos.setX(i, x + 0.1 * Math.min(1, t)); }
  });
  m.position.set(-0.55, 1.0, 0);
  g.add(m);
  structures.atrioEsquerdo = g;
  return g;
}

function createVentriculoDireito() {
  const g = new THREE.Group();
  g.name = 'Ventrículo Direito';
  const m = makeChamber(0.75, 0.8, 0.55, rvMat, 'ventriculoDireito', (x, y, z, pos, i) => {
    if (x < -0.2) { const t = (-x - 0.2) / 0.55; pos.setX(i, x + 0.12 * Math.min(1, t)); }
    if (y < -0.4) { const t = (-y - 0.4) / 0.4; const p = 0.15 * Math.min(1, t); pos.setX(i, pos.getX(i) - p * 0.3); pos.setZ(i, pos.getZ(i) - p * 0.2); }
  });
  m.position.set(0.55, -0.4, 0);
  g.add(m);
  structures.ventriculoDireito = g;
  return g;
}

function createVentriculoEsquerdo() {
  const g = new THREE.Group();
  g.name = 'Ventrículo Esquerdo';
  const m = makeChamber(0.85, 0.9, 0.6, lvMat, 'ventriculoEsquerdo', (x, y, z, pos, i) => {
    if (x > 0.2) { const t = (x - 0.2) / 0.65; pos.setX(i, x + 0.15 * Math.min(1, t)); }
    if (y < -0.4) { const t = (-y - 0.4) / 0.5; const p = 0.2 * Math.min(1, t); pos.setX(i, pos.getX(i) + p * 0.25); pos.setZ(i, pos.getZ(i) - p * 0.15); }
  });
  m.position.set(-0.6, -0.4, 0);
  g.add(m);
  structures.ventriculoEsquerdo = g;
  return g;
}

// --- Valves ---
function createValves() {
  const g = new THREE.Group();
  g.name = 'Válvulas';

  function makeValve(px, py, pz, rInner, rOuter, label) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry((rInner + rOuter) / 2, (rOuter - rInner) / 2, 8, 20),
      valveMat
    );
    ring.position.set(px, py, pz);
    ring.rotation.x = Math.PI / 2;
    ring.userData.org = 'valvulas';
    ring.userData.valveLabel = label;
    g.add(ring);

    // Small leaflets
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const leaf = new THREE.Mesh(
        new THREE.PlaneGeometry((rOuter - rInner) * 0.6, (rOuter - rInner) * 0.6),
        new THREE.MeshBasicMaterial({ color: '#ffaa44', transparent: true, opacity: 0.4, side: THREE.DoubleSide })
      );
      leaf.position.set(
        px + Math.cos(angle) * (rInner + rOuter) / 2 * 0.5,
        py,
        pz + Math.sin(angle) * (rInner + rOuter) / 2 * 0.5
      );
      leaf.lookAt(px, py, pz);
      leaf.userData.org = 'valvulas';
      g.add(leaf);
    }

    return ring;
  }

  makeValve(0.4, 0.2, 0, 0.15, 0.28, 'Tricúspide');   // RA→RV
  makeValve(-0.5, 0.2, 0, 0.14, 0.26, 'Mitral');       // LA→LV
  makeValve(0.3, -0.15, 0.4, 0.1, 0.2, 'Pulmonar');    // RV→artéria
  makeValve(-0.35, -0.15, 0.4, 0.1, 0.22, 'Aórtica');   // LV→aorta

  structures.valvulas = g;
  return g;
}

// --- Electrical System ---
function createSistemaEletrico() {
  const g = new THREE.Group();
  g.name = 'Sistema Elétrico';

  // SA Node
  const saNode = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), elecMat.clone());
  saNode.position.set(0.55, 1.25, 0.2);
  saNode.userData.org = 'sistemaEletrico';
  saNode.userData.elecType = 'sanode';
  g.add(saNode);

  // AV Node
  const avNode = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), elecMat.clone());
  avNode.position.set(0.3, 0.35, 0.15);
  avNode.userData.org = 'sistemaEletrico';
  avNode.userData.elecType = 'avnode';
  g.add(avNode);

  // Internodal pathway (SA→AV)
  const intPath = createElecPath([
    new THREE.Vector3(0.55, 1.25, 0.2),
    new THREE.Vector3(0.45, 0.9, 0.18),
    new THREE.Vector3(0.35, 0.6, 0.16),
    new THREE.Vector3(0.3, 0.35, 0.15),
  ], 0.025);
  intPath.userData.org = 'sistemaEletrico';
  g.add(intPath);

  // Bundle of His (AV → bifurcation)
  const hisBundle = createElecPath([
    new THREE.Vector3(0.3, 0.35, 0.15),
    new THREE.Vector3(0.2, 0.2, 0.1),
    new THREE.Vector3(0.1, 0.05, 0.05),
    new THREE.Vector3(0, -0.1, 0),
  ], 0.03);
  hisBundle.userData.org = 'sistemaEletrico';
  g.add(hisBundle);

  // Right bundle branch
  const rBundle = createElecPath([
    new THREE.Vector3(0, -0.1, 0),
    new THREE.Vector3(0.15, -0.2, 0.02),
    new THREE.Vector3(0.35, -0.3, 0.03),
    new THREE.Vector3(0.5, -0.45, 0.02),
  ], 0.02);
  rBundle.userData.org = 'sistemaEletrico';
  g.add(rBundle);

  // Left bundle branch
  const lBundle = createElecPath([
    new THREE.Vector3(0, -0.1, 0),
    new THREE.Vector3(-0.15, -0.2, -0.02),
    new THREE.Vector3(-0.35, -0.3, -0.03),
    new THREE.Vector3(-0.55, -0.45, -0.02),
  ], 0.02);
  lBundle.userData.org = 'sistemaEletrico';
  g.add(lBundle);

  // Purkinje fibers on RV
  const purkinjeRV = createPurkinjeNetwork(
    new THREE.Vector3(0.5, -0.45, 0.02),
    new THREE.Vector3(0.55, -0.4, 0), new THREE.Vector3(0.55, -0.5, 0),
    3, 0.015
  );
  purkinjeRV.userData.org = 'sistemaEletrico';
  g.add(purkinjeRV);

  // Purkinje fibers on LV
  const purkinjeLV = createPurkinjeNetwork(
    new THREE.Vector3(-0.55, -0.45, -0.02),
    new THREE.Vector3(-0.6, -0.4, 0), new THREE.Vector3(-0.6, -0.55, 0),
    3, 0.015
  );
  purkinjeLV.userData.org = 'sistemaEletrico';
  g.add(purkinjeLV);

  // Spark (traveling electrical impulse)
  const sparkMat = new THREE.MeshBasicMaterial({ color: '#aaffdd' });
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), sparkMat);
  spark.userData.org = 'sistemaEletrico';
  spark.userData.isSpark = true;
  g.userData.spark = spark;
  g.add(spark);

  // Combined electrical path for spark animation
  const sparkPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.55, 1.25, 0.2),
    new THREE.Vector3(0.45, 0.9, 0.18),
    new THREE.Vector3(0.35, 0.6, 0.16),
    new THREE.Vector3(0.3, 0.35, 0.15),
    new THREE.Vector3(0.2, 0.2, 0.1),
    new THREE.Vector3(0.1, 0.05, 0.05),
    new THREE.Vector3(0, -0.1, 0),
    new THREE.Vector3(-0.35, -0.3, -0.03),
  ]);
  g.userData.sparkPath = sparkPath;
  g.userData.elecNodes = [saNode, avNode];
  g.userData.bundles = [hisBundle, rBundle, lBundle];
  g.userData.purkinje = [purkinjeRV, purkinjeLV];

  structures.sistemaEletrico = g;
  return g;
}

function createElecPath(points, radius) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 24, radius, 6, false);
  const mesh = new THREE.Mesh(geo, elecMat.clone());
  return mesh;
}

function createPurkinjeNetwork(origin, dir1, dir2, depth, radius) {
  const g = new THREE.Group();
  function branch(pos, dir, d) {
    if (d <= 0) return;
    const len = 0.15 + Math.random() * 0.1;
    const end = pos.clone().add(dir.clone().normalize().multiplyScalar(len));
    const curve = new THREE.CatmullRomCurve3([pos, end]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 4, radius * (1 - d * 0.2), 4, false), elecMat.clone());
    tube.userData.org = 'sistemaEletrico';
    g.add(tube);
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const nd = new THREE.Vector3(
        dir.x + (Math.random() - 0.5) * 0.5,
        dir.y + (Math.random() - 0.5) * 0.5,
        dir.z + (Math.random() - 0.5) * 0.3
      ).normalize();
      branch(end, nd, d - 1);
    }
  }
  branch(origin, dir1, depth);
  branch(origin.clone().add(new THREE.Vector3(0, -0.05, 0.03)), dir2, depth);
  return g;
}

// --- Myocardium ---
function createMiocardio() {
  const g = new THREE.Group();
  g.name = 'Miocárdio';

  const shellGeo = new THREE.SphereGeometry(1, 32, 32);
  const pos = shellGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    y *= 1.2;
    if (y < -0.2) { const t = Math.min(1, (-y - 0.2) / 1.0); const tp = 1 - 0.35 * t; x *= tp; z *= tp; }
    if (y > 0.3) { const cf = Math.min(1, (y - 0.3) / 0.5); x += Math.sign(x) * 0.15 * cf * Math.exp(-x*x*3); }
    z *= 0.75;
    pos.setXYZ(i, x * 1.15, y * 1.1, z * 1.15);
  }
  shellGeo.computeVertexNormals();

  const shell = new THREE.Mesh(shellGeo, myoMat);
  shell.userData.org = 'miocardio';
  g.add(shell);

  // Wireframe overlay for muscle fibers
  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.1, 16, 12)),
    new THREE.LineBasicMaterial({ color: '#ff4466', transparent: true, opacity: 0.06 })
  );
  const wPos = wireframe.geometry.attributes.position;
  if (wPos) {
    for (let i = 0; i < wPos.count; i++) {
      let x = wPos.getX(i), y = wPos.getY(i), z = wPos.getZ(i);
      y *= 1.2;
      if (y < -0.2) { const t = Math.min(1, (-y - 0.2) / 1.0); x *= (1 - 0.35 * t); z *= (1 - 0.35 * t); }
      z *= 0.75;
      wPos.setXYZ(i, x * 1.15, y * 1.1, z * 1.15);
    }
    wPos.needsUpdate = true;
  }
  g.add(wireframe);

  structures.miocardio = g;
  return g;
}

// ============================================================
// MONTAGEM DA CENA
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const starField = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: '#ffffff', size: 0.02, transparent: true, opacity: 0.3 })
);
const starPos = new Float32Array(1500);
for (let i = 0; i < 1500; i++) starPos[i] = (Math.random() - 0.5) * 100;
starField.geometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(starField);

const ringGlow = new THREE.Mesh(
  new THREE.RingGeometry(2, 4, 48),
  new THREE.MeshBasicMaterial({ color: '#ff2244', transparent: true, opacity: 0.04, side: THREE.DoubleSide })
);
ringGlow.position.y = -1.8;
ringGlow.rotation.x = -Math.PI / 2;
scene.add(ringGlow);

function buildScene() {
  mainGroup.add(createAtrioDireito());
  mainGroup.add(createAtrioEsquerdo());
  mainGroup.add(createVentriculoDireito());
  mainGroup.add(createVentriculoEsquerdo());
  mainGroup.add(createValves());
  mainGroup.add(createSistemaEletrico());
  mainGroup.add(createMiocardio());
  collectHitTargets(mainGroup);
}

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.org) hitTargets.push(obj);
  if (obj.children) for (const c of obj.children) collectHitTargets(c);
}

buildScene();

// ============================================================
// ECG
// ============================================================
const ECG_SIZE = 400;
const ecgBuffer = new Float32Array(ECG_SIZE);
let ecgIdx = 0;
const ecgCanvas = document.getElementById('ecg-canvas');

function gauss(x, mu, s) { return Math.exp(-((x - mu) ** 2) / (2 * s * s)); }

function getEcgValue(phase) {
  const t = phase;
  let v = 0;
  v += 0.12 * gauss(t, 0.05, 0.025);
  v -= 0.08 * gauss(t, 0.18, 0.012);
  v += 0.65 * gauss(t, 0.20, 0.015);
  v -= 0.12 * gauss(t, 0.23, 0.016);
  v += 0.18 * gauss(t, 0.40, 0.035);
  v += 0.04 * gauss(t, 0.53, 0.03);
  return v;
}

function drawECG(phase) {
  const canvas = ecgCanvas;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(0,255,0,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w / 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += h / 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Baseline
  ctx.strokeStyle = 'rgba(0,255,0,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  // Waveform - scrolling from right to left
  const step = w / ECG_SIZE;
  ctx.strokeStyle = '#44ff88';
  ctx.lineWidth = 1.5 * dpr;
  ctx.shadowColor = '#44ff88';
  ctx.shadowBlur = 4 * dpr;
  ctx.beginPath();
  for (let i = 0; i < ECG_SIZE; i++) {
    const idx = (ecgIdx + i) % ECG_SIZE;
    const x = (i / ECG_SIZE) * w;
    const y = cy - ecgBuffer[idx] * h * 0.38;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Phase marker
  const markerX = ((1 - phase) * (ECG_SIZE - 1) / ECG_SIZE) * w;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(markerX, 0);
  ctx.lineTo(markerX, h);
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'rgba(0,255,0,0.3)';
  ctx.font = `${9 * dpr}px monospace`;
  ctx.fillText('P', w * 0.06 + 4, cy - h * 0.35);
  ctx.fillText('QRS', w * 0.20 - 4, cy - h * 0.38);
  ctx.fillText('T', w * 0.40 + 4, cy - h * 0.32);
}

// ============================================================
// ANIMAÇÃO
// ============================================================
const clock = new THREE.Clock();

function getCyclePhase(time) {
  const cycleDuration = 60 / bpm;
  return ((time % cycleDuration) / cycleDuration);
}

function getAtrialScale(phase) {
  if (phase < 0.12) return 1 - 0.13 * Math.sin(phase / 0.12 * Math.PI);
  return 0.87 + 0.13 * Math.min(1, (phase - 0.12) / 0.1);
}

function getVentricularScale(phase) {
  if (phase >= 0.15 && phase < 0.38) {
    const t = (phase - 0.15) / 0.23;
    return 1 - 0.18 * Math.sin(t * Math.PI);
  }
  const relax = phase < 0.15 ? phase + 0.85 : (phase - 0.38) / 0.62;
  return 0.82 + 0.18 * Math.min(1, relax / 0.08);
}

function updateAnimations(time, delta) {
  const d = delta * speed;
  const phase = getCyclePhase(time);

  // Chamber pulsing
  const aScale = getAtrialScale(phase);
  const vScale = getVentricularScale(phase);

  const chamberScales = {
    atrioDireito: aScale,
    atrioEsquerdo: aScale,
    ventriculoDireito: vScale,
    ventriculoEsquerdo: vScale,
  };

  for (const [id, s] of Object.entries(chamberScales)) {
    const g = structures[id];
    if (g) {
      const base = id.includes('ventriculo') ? 1 : 1;
      g.scale.set(s * base, s * base, s * base);
    }
  }

  // Slight rotation of whole heart during contraction
  const twist = 0.015 * Math.sin(phase * Math.PI * 2);
  mainGroup.rotation.z = twist;

  // Valve animation
  const valveSys = (phase >= 0.15 && phase < 0.38);
  if (structures.valvulas) {
    structures.valvulas.children.forEach(c => {
      if (c.isMesh && c.material) {
        const isAvValve = c.userData.valveLabel === 'Tricúspide' || c.userData.valveLabel === 'Mitral';
        const closed = valveSys ? isAvValve : !isAvValve;
        c.material.color.setHex(closed ? 0xff6600 : 0xffaa44);
        c.material.emissiveIntensity = closed ? 0.5 : 0.2;
        if (c.geometry.type === 'TorusGeometry') {
          const scale = closed ? 0.85 : 1;
          c.scale.set(scale, scale, scale);
        }
      }
    });
  }

  // Electrical system: glow based on phase
  const elecGroup = structures.sistemaEletrico;
  if (elecGroup) {
    const saPhase = Math.min(1, phase / 0.12);
    const avPhase = Math.min(1, Math.max(0, (phase - 0.08) / 0.1));
    const bundlePhase = Math.min(1, Math.max(0, (phase - 0.15) / 0.08));
    const purkPhase = Math.min(1, Math.max(0, (phase - 0.18) / 0.15));

    elecGroup.traverse(c => {
      if (c.isMesh && c.material && c.userData.org === 'sistemaEletrico' && !c.userData.isSpark) {
        let intensity = 0.2;
        if (c.userData.elecType === 'sanode') intensity = 0.3 + 0.7 * saPhase;
        else if (c.userData.elecType === 'avnode') intensity = 0.3 + 0.7 * avPhase;
        else intensity = 0.1 + 0.9 * Math.max(bundlePhase, purkPhase);
        if (c.material.color) {
          c.material.color.setHSL(0.35, 1, 0.4 + 0.4 * Math.min(1, intensity));
        }
        c.material.transparent = true;
        c.material.opacity = 0.4 + 0.6 * Math.min(1, intensity);
      }
    });

    // Spark animation
    if (elecGroup.userData.spark && elecGroup.userData.sparkPath) {
      const spark = elecGroup.userData.spark;
      const path = elecGroup.userData.sparkPath;
      let sparkT = 0;
      if (phase < 0.12) sparkT = phase / 0.12 * 0.3;
      else if (phase < 0.15) sparkT = 0.3 + (phase - 0.12) / 0.03 * 0.2;
      else if (phase < 0.22) sparkT = 0.5 + (phase - 0.15) / 0.07 * 0.4;
      else if (phase < 0.35) sparkT = 0.9 + (phase - 0.22) / 0.13 * 0.1;
      else sparkT = 1;

      if (sparkT <= 1) {
        const p = path.getPoint(sparkT);
        spark.position.copy(p);
        spark.visible = true;
        const s = 1 + 0.5 * Math.sin(time * 20);
        spark.scale.set(s, s, s);
      } else {
        spark.visible = false;
      }
    }
  }

  // Myocardium subtle pulse
  if (structures.miocardio) {
    const pulse = 1 + 0.01 * Math.sin(phase * Math.PI * 2);
    structures.miocardio.scale.set(pulse, pulse, pulse);
  }

  // ECG
  const ecgVal = getEcgValue(phase);
  ecgBuffer[ecgIdx] = ecgVal;
  ecgIdx = (ecgIdx + 1) % ECG_SIZE;
  drawECG(phase);
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
        m.material.emissive = new THREE.Color(m.userData._oc || '#000');
        m.material.emissiveIntensity = m.userData._oe || 0.2;
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
      if (c.isMesh && c.material && !c.userData.isSpark) {
        if (!c.userData._oc) {
          c.userData._oc = c.material.emissive ? c.material.emissive.getHex() : 0;
          c.userData._oe = c.material.emissiveIntensity || 0;
        }
        meshes.push(c);
      }
    });
  }

  // Also include children of mainGroup that match
  if (id === 'valvulas' || id === 'sistemaEletrico' || id === 'miocardio') {
    // already handled by structures
  }

  for (const m of meshes) {
    if (m.material) {
      m.material.emissive = new THREE.Color('#6c5ce7');
      m.material.emissiveIntensity = 0.4;
    }
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
    });
    list.appendChild(item);
  }

  const bg = document.getElementById('btn-group');
  const sa = document.createElement('button');
  sa.className = 'btn btn-primary'; sa.textContent = 'Mostrar Tudo';
  sa.addEventListener('click', () => {
    for (const [, g] of Object.entries(structures)) g.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = true);
  });
  const ha = document.createElement('button');
  ha.className = 'btn btn-danger'; ha.textContent = 'Ocultar Tudo';
  ha.addEventListener('click', () => {
    for (const [, g] of Object.entries(structures)) g.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = false);
  });
  const rc = document.createElement('button');
  rc.className = 'btn'; rc.textContent = 'Resetar Câmera';
  rc.addEventListener('click', resetCamera);
  bg.append(sa, ha, rc);

  // Speed controls
  document.querySelectorAll('#speed-controls button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#speed-controls button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      speed = parseFloat(b.dataset.speed);
    });
  });

  // BPM slider
  const bpmSlider = document.getElementById('bpm-slider');
  const bpmDisplay = document.getElementById('bpm-value');
  if (bpmSlider) {
    bpmSlider.addEventListener('input', () => {
      bpm = parseInt(bpmSlider.value);
      bpmDisplay.textContent = bpm;
    });
  }
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
  drawECG(0);
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

console.log('Funcionamento do Coração em Tempo Real carregado!');
