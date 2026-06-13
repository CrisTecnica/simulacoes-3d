// ============================================================
// CONFIGURAÇÃO
// ============================================================
const STRUCTURE_CONFIG = [
  { id: 'infected',   name: 'Célula Infectada',     color: '#44ff88' },
  { id: 'macrophage', name: 'Macrófago',             color: '#66ffaa' },
  { id: 'tcell',      name: 'Linfócito T',           color: '#88ffcc' },
  { id: 'antibodies', name: 'Anticorpos',            color: '#aaffdd' },
  { id: 'pathogens',  name: 'Patógenos',             color: '#44cc66' },
  { id: 'cytokines',  name: 'Citocinas',             color: '#00ff88' },
];

const STRUCTURE_INFO = {
  infected: {
    description: 'Célula do corpo infectada por patógenos, exibindo antígenos em sua superfície através do MHC classe I.',
    function: 'Alvo do sistema imunológico; sinaliza infecção através de marcadores de superfície para recrutar células de defesa.',
  },
  macrophage: {
    description: 'Célula fagocítica grande do sistema imune inato, capaz de englobar e digerir patógenos e restos celulares.',
    function: 'Fagocitose de patógenos e debris celulares; apresentação de antígenos; liberação de citocinas inflamatórias.',
  },
  tcell: {
    description: 'Linfócito T citotóxico que reconhece células infectadas através do complexo MHC-peptídeo antigênico.',
    function: 'Reconhecimento e destruição de células infectadas; coordenação da resposta imune adaptativa.',
  },
  antibodies: {
    description: 'Proteínas em forma de Y produzidas por linfócitos B, que se ligam especificamente a antígenos de patógenos.',
    function: 'Neutralização de patógenos; opsonização (marcação para fagocitose); ativação do sistema complemento.',
  },
  pathogens: {
    description: 'Microrganismos invasores como vírus e bactérias que causam infecção e doenças no organismo.',
    function: 'Causam infecção ao invadir células hospedeiras; estimulam a resposta imune inata e adaptativa.',
  },
  cytokines: {
    description: 'Proteínas sinalizadoras liberadas por células imunes para comunicar-se e coordenar a resposta inflamatória.',
    function: 'Sinalização intercelular; recrutamento de células imunes; regulação da intensidade e duração da resposta imune.',
  },
};

let speedMultiplier = 1;

// ============================================================
// SEÇÃO 1: CENA, CÂMERA E RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(20, 14, 20);

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

const DEFAULT_CAMERA_POS = new THREE.Vector3(20, 14, 20);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// SEÇÃO 3: ILUMINAÇÃO
// ============================================================
const ambientLight = new THREE.AmbientLight(0x204030, 0.5);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x44ff88, 0x113322, 0.6);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xccffdd, 2.0);
mainLight.position.set(15, 25, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x44ff88, 0.4);
fillLight.position.set(-10, 5, -15);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x44ff88, 0.3);
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

const matInfected  = makeMat('#44cc66', { roughness: 0.3, clearcoat: 0.1, emissive: '#228844', emissiveIntensity: 0.1, transparent: true, opacity: 0.7 });
const matMarker    = makeMat('#ff4444', { emissive: '#ff2222', emissiveIntensity: 0.5 });
const matMacro     = makeMat('#66ffaa', { roughness: 0.5, clearcoat: 0.1, transparent: true, opacity: 0.85 });
const matMacroNuc  = makeMat('#44cc88', { roughness: 0.3 });
const matTCell     = makeMat('#88ffcc', { roughness: 0.4, clearcoat: 0.2 });
const matTCore     = makeMat('#66ddaa', { roughness: 0.3 });
const matAntibody  = makeMat('#aaffdd', { roughness: 0.3, clearcoat: 0.1, transparent: true, opacity: 0.9 });
const matPathogen  = makeMat('#44cc66', { roughness: 0.6, emissive: '#226633', emissiveIntensity: 0.1 });
const matCytokine  = makeMat('#00ff88', { emissive: '#00ff88', emissiveIntensity: 1.5, roughness: 0.0 });
const matNucleus   = makeMat('#336644', { roughness: 0.3 });
const matSpike     = makeMat('#55dd77', { roughness: 0.5 });

// ============================================================
// SEÇÃO 5: CRIAÇÃO DAS ESTRUTURAS
// ============================================================
const organelles = {};
const hitTargets = [];
const pathogens = [];
const antibodies = [];
const cytokines = [];
const tCells = [];
const macroParts = [];

function createInfectedCell() {
  const group = new THREE.Group();
  group.name = 'Célula Infectada';
  group.userData.org = 'infected';

  const cell = new THREE.Mesh(new THREE.SphereGeometry(4.5, 40, 40), matInfected);
  cell.name = 'infected';
  cell.userData.org = 'infected';
  cell.castShadow = true;
  group.add(cell);

  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 24), matNucleus);
  nucleus.position.set(0.3, 0.5, -0.3);
  nucleus.name = 'infected';
  nucleus.userData.org = 'infected';
  group.add(nucleus);

  for (let i = 0; i < 60; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 4.7;
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 6, 6),
      matMarker
    );
    marker.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    marker.name = 'infected';
    marker.userData.org = 'infected';
    marker.userData.baseColor = new THREE.Color('#ff4444');
    marker.userData.phase = Math.random() * Math.PI * 2;
    group.add(marker);
  }

  organelles.infected = group;
  scene.add(group);
  return group;
}

function createMacrophage() {
  const group = new THREE.Group();
  group.name = 'Macrófago';
  group.userData.org = 'macrophage';
  group.position.set(6, 2, 5);

  const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), matMacro);
  body.scale.set(1.4, 0.9, 1.1);
  body.name = 'macrophage';
  body.userData.org = 'macrophage';
  body.castShadow = true;
  group.add(body);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), matMacroNuc);
  nuc.position.set(0.1, 0.2, 0.3);
  nuc.name = 'macrophage';
  nuc.userData.org = 'macrophage';
  group.add(nuc);

  for (let i = 0; i < 8; i++) {
    const theta = (i / 8) * Math.PI * 2;
    const phi = Math.random() * 0.6 + 0.3;
    const pseudopod = new THREE.Mesh(
      new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 8),
      matMacro
    );
    pseudopod.position.set(
      Math.sin(theta) * Math.sin(phi) * 1.2,
      Math.cos(phi) * 0.8,
      Math.cos(theta) * Math.sin(phi) * 1.2
    );
    pseudopod.name = 'macrophage';
    pseudopod.userData.org = 'macrophage';
    pseudopod.userData.theta = theta;
    pseudopod.userData.phi = phi;
    pseudopod.userData.basePos = pseudopod.position.clone();
    group.add(pseudopod);
    macroParts.push(pseudopod);
  }

  organelles.macrophage = group;
  scene.add(group);
  return group;
}

function createTCells() {
  const group = new THREE.Group();
  group.name = 'Linfócito T';
  group.userData.org = 'tcell';

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + 0.5;
    const dist = 7 + Math.random() * 2;
    const cell = new THREE.Group();
    const pos = new THREE.Vector3(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * dist
    );
    cell.position.copy(pos);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), matTCell);
    body.name = 'tcell';
    body.userData.org = 'tcell';
    body.castShadow = true;
    cell.add(body);

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), matTCore);
    core.position.set(0.05, 0.1, -0.05);
    core.name = 'tcell';
    core.userData.org = 'tcell';
    cell.add(core);

    cell.userData.orbitAngle = angle;
    cell.userData.orbitDist = dist;
    cell.userData.speed = 0.08 + Math.random() * 0.04;
    cell.userData.phase = Math.random() * Math.PI * 2;
    cell.userData.verticalOffset = (Math.random() - 0.5) * 3;
    group.add(cell);
    tCells.push(cell);
  }

  organelles.tcell = group;
  scene.add(group);
  return group;
}

function createAntibody(pos, targetPos) {
  const group = new THREE.Group();
  group.position.copy(pos);

  const armLen = 0.3;
  const armAngle = 0.4;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.4, 4),
    matAntibody
  );
  stem.position.y = 0.2;
  stem.name = 'antibodies';
  stem.userData.org = 'antibodies';
  group.add(stem);

  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, armLen, 4),
    matAntibody
  );
  leftArm.position.set(-0.12, 0.45, 0);
  leftArm.rotation.z = armAngle;
  leftArm.name = 'antibodies';
  leftArm.userData.org = 'antibodies';
  group.add(leftArm);

  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, armLen, 4),
    matAntibody
  );
  rightArm.position.set(0.12, 0.45, 0);
  rightArm.rotation.z = -armAngle;
  rightArm.name = 'antibodies';
  rightArm.userData.org = 'antibodies';
  group.add(rightArm);

  leftArm.rotateOnAxis(new THREE.Vector3(0, 0, 1), armAngle);
  rightArm.rotateOnAxis(new THREE.Vector3(0, 0, 1), -armAngle);

  const tipL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), matAntibody);
  tipL.position.set(-0.12 - Math.sin(armAngle) * armLen * 0.1, 0.45 + Math.cos(armAngle) * armLen, 0);
  tipL.name = 'antibodies';
  tipL.userData.org = 'antibodies';
  group.add(tipL);

  const tipR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), matAntibody);
  tipR.position.set(0.12 + Math.sin(armAngle) * armLen * 0.1, 0.45 + Math.cos(armAngle) * armLen, 0);
  tipR.name = 'antibodies';
  tipR.userData.org = 'antibodies';
  group.add(tipR);

  group.userData.targetPos = targetPos;
  group.userData.basePos = pos.clone();
  group.userData.speed = 0.2 + Math.random() * 0.2;
  group.userData.progress = Math.random();
  group.userData.bound = false;
  group.userData.targetIdx = -1;

  return group;
}

function createAntibodies() {
  const group = new THREE.Group();
  group.name = 'Anticorpos';
  group.userData.org = 'antibodies';

  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 4;
    const pos = new THREE.Vector3(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 4,
      Math.sin(angle) * dist
    );
    const targetPos = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );
    const ab = createAntibody(pos, targetPos);
    group.add(ab);
    antibodies.push(ab);
  }

  organelles.antibodies = group;
  scene.add(group);
  return group;
}

function createPathogens() {
  const group = new THREE.Group();
  group.name = 'Patógenos';
  group.userData.org = 'pathogens';

  const geo = new THREE.SphereGeometry(0.4, 10, 10);

  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 6 + Math.random() * 5;
    const pGroup = new THREE.Group();
    const pos = new THREE.Vector3(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 5,
      Math.sin(angle) * dist
    );
    pGroup.position.copy(pos);

    const sphere = new THREE.Mesh(geo, matPathogen);
    sphere.name = 'pathogens';
    sphere.userData.org = 'pathogens';
    sphere.castShadow = true;
    pGroup.add(sphere);

    const spikeCount = 10 + Math.floor(Math.random() * 8);
    for (let j = 0; j < spikeCount; j++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.2, 4),
        matSpike
      );
      spike.position.set(
        Math.sin(phi) * Math.cos(theta) * 0.5,
        Math.cos(phi) * 0.5,
        Math.sin(phi) * Math.sin(theta) * 0.5
      );
      spike.lookAt(spike.position.clone().multiplyScalar(2));
      spike.name = 'pathogens';
      spike.userData.org = 'pathogens';
      pGroup.add(spike);
    }

    pGroup.userData.orbitAngle = angle;
    pGroup.userData.orbitDist = dist;
    pGroup.userData.speed = 0.05 + Math.random() * 0.05;
    pGroup.userData.phase = Math.random() * Math.PI * 2;
    pGroup.userData.verticalOffset = (Math.random() - 0.5) * 5;
    pGroup.userData.targetAngle = angle;
    group.add(pGroup);
    pathogens.push(pGroup);
  }

  organelles.pathogens = group;
  scene.add(group);
  return group;
}

function createCytokines() {
  const group = new THREE.Group();
  group.name = 'Citocinas';
  group.userData.org = 'cytokines';

  for (let i = 0; i < 30; i++) {
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 12
    );
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), matCytokine);
    dot.position.copy(pos);
    dot.name = 'cytokines';
    dot.userData.org = 'cytokines';
    dot.userData.basePos = pos.clone();
    dot.userData.phase = Math.random() * Math.PI * 2;
    dot.userData.speed = 0.3 + Math.random() * 0.3;
    group.add(dot);
    cytokines.push(dot);
  }

  organelles.cytokines = group;
  scene.add(group);
  return group;
}

// ============================================================
// SEÇÃO 6: CONSTRUIR CENA
// ============================================================
createInfectedCell();
createMacrophage();
createTCells();
createAntibodies();
createPathogens();
createCytokines();

for (const key of Object.keys(organelles)) {
  const g = organelles[key];
  g.traverse(child => {
    if (child.isMesh) hitTargets.push(child);
  });
}

// ============================================================
// SEÇÃO 7: ANIMAÇÃO
// ============================================================
const clock = new THREE.Clock();

function updatePathogens(delta) {
  const spd = delta * speedMultiplier;
  for (const p of pathogens) {
    p.userData.orbitAngle += p.userData.speed * spd;
    const ang = p.userData.orbitAngle;
    const d = p.userData.orbitDist;
    const v = p.userData.verticalOffset;
    const phase = p.userData.phase;
    p.position.x = Math.cos(ang) * d;
    p.position.z = Math.sin(ang) * d;
    p.position.y = v + Math.sin(ang * 2 + phase) * 0.5;
    p.rotation.x += spd * 0.5;
    p.rotation.y += spd * 0.7;
  }
}

function updateTCells(delta) {
  const spd = delta * speedMultiplier;
  for (const t of tCells) {
    t.userData.orbitAngle += t.userData.speed * spd;
    const ang = t.userData.orbitAngle;
    const d = t.userData.orbitDist;
    const v = t.userData.verticalOffset;
    t.position.x = Math.cos(ang) * d;
    t.position.z = Math.sin(ang) * d;
    t.position.y = v + Math.sin(ang * 1.5 + t.userData.phase) * 0.8;
    t.rotation.y += spd * 1.2;
  }
}

function updateMacrophage(delta) {
  const spd = delta * speedMultiplier;
  const t = clock.getElapsedTime() * speedMultiplier;
  const macro = organelles.macrophage;
  if (!macro) return;

  macro.position.x = 4 * Math.cos(t * 0.08);
  macro.position.z = 4 * Math.sin(t * 0.08);
  macro.position.y = 0.5 * Math.sin(t * 0.12);

  macro.rotation.z = 0.1 * Math.sin(t * 0.1);

  for (const part of macroParts) {
    const pulse = 1.0 + 0.2 * Math.sin(t * 2 + part.userData.theta);
    part.scale.set(pulse, pulse, pulse);
  }
}

function updateAntibodies(delta) {
  const spd = delta * speedMultiplier;
  const t = clock.getElapsedTime() * speedMultiplier;

  for (const ab of antibodies) {
    if (!ab.userData.bound) {
      ab.userData.progress += ab.userData.speed * spd;
      if (ab.userData.progress > 1) ab.userData.progress -= 1;

      const p = ab.userData.progress;
      const base = ab.userData.basePos;
      const target = ab.userData.targetPos;

      ab.position.lerpVectors(base, target, p);

      const distToCell = ab.position.length();
      if (distToCell < 4.8) {
        ab.userData.bound = true;
        ab.userData.bindPos = ab.position.clone();
      }
    } else {
      ab.position.copy(ab.userData.bindPos);
    }

    ab.rotation.y += spd * 0.5;
    ab.rotation.x = 0.1 * Math.sin(t + ab.id);
  }
}

function updateCytokines(delta) {
  const spd = delta * speedMultiplier;
  const t = clock.getElapsedTime() * speedMultiplier;

  for (const c of cytokines) {
    const phase = c.userData.phase;
    const speed = c.userData.speed;
    const base = c.userData.basePos;
    c.position.x = base.x + Math.sin(t * speed + phase) * 0.5;
    c.position.y = base.y + Math.cos(t * speed * 0.7 + phase * 1.3) * 0.5;
    c.position.z = base.z + Math.sin(t * speed * 0.9 + phase * 0.7) * 0.5;

    const intensity = 0.8 + 0.7 * Math.sin(t * 2 + phase);
    c.material.emissiveIntensity = 1.0 + intensity;
    const s = 0.8 + 0.4 * Math.sin(t * 2 + phase);
    c.scale.set(s, s, s);
  }
}

function updateMarkers(delta) {
  const t = clock.getElapsedTime() * speedMultiplier;
  const group = organelles.infected;
  if (!group) return;

  group.traverse(child => {
    if (child.isMesh && child.userData.baseColor) {
      const phase = child.userData.phase;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + phase);
      child.material.emissiveIntensity = 0.3 + pulse * 0.5;
    }
  });
}

function updateAnimations(elapsed, delta) {
  updatePathogens(delta);
  updateTCells(delta);
  updateMacrophage(delta);
  updateAntibodies(delta);
  updateCytokines(delta);
  updateMarkers(delta);
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

console.log('🛡️ Sistema Imunológico carregado com sucesso!');
