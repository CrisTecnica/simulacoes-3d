// ============================================================
// CONFIGURAÇÃO
// ============================================================
const STRUCTURE_CONFIG = [
  { id: 'soma',      name: 'Corpo Celular',          color: '#ffaa44' },
  { id: 'dendrites', name: 'Dendritos',               color: '#ffcc66' },
  { id: 'axon',      name: 'Axônio',                  color: '#ff8833' },
  { id: 'synapses',  name: 'Sinapses',                color: '#ff5555' },
  { id: 'terminals', name: 'Terminais Sinápticos',    color: '#ffaa88' },
];

const STRUCTURE_INFO = {
  soma: {
    description: 'Corpo celular do neurônio, contendo o núcleo e a maioria das organelas. Centro metabólico e integrador do neurônio.',
    function: 'Integração de sinais recebidos; manutenção da célula; síntese de proteínas e metabolismo neuronal.',
  },
  dendrites: {
    description: 'Prolongamentos ramificados que recebem sinais de outros neurônios. Quanto mais ramificações, maior a capacidade de recepção.',
    function: 'Recepção de impulsos nervosos de outros neurônios e condução centrípeta (em direção ao corpo celular).',
  },
  axon: {
    description: 'Prolongamento único e longo que conduz o impulso nervoso do corpo celular para outros neurônios ou efetuadores.',
    function: 'Condução do potencial de ação (impulso nervoso) do corpo celular às terminações sinápticas.',
  },
  synapses: {
    description: 'Regiões especializadas de contato entre neurônios, onde ocorre a transmissão do impulso via neurotransmissores.',
    function: 'Transmissão do impulso nervoso de um neurônio para outro através de mediadores químicos (neurotransmissores).',
  },
  terminals: {
    description: 'Extremidades do axônio que liberam neurotransmissores na fenda sináptica para comunicar-se com outros neurônios.',
    function: 'Liberação de neurotransmissores na fenda sináptica para propagação do sinal ao neurônio pós-sináptico.',
  },
};

let speedMultiplier = 1;
const SOMA_RADIUS = 0.9;
const DENDRITE_SEGMENTS = 5;
const NEURON_POSITIONS = [
  new THREE.Vector3(-9, 2.5, 0),
  new THREE.Vector3(-3.5, 5.5, 4),
  new THREE.Vector3(3, 5, -3.5),
  new THREE.Vector3(9, 1.5, 0),
  new THREE.Vector3(5, -3.5, 4.5),
  new THREE.Vector3(-4, -4, -4),
  new THREE.Vector3(0.5, -5.5, 0.5),
];

const CONNECTIONS = [
  [0, 1], [0, 5],
  [1, 2], [1, 4],
  [2, 3], [2, 4],
  [3, 6],
  [4, 6],
  [5, 4], [5, 6],
];

const DENDRITE_COUNTS = [5, 4, 5, 4, 5, 4, 5];
const DENDRITE_LEN = [2.2, 1.8, 2.4, 2.0, 2.2, 1.9, 2.3];

// ============================================================
// SEÇÃO 1: CENA, CÂMERA E RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(22, 16, 22);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ============================================================
// SEÇÃO 2: CONTROLES
// ============================================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 5;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(22, 16, 22);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// SEÇÃO 3: ILUMINAÇÃO
// ============================================================
const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xff8844, 0x222244, 0.6);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xffaa66, 2.0);
mainLight.position.set(15, 25, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4444ff, 0.4);
fillLight.position.set(-10, 5, -15);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff8844, 0.3);
rimLight.position.set(-5, -15, -10);
scene.add(rimLight);

// ============================================================
// SEÇÃO 4: MATERIAIS
// ============================================================
function makeMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.4,
    metalness: opts.metalness ?? 0.0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    clearcoat: opts.clearcoat ?? 0.0,
    clearcoatRoughness: opts.clearcoatRoughness ?? 0.4,
    emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color('#000000'),
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    side: opts.side ?? THREE.FrontSide,
  });
}

const matSoma      = makeMat('#ffaa44', { roughness: 0.3, clearcoat: 0.3, emissive: '#ff8800', emissiveIntensity: 0.08 });
const matDendrite  = makeMat('#ffcc66', { roughness: 0.5 });
const matAxon      = makeMat('#ff8833', { roughness: 0.4, clearcoat: 0.1 });
const matSynapse   = makeMat('#ff5555', { transparent: true, opacity: 0.8, emissive: '#ff3333', emissiveIntensity: 0.3 });
const matTerminal  = makeMat('#ffaa88', { roughness: 0.3, clearcoat: 0.2, emissive: '#ff6644', emissiveIntensity: 0.1 });
const matSignal    = makeMat('#ffffff', { emissive: '#ffdd44', emissiveIntensity: 2.0, roughness: 0.0 });
const matNucleus   = makeMat('#cc8844', { roughness: 0.3 });
const matGlow      = makeMat('#ffaa44', { transparent: true, opacity: 0.15, emissive: '#ffaa44', emissiveIntensity: 0.3, roughness: 0.0, side: THREE.DoubleSide });

// ============================================================
// SEÇÃO 5: CRIAÇÃO DA REDE
// ============================================================
const organelles = {};
const hitTargets = [];
const signals = [];

function createSoma(pos, idx) {
  const group = new THREE.Group();
  group.name = 'Corpo Celular';
  group.position.copy(pos);

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(SOMA_RADIUS, 32, 32), matSoma);
  mesh.name = 'soma';
  mesh.userData.org = 'soma';
  mesh.castShadow = true;
  group.add(mesh);

  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(SOMA_RADIUS * 0.4, 20, 20), matNucleus);
  nucleus.position.set(0.1, 0.15, -0.1);
  nucleus.name = 'soma';
  nucleus.userData.org = 'soma';
  group.add(nucleus);

  const glow = new THREE.Mesh(new THREE.SphereGeometry(SOMA_RADIUS * 1.8, 24, 24), matGlow);
  glow.name = 'soma';
  glow.userData.org = 'soma';
  group.add(glow);

  group.userData.org = 'soma';
  return group;
}

function createDendrites(pos, idx) {
  const group = new THREE.Group();
  group.name = 'Dendritos';
  group.position.copy(pos);

  const count = DENDRITE_COUNTS[idx];
  const maxLen = DENDRITE_LEN[idx];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const len = 1.0 + Math.random() * maxLen;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    const points = [new THREE.Vector3(0, 0, 0)];
    let current = new THREE.Vector3(0, 0, 0);
    const segments = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < segments; j++) {
      const t = (j + 1) / segments;
      const p = dir.clone().multiplyScalar(len * t);
      p.x += (Math.random() - 0.5) * 0.3;
      p.y += (Math.random() - 0.5) * 0.3;
      p.z += (Math.random() - 0.5) * 0.3;
      points.push(p);
      if (j === 0) {
        const branchDir = dir.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        )).normalize();
        const bLen = len * 0.6;
        const bp = branchDir.clone().multiplyScalar(bLen);
        const branchPoints = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            p.x * 0.5 + bp.x * 0.5,
            p.y * 0.5 + bp.y * 0.5,
            p.z * 0.5 + bp.z * 0.5
          ),
          bp,
        ];
        const branchCurve = new THREE.CatmullRomCurve3(branchPoints);
        const branchGeo = new THREE.TubeGeometry(branchCurve, 6, 0.04, 6, false);
        const branchMesh = new THREE.Mesh(branchGeo, matDendrite);
        branchMesh.name = 'dendrites';
        branchMesh.userData.org = 'dendrites';
        group.add(branchMesh);
      }
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.05, 6, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, matDendrite);
    tubeMesh.name = 'dendrites';
    tubeMesh.userData.org = 'dendrites';
    group.add(tubeMesh);
  }

  group.userData.org = 'dendrites';
  return group;
}

function getAxonDirection(fromIdx, toIdx) {
  const from = NEURON_POSITIONS[fromIdx];
  const to = NEURON_POSITIONS[toIdx];
  const dir = new THREE.Vector3().subVectors(to, from);
  const dist = dir.length();
  dir.normalize();
  const end = from.clone().add(dir.clone().multiplyScalar(dist * 0.85));
  return { dir, end, dist };
}

function createAxons() {
  const group = new THREE.Group();
  group.name = 'Axônio';

  for (const conn of CONNECTIONS) {
    const fromPos = NEURON_POSITIONS[conn[0]];
    const toPos = NEURON_POSITIONS[conn[1]];
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    const dist = dir.length();
    dir.normalize();

    const startDir = new THREE.Vector3(
      fromPos.x + dir.x * (SOMA_RADIUS + 0.1),
      fromPos.y + dir.y * (SOMA_RADIUS + 0.1),
      fromPos.z + dir.z * (SOMA_RADIUS + 0.1)
    );

    const mid1 = startDir.clone().add(dir.clone().multiplyScalar(dist * 0.3));
    mid1.x += (Math.random() - 0.5) * 0.3;
    mid1.y += (Math.random() - 0.5) * 0.3;
    mid1.z += (Math.random() - 0.5) * 0.3;

    const endPos = fromPos.clone().add(dir.clone().multiplyScalar(dist * 0.8));
    const mid2 = endPos.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    ));

    const points = [startDir, mid1, mid2, endPos];
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.09, 8, false);
    const tube = new THREE.Mesh(tubeGeo, matAxon);
    tube.name = 'axon';
    tube.userData.org = 'axon';
    tube.userData.connection = conn;
    group.add(tube);

    const signalPath = { points: [fromPos, ...points, toPos], connection: conn, fromIdx: conn[0], toIdx: conn[1] };
    signals.push(signalPath);
  }

  group.userData.org = 'axon';
  return group;
}

function createSynapses() {
  const group = new THREE.Group();
  group.name = 'Sinapses';
  group.userData.org = 'synapses';

  for (const conn of CONNECTIONS) {
    const fromPos = NEURON_POSITIONS[conn[0]];
    const toPos = NEURON_POSITIONS[conn[1]];
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    const dist = dir.length();
    dir.normalize();
    const synPos = fromPos.clone().add(dir.clone().multiplyScalar(dist * 0.85));

    for (let i = 0; i < 15; i++) {
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      );
      const p = synPos.clone().add(offset);
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6), matSynapse);
      particle.position.copy(p);
      particle.name = 'synapses';
      particle.userData.org = 'synapses';
      group.add(particle);
    }
  }

  return group;
}

function createTerminals() {
  const group = new THREE.Group();
  group.name = 'Terminais Sinápticos';
  group.userData.org = 'terminals';

  for (const conn of CONNECTIONS) {
    const fromPos = NEURON_POSITIONS[conn[0]];
    const toPos = NEURON_POSITIONS[conn[1]];
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    const dist = dir.length();
    dir.normalize();
    const termPos = fromPos.clone().add(dir.clone().multiplyScalar(dist * 0.84));

    const terminal = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), matTerminal);
    terminal.position.copy(termPos);
    terminal.name = 'terminals';
    terminal.userData.org = 'terminals';
    group.add(terminal);

    for (let i = 0; i < 4; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.2 + Math.random() * 0.1;
      const vesicle = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 6, 6),
        makeMat('#ffcc88', { transparent: true, opacity: 0.6 })
      );
      vesicle.position.set(
        termPos.x + Math.sin(phi) * Math.cos(theta) * r,
        termPos.y + Math.sin(phi) * Math.sin(theta) * r,
        termPos.z + Math.cos(phi) * r
      );
      vesicle.name = 'terminals';
      vesicle.userData.org = 'terminals';
      group.add(vesicle);
    }
  }

  return group;
}

function createSignalParticles() {
  const group = new THREE.Group();
  group.name = 'Sinais';

  for (let i = 0; i < signals.length; i++) {
    const signal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), matSignal);
    signal.userData.signalIndex = i;
    signal.userData.progress = Math.random();
    signal.userData.speed = 0.15 + Math.random() * 0.1;
    signal.userData.nextNeuron = signals[i].toIdx;
    group.add(signal);
  }

  return group;
}

function buildNeuralNetwork() {
  const networkGroup = new THREE.Group();

  const somaGroup = new THREE.Group();
  for (let i = 0; i < NEURON_POSITIONS.length; i++) {
    const s = createSoma(NEURON_POSITIONS[i], i);
    somaGroup.add(s);
  }
  organelles.soma = somaGroup;
  networkGroup.add(somaGroup);

  const dendGroup = new THREE.Group();
  for (let i = 0; i < NEURON_POSITIONS.length; i++) {
    const d = createDendrites(NEURON_POSITIONS[i], i);
    dendGroup.add(d);
  }
  organelles.dendrites = dendGroup;
  networkGroup.add(dendGroup);

  const axonGroup = createAxons();
  organelles.axon = axonGroup;
  networkGroup.add(axonGroup);

  const synGroup = createSynapses();
  organelles.synapses = synGroup;
  networkGroup.add(synGroup);

  const termGroup = createTerminals();
  organelles.terminals = termGroup;
  networkGroup.add(termGroup);

  const signalGroup = createSignalParticles();
  organelles.sinais = signalGroup;
  networkGroup.add(signalGroup);

  scene.add(networkGroup);

  networkGroup.traverse(child => {
    if (child.isMesh) hitTargets.push(child);
  });
}

buildNeuralNetwork();

// ============================================================
// SEÇÃO 6: FUNDO SINÁPTICO
// ============================================================
const bgGlowParticles = new THREE.BufferGeometry();
const bgCount = 600;
const bgPos = new Float32Array(bgCount * 3);
const bgSizes = new Float32Array(bgCount);
for (let i = 0; i < bgCount; i++) {
  const r = 12 + Math.random() * 18;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  bgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  bgPos[i * 3 + 1] = r * Math.cos(phi);
  bgPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  bgSizes[i] = 0.5 + Math.random() * 1.5;
}
bgGlowParticles.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
bgGlowParticles.setAttribute('size', new THREE.BufferAttribute(bgSizes, 1));

const bgMat = new THREE.PointsMaterial({
  color: '#ffaa44',
  transparent: true,
  opacity: 0.06,
  size: 0.3,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const bgPoints = new THREE.Points(bgGlowParticles, bgMat);
scene.add(bgPoints);

// ============================================================
// SEÇÃO 7: ANIMAÇÃO
// ============================================================
const clock = new THREE.Clock();
const signalMeshes = [];
organelles.sinais.traverse(child => {
  if (child.isMesh) signalMeshes.push(child);
});

function updateSignals(delta) {
  const spd = delta * speedMultiplier;
  for (const mesh of signalMeshes) {
    const idx = mesh.userData.signalIndex;
    const path = signals[idx];
    if (!path) continue;

    mesh.userData.progress += mesh.userData.speed * spd;
    if (mesh.userData.progress > 1) {
      mesh.userData.progress = 0;
    }

    const t = mesh.userData.progress;
    const pts = path.points;
    if (pts.length < 2) return;

    const segs = pts.length - 1;
    const seg = Math.floor(t * segs);
    const segT = (t * segs) - seg;
    const i0 = Math.min(seg, segs - 1);
    const i1 = i0 + 1;

    const p = new THREE.Vector3().lerpVectors(pts[i0], pts[i1], segT);
    mesh.position.copy(p);

    const intensity = 1.0 + 0.5 * Math.sin(t * Math.PI * 6);
    mesh.material.emissiveIntensity = 1.5 + intensity;
    const s = 1.0 + 0.3 * Math.sin(t * Math.PI * 6);
    mesh.scale.set(s, s, s);
  }
}

function updateAnimations(elapsed, delta) {
  updateSignals(delta);

  const t = elapsed * speedMultiplier;
  for (const child of organelles.synapses.children) {
    if (child.isMesh) {
      const flicker = 0.5 + 0.5 * Math.sin(t * 3 + child.id);
      child.material.opacity = 0.3 + flicker * 0.5;
    }
  }

  for (const child of organelles.terminals.children) {
    if (child.isMesh && child.material && child.material.emissiveIntensity !== undefined) {
      child.material.emissiveIntensity = 0.05 + 0.1 * Math.sin(t * 2 + child.id);
    }
  }
}

// ============================================================
// SEÇÃO 8: RAYCASTER E SELEÇÃO
// ============================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');

let currentHighlight = null;
let selectedInfo = null;

function getOrgIdFromHit(hit) {
  let obj = hit.object;
  while (obj) {
    if (obj.userData.org) return obj.userData.org;
    obj = obj.parent;
  }
  return null;
}

function highlightStructure(id) {
  if (currentHighlight) {
    for (const mesh of currentHighlight.meshes) {
      if (mesh.material) {
        mesh.material.emissive = new THREE.Color('#000000');
        mesh.material.emissiveIntensity = 0;
      }
    }
  }

  if (!id) {
    currentHighlight = null;
    selectedInfo = null;
    infoPanel.classList.remove('visible');
    return;
  }

  const config = STRUCTURE_CONFIG.find(c => c.id === id);
  const info = STRUCTURE_INFO[id];
  if (!config || !info) return;

  const meshes = [];
  const group = organelles[id];
  if (group) {
    group.traverse(child => {
      if (child.isMesh) meshes.push(child);
    });
  }

  for (const mesh of meshes) {
    if (mesh.material) {
      mesh.material.emissive = new THREE.Color('#6c5ce7');
      mesh.material.emissiveIntensity = 0.3;
    }
  }

  currentHighlight = { id, meshes };
  selectedInfo = { id, config, info };

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
    const id = getOrgIdFromHit(intersects[0]);
    if (id) {
      highlightStructure(id);
      return;
    }
  }

  highlightStructure(null);
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);

// ============================================================
// SEÇÃO 9: INTERFACE GRÁFICA
// ============================================================
function createUI() {
  const list = document.getElementById('structure-list');
  list.innerHTML = '';

  for (const config of STRUCTURE_CONFIG) {
    const item = document.createElement('label');
    item.className = 'structure-item';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = true;
    cb.dataset.id = config.id;

    const dot = document.createElement('span');
    dot.className = 'color-dot';
    dot.style.background = config.color;

    const label = document.createElement('span');
    label.className = 'structure-label';
    label.textContent = config.name;

    item.appendChild(cb);
    item.appendChild(dot);
    item.appendChild(label);

    cb.addEventListener('change', () => {
      const group = organelles[config.id];
      if (group) group.visible = cb.checked;
    });

    list.appendChild(item);
  }

  const btnGroup = document.getElementById('btn-group');
  btnGroup.innerHTML = '';

  const speedLabel = document.createElement('div');
  speedLabel.style.cssText = 'width:100%;font-size:11px;color:var(--text-secondary);margin-bottom:2px;font-weight:600;letter-spacing:0.3px;';
  speedLabel.textContent = 'VELOCIDADE';
  btnGroup.appendChild(speedLabel);

  const speedRow = document.createElement('div');
  speedRow.style.cssText = 'display:flex;gap:4px;width:100%;';

  const speeds = [0.5, 1, 3, 10];
  for (const s of speeds) {
    const btn = document.createElement('button');
    btn.className = `btn ${s === 1 ? 'btn-primary' : ''}`;
    btn.textContent = `${s}x`;
    btn.style.flex = '1';
    btn.style.minWidth = '0';
    btn.dataset.speed = s;
    btn.addEventListener('click', () => {
      speedMultiplier = s;
      speedRow.querySelectorAll('button').forEach(b => {
        b.className = 'btn';
        if (parseFloat(b.dataset.speed) === s) b.className = 'btn btn-primary';
      });
    });
    speedRow.appendChild(btn);
  }
  btnGroup.appendChild(speedRow);

  const showAllBtn = document.createElement('button');
  showAllBtn.className = 'btn btn-primary';
  showAllBtn.textContent = 'Mostrar Tudo';
  showAllBtn.addEventListener('click', () => {
    for (const [id, group] of Object.entries(organelles)) {
      group.visible = true;
    }
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = true);
  });

  const hideAllBtn = document.createElement('button');
  hideAllBtn.className = 'btn btn-danger';
  hideAllBtn.textContent = 'Ocultar Tudo';
  hideAllBtn.addEventListener('click', () => {
    for (const [id, group] of Object.entries(organelles)) {
      group.visible = false;
    }
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  });

  const resetCamBtn = document.createElement('button');
  resetCamBtn.className = 'btn';
  resetCamBtn.textContent = 'Resetar Câmera';
  resetCamBtn.addEventListener('click', resetCamera);

  btnGroup.append(showAllBtn, hideAllBtn, resetCamBtn);
}

createUI();

// ============================================================
// SEÇÃO 10: REDIMENSIONAMENTO
// ============================================================
function onResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', onResize);

// ============================================================
// SEÇÃO 11: RENDERIZAÇÃO
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

// ============================================================
// SEÇÃO 12: TOGGLE SIDEBAR
// ============================================================
const toggleBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
let sidebarVisible = true;

toggleBtn.addEventListener('click', () => {
  sidebarVisible = !sidebarVisible;
  sidebar.style.display = sidebarVisible ? 'flex' : 'none';
  toggleBtn.textContent = sidebarVisible ? '☰' : '☰';
});

console.log('🧠 Rede de Neurônios carregada com sucesso!');
