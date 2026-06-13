// ============================================================
// CONFIGURAÇÃO
// ============================================================
const STRUCTURE_CONFIG = [
  { id: 'wall',       name: 'Parede Celular',           color: '#44cc44' },
  { id: 'membrane',   name: 'Membrana Plasmática',      color: '#66dd66' },
  { id: 'chloroplast',name: 'Cloroplastos',             color: '#22aa22' },
  { id: 'vacuole',    name: 'Vacúolo',                  color: '#88ee88' },
  { id: 'nucleus',    name: 'Núcleo',                   color: '#44aa44' },
  { id: 'mitochondria',name: 'Mitocôndrias',             color: '#66cc44' },
  { id: 'reticulum',  name: 'Retículo Endoplasmático',  color: '#55bb55' },
  { id: 'golgi',      name: 'Complexo de Golgi',        color: '#88dd66' },
  { id: 'ribosomes',  name: 'Ribossomos',               color: '#99ee77' },
  { id: 'vesicles',   name: 'Vesículas',                color: '#aaff88' },
];

const STRUCTURE_INFO = {
  wall: {
    description: 'Camada rígida externa composta principalmente de celulose, hemicelulose e pectina. Confere forma e rigidez à célula vegetal.',
    function: 'Proteção mecânica, manutenção da forma celular, controle do crescimento e regulação da pressão de turgor.',
  },
  membrane: {
    description: 'Bicamada lipídica localizada internamente à parede celular, regulando a entrada e saída de substâncias.',
    function: 'Permeabilidade seletiva, transporte de íons e moléculas, sinalização celular e adesão entre células.',
  },
  chloroplast: {
    description: 'Orgânulos verdes com dupla membrana e tilacoides internos empilhados em grana. Contêm clorofila para fotossíntese.',
    function: 'Realização da fotossíntese, convertendo energia luminosa em energia química (glicose) e produzindo oxigênio.',
  },
  vacuole: {
    description: 'Grande compartimento central ocupando até 90% do volume celular, contendo suco vacuolar com água, íons e pigmentos.',
    function: 'Armazenamento de água e nutrientes, manutenção da pressão de turgor, degradação de resíduos e pigmentação.',
  },
  nucleus: {
    description: 'Orgânulo esférico contendo o DNA da célula vegetal, delimitado pelo envelope nuclear com poros.',
    function: 'Armazenamento e expressão do material genético; controle das atividades celulares e regulação da divisão celular.',
  },
  mitochondria: {
    description: 'Orgânulos alongados com dupla membrana e cristas internas, responsáveis pela respiração celular.',
    function: 'Produção de ATP através da respiração celular; fornecimento de energia para processos metabólicos.',
  },
  reticulum: {
    description: 'Rede de membranas interconectadas que se estende pelo citoplasma, incluindo porções rugosas e lisas.',
    function: 'Síntese e modificação de proteínas (rugoso); síntese de lipídios e transporte intracelular (liso).',
  },
  golgi: {
    description: 'Conjunto de cisternas achatadas empilhadas responsável pela modificação e empacotamento de moléculas.',
    function: 'Modificação pós-traducional de proteínas, empacotamento em vesículas e distribuição para destinos celulares.',
  },
  ribosomes: {
    description: 'Complexos ribonucleoproteicos pequenos encontrados livres no citoplasma ou aderidos ao retículo endoplasmático.',
    function: 'Síntese de proteínas (tradução do mRNA em cadeias polipeptídicas) para uso celular ou exportação.',
  },
  vesicles: {
    description: 'Pequenas bolsas membranosas que transportam moléculas entre organelas e para a membrana plasmática.',
    function: 'Transporte intracelular de proteínas, lipídios e outras moléculas; exocitose e endocitose.',
  },
};

let speedMultiplier = 1;

const CELL_W = 6;
const CELL_H = 8;
const CELL_D = 6;

// ============================================================
// SEÇÃO 1: CENA, CÂMERA E RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(14, 12, 14);

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
controls.maxDistance = 40;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(14, 12, 14);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// SEÇÃO 3: ILUMINAÇÃO
// ============================================================
const ambientLight = new THREE.AmbientLight(0x304030, 0.5);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x66dd66, 0x224422, 0.6);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xddffdd, 2.0);
mainLight.position.set(12, 18, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x44cc44, 0.4);
fillLight.position.set(-8, 4, -10);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x44cc44, 0.3);
rimLight.position.set(-4, -10, -8);
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

const matWall       = makeMat('#44cc44', { transparent: true, opacity: 0.12, roughness: 0.3, side: THREE.DoubleSide });
const matWallEdge   = makeMat('#44cc44', { transparent: true, opacity: 0.25, roughness: 0.2, side: THREE.DoubleSide });
const matMembrane   = makeMat('#66dd66', { transparent: true, opacity: 0.08, roughness: 0.1, clearcoat: 0.2, side: THREE.DoubleSide });
const matChloro     = makeMat('#22aa22', { roughness: 0.4, clearcoat: 0.2, emissive: '#116611', emissiveIntensity: 0.1 });
const matChloroIn   = makeMat('#33bb33', { roughness: 0.6 });
const matChloroStack= makeMat('#117711', { roughness: 0.5, emissive: '#116611', emissiveIntensity: 0.05 });
const matVacuole    = makeMat('#88ee88', { transparent: true, opacity: 0.15, roughness: 0.1, clearcoat: 0.1, side: THREE.DoubleSide });
const matNucleus    = makeMat('#44aa44', { roughness: 0.3, clearcoat: 0.2 });
const matNucEnv     = makeMat('#55bb55', { transparent: true, opacity: 0.2, roughness: 0.2, side: THREE.DoubleSide });
const matNucleolus  = makeMat('#338833', { roughness: 0.3, emissive: '#226622', emissiveIntensity: 0.1 });
const matMito       = makeMat('#66cc44', { roughness: 0.4, clearcoat: 0.1 });
const matMitoInner  = makeMat('#559933', { roughness: 0.6 });
const matRER        = makeMat('#55bb55', { roughness: 0.5 });
const matSmoothER   = makeMat('#77dd77', { roughness: 0.4 });
const matGolgi      = makeMat('#88dd66', { roughness: 0.3, clearcoat: 0.2 });
const matGolgiEdge  = makeMat('#77cc55', { roughness: 0.4 });
const matRibosome   = makeMat('#99ee77', { roughness: 0.7, emissive: '#88dd66', emissiveIntensity: 0.05 });
const matVesicle    = makeMat('#aaff88', { transparent: true, opacity: 0.6, roughness: 0.2, clearcoat: 0.2 });

// ============================================================
// SEÇÃO 5: CRIAÇÃO DAS ESTRUTURAS
// ============================================================
const organelles = {};
const hitTargets = [];
const ribosomeMeshes = [];
const vesicleMeshes = [];

function createWall() {
  const group = new THREE.Group();
  group.name = 'Parede Celular';
  group.userData.org = 'wall';

  const w = CELL_W + 0.6;
  const h = CELL_H + 0.6;
  const d = CELL_D + 0.6;

  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWall);
  box.name = 'wall';
  box.userData.org = 'wall';
  group.add(box);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w * 0.99, h * 0.99, d * 0.99)),
    new THREE.LineBasicMaterial({ color: '#44cc44', transparent: true, opacity: 0.15 })
  );
  edges.name = 'wall';
  edges.userData.org = 'wall';
  group.add(edges);

  const struts = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * w * 0.95;
    const y = (Math.random() - 0.5) * h * 0.95;
    const z = (Math.random() - 0.5) * d * 0.95;
    const fiber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.2 + Math.random() * 0.3, 3),
      makeMat('#55cc55', { transparent: true, opacity: 0.3 })
    );
    fiber.position.set(x, y, z);
    fiber.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    fiber.name = 'wall';
    fiber.userData.org = 'wall';
    struts.add(fiber);
  }
  group.add(struts);

  organelles.wall = group;
  scene.add(group);
  return group;
}

function createMembrane() {
  const group = new THREE.Group();
  group.name = 'Membrana Plasmática';
  group.userData.org = 'membrane';

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(CELL_W * 0.95, CELL_H * 0.95, CELL_D * 0.95),
    matMembrane
  );
  box.name = 'membrane';
  box.userData.org = 'membrane';
  group.add(box);

  const edgeMat = matMembrane.clone();
  edgeMat.opacity = 0.15;
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(CELL_W * 0.94, CELL_H * 0.94, CELL_D * 0.94)),
    new THREE.LineBasicMaterial({ color: '#66dd66', transparent: true, opacity: 0.08 })
  );
  edges.name = 'membrane';
  edges.userData.org = 'membrane';
  group.add(edges);

  organelles.membrane = group;
  scene.add(group);
  return group;
}

function createChloroplasts() {
  const group = new THREE.Group();
  group.name = 'Cloroplastos';
  group.userData.org = 'chloroplast';

  const positions = [
    [-2.0, 1.5, 1.8], [2.2, 0.8, -1.5], [-1.5, -0.5, 2.0],
    [1.8, -1.2, -2.0], [-2.5, -0.8, -1.0], [2.5, 0.5, 1.5],
    [0.0, 1.8, -2.2], [-0.5, -2.0, 1.5],
  ];

  for (const pos of positions) {
    const cGroup = new THREE.Group();
    cGroup.position.set(pos[0], pos[1], pos[2]);

    const scaleX = 0.6 + Math.random() * 0.3;
    const scaleY = 0.25 + Math.random() * 0.15;
    const scaleZ = 0.5 + Math.random() * 0.3;

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      matChloro
    );
    body.scale.set(scaleX, scaleY, scaleZ);
    body.name = 'chloroplast';
    body.userData.org = 'chloroplast';
    body.castShadow = true;
    cGroup.add(body);

    for (let i = 0; i < 4; i++) {
      const stack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.02, 8),
        matChloroStack
      );
      stack.position.set(
        (Math.random() - 0.5) * scaleX * 0.6,
        (Math.random() - 0.5) * scaleY * 0.4,
        (Math.random() - 0.5) * scaleZ * 0.6
      );
      stack.name = 'chloroplast';
      stack.userData.org = 'chloroplast';
      cGroup.add(stack);
    }

    cGroup.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
    group.add(cGroup);
  }

  organelles.chloroplast = group;
  scene.add(group);
  return group;
}

function createVacuole() {
  const group = new THREE.Group();
  group.name = 'Vacúolo';
  group.userData.org = 'vacuole';
  group.position.set(0.5, 0, -0.3);

  const vac = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 32, 32),
    matVacuole
  );
  vac.scale.set(0.9, 1.1, 0.85);
  vac.name = 'vacuole';
  vac.userData.org = 'vacuole';
  vac.castShadow = true;
  group.add(vac);

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(2.9, 24, 24),
    makeMat('#99ee99', { transparent: true, opacity: 0.06, roughness: 0.1 })
  );
  inner.scale.set(0.9, 1.1, 0.85);
  inner.name = 'vacuole';
  inner.userData.org = 'vacuole';
  group.add(inner);

  organelles.vacuole = group;
  scene.add(group);
  return group;
}

function createNucleus() {
  const group = new THREE.Group();
  group.name = 'Núcleo';
  group.userData.org = 'nucleus';
  group.position.set(-1.8, 1.5, 1.2);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(1.2, 28, 28), matNucleus);
  nuc.name = 'nucleus';
  nuc.userData.org = 'nucleus';
  nuc.castShadow = true;
  group.add(nuc);

  const env = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 24), matNucEnv);
  env.name = 'nucleus';
  env.userData.org = 'nucleus';
  group.add(env);

  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), matNucleolus);
  nucleolus.position.set(0.2, 0.15, -0.1);
  nucleolus.name = 'nucleus';
  nucleolus.userData.org = 'nucleus';
  group.add(nucleolus);

  for (let i = 0; i < 20; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.35;
    const pore = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.06, 8),
      makeMat('#66dd66', { transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    pore.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    pore.lookAt(0, 0, 0);
    pore.name = 'nucleus';
    pore.userData.org = 'nucleus';
    group.add(pore);
  }

  organelles.nucleus = group;
  scene.add(group);
  return group;
}

function createMitochondria() {
  const group = new THREE.Group();
  group.name = 'Mitocôndrias';
  group.userData.org = 'mitochondria';

  const positions = [
    [1.8, -1.5, 1.2], [-1.2, -1.8, -1.5], [2.0, 0.5, -1.8],
    [-2.0, -0.5, 1.8], [0.5, -2.5, 0.5], [-1.5, 0.8, -2.0],
  ];

  for (const pos of positions) {
    const mGroup = new THREE.Group();
    mGroup.position.set(pos[0], pos[1], pos[2]);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), matMito);
    body.scale.set(1.0, 0.5, 0.6);
    body.name = 'mitochondria';
    body.userData.org = 'mitochondria';
    body.castShadow = true;
    mGroup.add(body);

    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), matMitoInner);
    inner.scale.set(0.8, 0.4, 0.5);
    inner.name = 'mitochondria';
    inner.userData.org = 'mitochondria';
    mGroup.add(inner);

    for (let i = 0; i < 3; i++) {
      const crista = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.02, 0.02),
        makeMat('#88dd66', { roughness: 0.5 })
      );
      crista.position.set(0, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15);
      crista.name = 'mitochondria';
      crista.userData.org = 'mitochondria';
      mGroup.add(crista);
    }

    mGroup.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
    group.add(mGroup);
  }

  organelles.mitochondria = group;
  scene.add(group);
  return group;
}

function createReticulum() {
  const group = new THREE.Group();
  group.name = 'Retículo Endoplasmático';
  group.userData.org = 'reticulum';

  for (let i = 0; i < 6; i++) {
    const x = (Math.random() - 0.5) * 4;
    const y = (Math.random() - 0.5) * 5 + 0.5;
    const z = (Math.random() - 0.5) * 4;

    const pts = [];
    const segments = 6 + Math.floor(Math.random() * 4);
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      pts.push(new THREE.Vector3(
        x + Math.sin(t * Math.PI * 3) * 0.5 + (Math.random() - 0.5) * 0.3,
        y + Math.cos(t * Math.PI * 2) * 0.6 + (Math.random() - 0.5) * 0.3,
        z + Math.sin(t * Math.PI * 2.5) * 0.5 + (Math.random() - 0.5) * 0.3
      ));
    }

    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 10, 0.07 + Math.random() * 0.04, 6, false),
      i % 2 === 0 ? matRER : matSmoothER
    );
    tube.name = 'reticulum';
    tube.userData.org = 'reticulum';
    group.add(tube);
  }

  organelles.reticulum = group;
  scene.add(group);
  return group;
}

function createGolgi() {
  const group = new THREE.Group();
  group.name = 'Complexo de Golgi';
  group.userData.org = 'golgi';
  group.position.set(1.5, 1.8, -1.5);

  const stacks = 5;
  for (let i = 0; i < stacks; i++) {
    const yOff = (i - (stacks - 1) / 2) * 0.18;
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5 - i * 0.05, 0.5 - i * 0.05, 0.06, 16),
      matGolgi
    );
    disc.position.y = yOff;
    disc.name = 'golgi';
    disc.userData.org = 'golgi';
    group.add(disc);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.5 - i * 0.05, 0.02, 8, 16),
      matGolgiEdge
    );
    rim.position.y = yOff;
    rim.rotation.x = Math.PI / 2;
    rim.name = 'golgi';
    rim.userData.org = 'golgi';
    group.add(rim);
  }

  for (let i = 0; i < 6; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 0.3 + Math.random() * 0.3;
    const vesicle = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 6, 6),
      matVesicle
    );
    vesicle.position.set(
      Math.cos(theta) * r,
      (Math.random() - 0.5) * 0.6,
      Math.sin(theta) * r
    );
    vesicle.name = 'golgi';
    vesicle.userData.org = 'golgi';
    group.add(vesicle);
  }

  group.rotation.x = 0.1;
  group.rotation.z = 0.15;

  organelles.golgi = group;
  scene.add(group);
  return group;
}

function createRibosomes() {
  const group = new THREE.Group();
  group.name = 'Ribossomos';
  group.userData.org = 'ribosomes';

  for (let i = 0; i < 80; i++) {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 6.5;
    const z = (Math.random() - 0.5) * 5;

    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5 && Math.abs(z) < 0.5) continue;
    if (x * x / (CELL_W * 0.85) + y * y / (CELL_H * 0.85) + z * z / (CELL_D * 0.85) > 1) continue;

    const rib = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 4, 4),
      matRibosome
    );
    rib.position.set(x, y, z);
    rib.name = 'ribosomes';
    rib.userData.org = 'ribosomes';
    rib.userData.phase = Math.random() * Math.PI * 2;
    group.add(rib);
    ribosomeMeshes.push(rib);
  }

  organelles.ribosomes = group;
  scene.add(group);
  return group;
}

function createVesicles() {
  const group = new THREE.Group();
  group.name = 'Vesículas';
  group.userData.org = 'vesicles';

  const positions = [
    [-0.5, -1.2, 1.8], [1.2, -1.0, -1.0], [-1.5, 0.5, -1.5],
    [0.8, -0.5, 1.5], [-0.8, 1.2, -1.0], [1.5, 0.0, 0.0],
    [-1.0, -0.8, 0.5], [0.0, 0.8, -0.8],
  ];

  for (const pos of positions) {
    const v = new THREE.Mesh(
      new THREE.SphereGeometry(0.1 + Math.random() * 0.08, 8, 8),
      matVesicle
    );
    v.position.set(pos[0], pos[1], pos[2]);
    v.name = 'vesicles';
    v.userData.org = 'vesicles';
    v.userData.phase = Math.random() * Math.PI * 2;
    group.add(v);
    vesicleMeshes.push(v);
  }

  organelles.vesicles = group;
  scene.add(group);
  return group;
}

// ============================================================
// SEÇÃO 6: CONSTRUIR CENA
// ============================================================
createWall();
createMembrane();
createChloroplasts();
createVacuole();
createNucleus();
createMitochondria();
createReticulum();
createGolgi();
createRibosomes();
createVesicles();

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

function updateAnimations(elapsed, delta) {
  const spd = delta * speedMultiplier;
  const t = elapsed * speedMultiplier;

  for (const rib of ribosomeMeshes) {
    const phase = rib.userData.phase;
    rib.position.x += Math.sin(t * 2 + phase) * spd * 0.003;
    rib.position.y += Math.cos(t * 2.3 + phase * 1.2) * spd * 0.003;
    rib.position.z += Math.sin(t * 1.8 + phase * 0.8) * spd * 0.003;
  }

  for (const v of vesicleMeshes) {
    const phase = v.userData.phase;
    v.position.x += Math.sin(t * 1.5 + phase) * spd * 0.004;
    v.position.y += Math.cos(t * 1.7 + phase * 1.1) * spd * 0.004;
    v.position.z += Math.sin(t * 1.3 + phase * 0.9) * spd * 0.004;
  }

  const chloro = organelles.chloroplast;
  if (chloro) {
    chloro.children.forEach((child, idx) => {
      if (child.isMesh) {
        const glow = 0.8 + 0.2 * Math.sin(t * 0.5 + idx);
        child.material.emissiveIntensity = 0.05 + glow * 0.1;
      }
    });
  }

  const golgi = organelles.golgi;
  if (golgi) {
    golgi.rotation.y += spd * 0.05;
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

console.log('🌿 Célula Vegetal carregada com sucesso!');
