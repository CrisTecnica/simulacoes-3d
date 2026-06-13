// ============================================================
// CONFIGURAÇÃO DA DIVISÃO CELULAR
// ============================================================
const CELL_RADIUS = 5;
const SPEED_DEFAULT = 1;

const STRUCTURE_CONFIG = [
  { id: 'chromosomes', name: 'Cromossomos', color: '#ff4488' },
  { id: 'spindle', name: 'Fuso Mitótico', color: '#66ffaa' },
  { id: 'centrioles', name: 'Centríolos', color: '#ffcc44' },
  { id: 'nuclearMembrane', name: 'Membrana Nuclear', color: '#aa66ff' },
  { id: 'cytoplasm', name: 'Citoplasma', color: '#8ab8d4' },
  { id: 'nucleolus', name: 'Nucléolo', color: '#ff4466' },
];

const STRUCTURE_INFO = {
  chromosomes: {
    description: 'Estruturas compostas por DNA altamente condensado e proteínas histonas. Cada cromossomo consiste em duas cromátides irmãs unidas pelo centrômero.',
    function: 'Empacotar e organizar o DNA para garantir a distribuição equitativa do material genético às células-filhas durante a divisão.',
  },
  spindle: {
    description: 'Conjunto de microtúbulos que se estendem dos centríolos aos cromossomos, formando o fuso mitótico ou meiótico.',
    function: 'Movimentar e posicionar os cromossomos durante a divisão celular, garantindo a segregação correta.',
  },
  centrioles: {
    description: 'Estruturas cilíndricas pareadas (diplossomo) organizadoras dos microtúbulos, localizadas nos polos da célula durante a divisão.',
    function: 'Organizar os microtúbulos do fuso e determinar os polos da divisão celular.',
  },
  nuclearMembrane: {
    description: 'Envoltório nuclear composto por dupla membrana lipídica com poros, que se desorganiza durante a prófase e se reorganiza na telófase.',
    function: 'Proteger e separar o material genético do citoplasma durante a interfase; desfaz-se para permitir a ligação do fuso aos cromossomos.',
  },
  cytoplasm: {
    description: 'Matriz gelatinosa (citosol) que preenche o interior celular, contendo organelas, íons e moléculas necessárias para o metabolismo.',
    function: 'Meio onde ocorrem as reações metabólicas; sua divisão (citocinese) completa a separação das células-filhas.',
  },
  nucleolus: {
    description: 'Região densa no núcleo responsável pela produção de RNA ribossomal. Desaparece durante a divisão e se reorganiza após a telófase.',
    function: 'Síntese e montagem das subunidades ribossomais; sua dissolução marca o início da divisão celular.',
  },
};

const MITOSIS_STAGES = [
  { name: 'Prófase', desc: 'Condensação dos cromossomos. Centríolos migram. Membrana nuclear se desfaz.' },
  { name: 'Metáfase', desc: 'Cromossomos alinhados no equador da célula. Fuso ligado aos centrômeros.' },
  { name: 'Anáfase', desc: 'Cromátides irmãs separam-se e migram para polos opostos.' },
  { name: 'Telófase', desc: 'Novos núcleos formam-se. Citocinese divide a célula em duas.' },
];

const MEIOSIS_STAGES = [
  { name: 'Prófase I', desc: 'Pareamento de homólogos (sinapse). Crossing-over troca material genético.' },
  { name: 'Metáfase I', desc: 'Pares homólogos alinhados no equador. Fuso liga-se a cada homólogo.' },
  { name: 'Anáfase I', desc: 'Homólogos separam-se (divisão reducional). Cada par vai para um polo.' },
  { name: 'Telófase I', desc: 'Duas células haploides formam-se. Os cromossomos ainda têm duas cromátides.' },
  { name: 'Prófase II', desc: 'Cromossomos condensam-se novamente nas duas células.' },
  { name: 'Metáfase II', desc: 'Cromossomos alinhados no equador em cada célula.' },
  { name: 'Anáfase II', desc: 'Cromátides irmãs separam-se em cada célula.' },
  { name: 'Telófase II', desc: 'Quatro células haploides geneticamente distintas formam-se.' },
];

const CHROMOSOME_PAIRS = [
  { colorA: '#ff4488', colorB: '#ff8844', pair: 0 },
  { colorA: '#4488ff', colorB: '#44ff88', pair: 1 },
];

const CHROMATID_ARMS_LEN = 0.45;
const CHROMATID_RADIUS = 0.04;

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(14, 10, 16);

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

const DEFAULT_CAMERA_POS = new THREE.Vector3(14, 10, 16);
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
    emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color('#000000'),
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
}

const matCellMembrane = makeMat('#ff66aa', { transparent: true, opacity: 0.08, roughness: 0.1, side: THREE.DoubleSide, emissive: '#ff66aa', emissiveIntensity: 0.02 });
const matCytoplasm = makeMat('#8ab8d4', { transparent: true, opacity: 0.12, roughness: 0.6 });
const matNucMembrane = makeMat('#aa66ff', { transparent: true, opacity: 0.25, roughness: 0.2, side: THREE.DoubleSide, emissive: '#8844dd', emissiveIntensity: 0.05 });
const matNucleolus = makeMat('#ff4466', { roughness: 0.3, clearcoat: 0.5, emissive: '#cc2244', emissiveIntensity: 0.15 });
const matCentriole = makeMat('#ffcc44', { roughness: 0.3, clearcoat: 0.3, emissive: '#ffaa22', emissiveIntensity: 0.1 });
const matSpindle = new THREE.MeshBasicMaterial({ color: '#66ffaa', transparent: true, opacity: 0.3 });
const matSpindleLine = new THREE.LineBasicMaterial({ color: '#66ffaa', transparent: true, opacity: 0.2 });
const matCentromere = new THREE.MeshPhysicalMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.2, roughness: 0.3 });

// ============================================================
// CRIAÇÃO DOS COMPONENTES
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const stageLabel = document.getElementById('stage-name');
const stageDesc = document.getElementById('stage-desc');
const stageProgress = document.getElementById('stage-progress');

// --- Cell Membrane ---
function createCellMembrane() {
  const group = new THREE.Group();
  group.name = 'Membrana Celular';

  const outer = new THREE.Mesh(new THREE.SphereGeometry(CELL_RADIUS * 1.02, 40, 40), matCellMembrane);
  outer.name = 'cytoplasm';
  outer.userData.organelleId = 'cytoplasm';

  const inner = new THREE.Mesh(new THREE.SphereGeometry(CELL_RADIUS * 0.98, 40, 40), matCytoplasm);
  inner.userData.organelleId = 'cytoplasm';

  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(CELL_RADIUS * 1.01, 20, 14)),
    new THREE.LineBasicMaterial({ color: '#ff66aa', transparent: true, opacity: 0.04 })
  );

  group.add(outer);
  group.add(inner);
  group.add(wireframe);
  group.userData.organelleId = 'cytoplasm';
  return group;
}

// --- Nuclear Membrane ---
function createNuclearMembrane() {
  const group = new THREE.Group();
  group.name = 'Membrana Nuclear';

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 32), matNucMembrane);
  mesh.userData.organelleId = 'nuclearMembrane';
  group.add(mesh);

  for (let i = 0; i < 20; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.6;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.1, 8),
      new THREE.MeshBasicMaterial({ color: '#bb88ff', transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    ring.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    ring.lookAt(0, 0, 0);
    ring.userData.organelleId = 'nuclearMembrane';
    group.add(ring);
  }

  return group;
}

// --- Nucleolus ---
function createNucleolus() {
  const group = new THREE.Group();
  group.name = 'Nucléolo';

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), matNucleolus);
  mesh.userData.organelleId = 'nucleolus';
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}

// --- Centrioles ---
function createCentriolePair(color) {
  const group = new THREE.Group();
  const cylMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    clearcoat: 0.3,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.1,
  });

  const cylGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6);
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const triplet = new THREE.Group();
    for (let t = 0; t < 3; t++) {
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.set(0, 0, (t - 1) * 0.02);
      triplet.add(cyl);
    }
    triplet.position.set(Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0);
    triplet.rotation.z = angle;
    group.add(triplet);
  }

  const c2 = group.clone();
  c2.rotation.x = Math.PI / 2;
  group.add(c2);

  return group;
}

function createCentrioles() {
  const group = new THREE.Group();
  group.name = 'Centríolos';

  const g1 = createCentriolePair('#ffcc44');
  g1.position.set(-3.5, 0, 0);
  g1.userData.organelleId = 'centrioles';
  group.add(g1);

  const g2 = createCentriolePair('#ffcc44');
  g2.position.set(3.5, 0, 0);
  g2.userData.organelleId = 'centrioles';
  group.add(g2);

  return group;
}

// --- Chromosomes ---
function createChromatid(color) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.35,
    clearcoat: 0.2,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.15,
  });

  const armUp = new THREE.Mesh(new THREE.CylinderGeometry(CHROMATID_RADIUS, CHROMATID_RADIUS, CHROMATID_ARMS_LEN, 6), mat);
  armUp.position.y = CHROMATID_ARMS_LEN / 2;

  const armDown = new THREE.Mesh(new THREE.CylinderGeometry(CHROMATID_RADIUS, CHROMATID_RADIUS, CHROMATID_ARMS_LEN, 6), mat);
  armDown.position.y = -CHROMATID_ARMS_LEN / 2;

  const group = new THREE.Group();
  group.add(armUp);
  group.add(armDown);
  group.userData.matColor = color;
  return group;
}

function createChromosomes() {
  const group = new THREE.Group();
  group.name = 'Cromossomos';

  const chromatids = [];
  for (let p = 0; p < CHROMOSOME_PAIRS.length; p++) {
    const pair = CHROMOSOME_PAIRS[p];

    for (let c = 0; c < 2; c++) {
      const color = c === 0 ? pair.colorA : pair.colorB;
      const chromGroup = new THREE.Group();
      chromGroup.name = `Cromossomo ${p * 2 + c + 1}`;

      const cLeft = createChromatid(color);
      cLeft.position.x = -0.06;
      cLeft.userData.isChromatid = true;
      cLeft.userData.chromosomeIndex = p * 2 + c;
      cLeft.userData.chromatidSide = 'left';

      const cRight = createChromatid(color);
      cRight.position.x = 0.06;
      cRight.userData.isChromatid = true;
      cRight.userData.chromosomeIndex = p * 2 + c;
      cRight.userData.chromatidSide = 'right';

      const centromere = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), matCentromere);
      centromere.userData.organelleId = 'chromosomes';

      chromGroup.add(cLeft);
      chromGroup.add(cRight);
      chromGroup.add(centromere);
      chromGroup.userData.organelleId = 'chromosomes';
      chromGroup.userData.pair = pair.pair;
      chromGroup.userData.chromIndex = p * 2 + c;
      chromGroup.userData.isMaternal = c === 0;
      chromGroup.userData.color = color;

      group.add(chromGroup);
      chromatids.push(chromGroup);
    }
  }

  group.userData.chromatids = chromatids;
  return group;
}

// --- Spindle Fibers ---
function createSpindle() {
  const group = new THREE.Group();
  group.name = 'Fuso Mitótico';
  return group;
}

function updateSpindle(spindleGroup, chromatidGroups, centriolePos1, centriolePos2, stage, progress) {
  while (spindleGroup.children.length > 0) {
    spindleGroup.remove(spindleGroup.children[0]);
  }

  if (stage < 0.5) return;

  for (const cg of chromatidGroups) {
    const cPos = cg.position.clone();
    for (let c = 0; c < 2; c++) {
      const cp = c === 0 ? centriolePos1 : centriolePos2;
      const mid = new THREE.Vector3().addVectors(cPos, cp).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(cp, cPos);
      const len = dir.length();
      if (len < 0.5) continue;

      const pts = [
        cPos.clone(),
        mid.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1)),
        cp.clone(),
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 6, 0.015, 4, false),
        new THREE.MeshBasicMaterial({ color: '#66ffaa', transparent: true, opacity: 0.15 + stage * 0.15 })
      );
      tube.userData.organelleId = 'spindle';
      spindleGroup.add(tube);
    }
  }
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

const cellGroup = createCellMembrane();
structures.cytoplasm = cellGroup;
mainGroup.add(cellGroup);

const nucMem = createNuclearMembrane();
structures.nuclearMembrane = nucMem;
mainGroup.add(nucMem);

const nolus = createNucleolus();
structures.nucleolus = nolus;
mainGroup.add(nolus);

const centrioles = createCentrioles();
structures.centrioles = centrioles;
mainGroup.add(centrioles);

const chromosomes = createChromosomes();
structures.chromosomes = chromosomes;
mainGroup.add(chromosomes);

const spindleGroup = createSpindle();
structures.spindle = spindleGroup;
mainGroup.add(spindleGroup);

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.organelleId) hitTargets.push(obj);
  if (obj.children) for (const c of obj.children) collectHitTargets(c);
}
collectHitTargets(mainGroup);

// ============================================================
// ESTADO DA DIVISÃO
// ============================================================
const state = {
  mode: 'mitose',
  stage: 0,
  stageTime: 0,
  stageDuration: 9,
  speed: SPEED_DEFAULT,
  isRunning: true,
  totalStages: 4,
  chromosomes: [],
};

function getCurrentStages() {
  return state.mode === 'mitose' ? MITOSIS_STAGES : MEIOSIS_STAGES;
}

function updateStageDisplay() {
  const stages = getCurrentStages();
  const idx = Math.min(Math.floor(state.stage), stages.length - 1);
  const s = stages[idx];
  if (s) {
    stageLabel.textContent = s.name;
    stageDesc.textContent = s.desc;
  }

  stageProgress.innerHTML = '';
  for (let i = 0; i < stages.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'stage-dot';
    if (i === Math.min(Math.floor(state.stage), stages.length - 1)) dot.classList.add('active');
    else if (i < state.stage) dot.classList.add('done');
    stageProgress.appendChild(dot);
  }
}

function getChromatidGroups() {
  const result = [];
  if (!chromosomes) return result;
  for (const child of chromosomes.children) {
    if (child.userData && child.userData.organelleId === 'chromosomes') {
      const left = child.children.find(c => c.userData && c.userData.chromatidSide === 'left');
      const right = child.children.find(c => c.userData && c.userData.chromatidSide === 'right');
      result.push({ group: child, left, right, data: child.userData });
    }
  }
  return result;
}

function getStageProgress() {
  return (state.stageTime % state.stageDuration) / state.stageDuration;
}

function setStage(stageIndex) {
  state.stage = Math.max(0, Math.min(stageIndex, getCurrentStages().length - 1));
  state.stageTime = 0;
  updateStageDisplay();
}

// ============================================================
// ANIMAÇÃO DOS ESTÁGIOS
// ============================================================
const clock = new THREE.Clock();
let rotationEnabled = true;

function lerp(a, b, t) { return a + (b - a) * t; }

function updateDivision(time, delta) {
  if (rotationEnabled) {
    mainGroup.rotation.y += delta * 0.015;
  }

  if (!state.isRunning) return;

  const speed = state.speed;
  state.stageTime += delta * speed;

  const stages = getCurrentStages();
  const stageIdx = Math.min(Math.floor(state.stage), stages.length - 1);
  const progress = Math.min(state.stageTime / state.stageDuration, 1);

  const chromatidData = getChromatidGroups();
  const allCg = chromatidData.map(d => d.group);

  // --- Chromosome positions ---
  const leftCentPos = new THREE.Vector3(-3.5, 0, 0);
  const rightCentPos = new THREE.Vector3(3.5, 0, 0);

  if (state.mode === 'mitose') {
    animateMitosis(stageIdx, progress, allCg, chromatidData, time);
  } else {
    animateMeiosis(stageIdx, progress, allCg, chromatidData, time);
  }

  updateCentrioles(stageIdx, progress);
  updateNuclearMembrane(stageIdx, progress);
  updateNucleolus(stageIdx, progress);
  updateSpindle(spindleGroup, allCg, leftCentPos, rightCentPos, stageIdx, progress);

  if (state.stageTime >= state.stageDuration) {
    if (state.stage < stages.length - 1) {
      setStage(state.stage + 1);
      state.stageTime = 0;
    } else {
      state.isRunning = false;
      setTimeout(() => {
        state.isRunning = true;
        setStage(0);
        state.stageTime = 0;
      }, 3000 / speed);
    }
  }
}

function animateMitosis(stageIdx, progress, allCg, chromatidData, time) {
  for (let i = 0; i < allCg.length; i++) {
    const cg = allCg[i];
    const data = chromatidData[i];

    const startOffset = 1.2;
    const equatorX = (i - 1.5) * 0.8;

    switch (stageIdx) {
      case 0: {
        const condense = Math.min(progress * 3, 1);
        const spreadAngle = (i / allCg.length) * Math.PI * 2 + time * 0.1;
        const r = (1 - condense) * 2.5 + 0.3;
        cg.position.x = Math.cos(spreadAngle) * r;
        cg.position.z = Math.sin(spreadAngle) * r;
        cg.position.y = (Math.random() * 0.5 - 0.25) * (1 - condense);
        const s = 0.2 + condense * 0.8;
        cg.scale.set(s, s, s);

        if (data.left && data.right) {
          const sep = (1 - condense) * 0.02;
          data.left.position.x = -0.06 - sep;
          data.right.position.x = 0.06 + sep;
        }
        break;
      }
      case 1: {
        const align = Math.min(progress * 4, 1);
        cg.position.x = lerp(cg.position.x, equatorX, align * 0.08);
        cg.position.y = lerp(cg.position.y, 0, align * 0.08);
        cg.position.z = lerp(cg.position.z, 0, align * 0.08);
        cg.scale.set(1, 1, 1);
        if (data.left && data.right) {
          data.left.position.x = -0.06;
          data.right.position.x = 0.06;
        }
        cg.rotation.y += delta * 0.3;
        break;
      }
      case 2: {
        const sepfact = Math.min(progress * 2.5, 1);
        const targetL = -3 + (i - 1.5) * 0.3;
        const targetR = 3 + (i - 1.5) * 0.3;
        if (data.left) {
          data.left.position.x = lerp(-0.06, targetL, sepfact);
        }
        if (data.right) {
          data.right.position.x = lerp(0.06, targetR, sepfact);
        }
        cg.position.x = 0;
        cg.rotation.y += delta * 0.2 * (1 - sepfact);
        break;
      }
      case 3: {
        const moves = progress < 0.3 ? progress / 0.3 : 1;
        const side = i < allCg.length / 2 ? -1 : 1;
        const targetS = -3 * side;
        if (data.left) data.left.position.x = lerp(data.left.position.x, targetS, 0.04);
        if (data.right) data.right.position.x = lerp(data.right.position.x, targetS, 0.04);
        const decondense = Math.min(Math.max(progress - 0.5, 0) * 4, 1);
        cg.scale.set(1 - decondense * 0.6, 1 - decondense * 0.6, 1 - decondense * 0.6);
        break;
      }
    }
  }
}

function animateMeiosis(stageIdx, progress, allCg, chromatidData, time) {
  for (let i = 0; i < allCg.length; i++) {
    const cg = allCg[i];
    const data = chromatidData[i];
    const pair = data.data ? data.data.pair : 0;
    const isMaternal = data.data ? data.data.isMaternal : true;
    const chrIdx = data.data ? data.data.chromIndex : i;

    switch (stageIdx) {
      case 0: {
        const condense = Math.min(progress * 3, 1);
        const pairOffset = pair === 0 ? 0.5 : -0.5;
        const maternalSide = isMaternal ? -0.3 : 0.3;
        const r = (1 - condense) * 1.5 + 0.2;
        const angle = (chrIdx / 4) * Math.PI * 2 + time * 0.05;
        cg.position.x = Math.cos(angle) * r + maternalSide * condense;
        cg.position.z = Math.sin(angle) * r * 0.5;
        cg.position.y = pairOffset * (1 - condense * 0.5);
        const s = 0.2 + condense * 0.8;
        cg.scale.set(s, s, s);
        if (data.left && data.right) {
          data.left.position.x = -0.06;
          data.right.position.x = 0.06;
        }
        if (condense > 0.6 && Math.random() < 0.01) {
          const flashMat = new THREE.MeshBasicMaterial({ color: '#ff66aa', transparent: true, opacity: 0.3, side: THREE.DoubleSide });
          const flash = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), flashMat);
          flash.position.copy(cg.position);
          flash.position.x += (Math.random() - 0.5) * 0.3;
          mainGroup.add(flash);
          setTimeout(() => mainGroup.remove(flash), 200);
        }
        break;
      }
      case 1: {
        const align = Math.min(progress * 4, 1);
        const pairX = pair === 0 ? -1 : 1;
        const sideOff = isMaternal ? -0.5 : 0.5;
        cg.position.x = lerp(cg.position.x, pairX + sideOff * 0.5, align * 0.08);
        cg.position.y = lerp(cg.position.y, 0, align * 0.08);
        cg.position.z = lerp(cg.position.z, 0, align * 0.08);
        cg.scale.set(1, 1, 1);
        cg.rotation.y += delta * 0.2;
        break;
      }
      case 2: {
        const separate = Math.min(progress * 2.5, 1);
        const targetX = isMaternal ? -3.5 : 3.5;
        cg.position.x = lerp(cg.position.x, targetX, separate * 0.04);
        cg.position.y = lerp(cg.position.y, 0, separate * 0.04);
        cg.position.z = lerp(cg.position.z, 0, separate * 0.04);
        if (data.left && data.right) {
          data.left.position.x = -0.06;
          data.right.position.x = 0.06;
        }
        break;
      }
      case 3: {
        const targetX = isMaternal ? -4 : 4;
        cg.position.x = lerp(cg.position.x, targetX, 0.03);
        const decond = Math.min(Math.max(progress - 0.5, 0) * 4, 1);
        cg.scale.set(1 - decond * 0.5, 1 - decond * 0.5, 1 - decond * 0.5);
        break;
      }
      case 4: {
        const cond = Math.min(progress * 4, 1);
        const sideM = isMaternal ? -2.5 : 2.5;
        cg.position.x = lerp(cg.position.x, sideM, 0.02);
        cg.position.y = pair === 0 ? -0.5 : 0.5;
        cg.scale.set(0.3 + cond * 0.7, 0.3 + cond * 0.7, 0.3 + cond * 0.7);
        break;
      }
      case 5: {
        const align = Math.min(progress * 4, 1);
        const sideM = isMaternal ? -2.5 : 2.5;
        const yOff = pair === 0 ? -0.5 : 0.5;
        cg.position.x = lerp(cg.position.x, sideM, align * 0.05);
        cg.position.y = lerp(cg.position.y, yOff, align * 0.05);
        cg.scale.set(1, 1, 1);
        cg.rotation.y += delta * 0.3;
        break;
      }
      case 6: {
        const sepfact = Math.min(progress * 2.5, 1);
        if (data.left) data.left.position.x = lerp(-0.06, -2, sepfact);
        if (data.right) data.right.position.x = lerp(0.06, 2, sepfact);
        cg.position.x = isMaternal ? -2.5 : 2.5;
        break;
      }
      case 7: {
        const targetX = isMaternal ? -3.5 + (pair * 0.3 - 0.15) : 3.5 + (pair * 0.3 - 0.15);
        const targetZ = isMaternal ? -0.5 + (i % 2) * 1 : -0.5 + (i % 2) * 1;
        cg.position.x = lerp(cg.position.x, targetX, 0.03);
        cg.position.z = lerp(cg.position.z, targetZ, 0.03);
        const decond = Math.min(Math.max(progress - 0.4, 0) * 3, 1);
        cg.scale.set(1 - decond * 0.7, 1 - decond * 0.7, 1 - decond * 0.7);
        break;
      }
    }
  }

  if (stageIdx >= 3) {
    const split = stageIdx >= 4 ? 1 : Math.min(Math.max(progress - 0.5, 0) * 4, 1);
    for (const cg of allCg) {
      cg.position.x *= 1 + split * 0.3;
    }
  }
}

function updateCentrioles(stageIdx, progress) {
  if (!centrioles || centrioles.children.length < 2) return;
  const left = centrioles.children[0];
  const right = centrioles.children[1];
  if (!left || !right) return;

  if (stageIdx === 0) {
    const move = Math.min(progress * 3, 1);
    const startDist = 0.8;
    const endDist = 3.5;
    const dist = lerp(startDist, endDist, move);
    left.position.x = -dist;
    right.position.x = dist;
    left.position.y = lerp(0.5, 0, move);
    right.position.y = lerp(-0.5, 0, move);
  } else {
    left.position.x = -3.5;
    right.position.x = 3.5;
    left.position.y = 0;
    right.position.y = 0;
  }

  left.rotation.y += 0.02;
  right.rotation.y += 0.02;
}

function updateNuclearMembrane(stageIdx, progress) {
  if (!nucMem) return;
  if (stageIdx === 0) {
    const fade = Math.min(progress * 2, 1);
    nucMem.visible = true;
    nucMem.children.forEach(c => {
      if (c.material) {
        c.material.opacity = 0.25 * (1 - fade);
        c.material.transparent = true;
      }
    });
    nucMem.scale.set(1, 1, 1);
  } else if (stageIdx <= 2) {
    nucMem.visible = false;
  } else {
    if (state.mode === 'mitose') {
      const reappear = Math.min(Math.max(progress - 0.3, 0) * 2, 1);
      nucMem.visible = true;
      const splitSide = 1;
      nucMem.scale.set(1, 1, 1);
      nucMem.position.x = 0;
      nucMem.children.forEach(c => {
        if (c.material) {
          c.material.opacity = 0.25 * reappear;
          c.material.transparent = true;
        }
      });
    } else {
      const reappear = Math.min(Math.max(progress - 0.3, 0) * 2, 1);
      nucMem.visible = true;
      nucMem.position.x = 0;
      nucMem.children.forEach(c => {
        if (c.material) {
          c.material.opacity = 0.25 * reappear;
          c.material.transparent = true;
        }
      });
    }
  }
}

function updateNucleolus(stageIdx, progress) {
  if (!nolus) return;
  if (stageIdx === 0) {
    const fade = Math.min(progress * 2, 1);
    nolus.visible = true;
    nolus.scale.set(1 - fade * 0.8, 1 - fade * 0.8, 1 - fade * 0.8);
  } else if (stageIdx < 3 || (state.mode === 'meiose' && stageIdx < 7)) {
    nolus.visible = false;
  } else {
    const reappear = Math.min(Math.max(progress - 0.3, 0) * 2, 1);
    nolus.visible = true;
    nolus.scale.set(reappear * 0.8, reappear * 0.8, reappear * 0.8);
  }
}

// Store delta for use in callbacks
let delta = 0.016;

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
    if (mesh.material) { mesh.material.emissive = new THREE.Color('#ff66aa'); mesh.material.emissiveIntensity = 0.25; }
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
    for (const [id, g] of Object.entries(structures)) if (g) g.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = true);
  });
  makeBtn('Ocultar Tudo', 'btn-danger', () => {
    for (const [id, g] of Object.entries(structures)) if (g) g.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  });
  makeBtn('Resetar Câmera', '', resetCamera);
  makeBtn('Reiniciar', 'btn-warning', () => {
    location.reload();
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.speed = parseFloat(btn.dataset.speed);
    });
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      setStage(0);
      state.stageTime = 0;
      state.isRunning = true;
    });
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
updateStageDisplay();

function animate() {
  requestAnimationFrame(animate);
  delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  controls.update();
  updateDivision(elapsed, delta);
  renderer.render(scene, camera);
}
animate();

console.log('🔬 Simulação 3D de Divisão Celular carregada!');
