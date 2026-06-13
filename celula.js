// ============================================================
// CONFIGURAÇÃO
// ============================================================
const CELL_RADIUS = 10;
const EXPLODE_FACTOR = 1.8;
const ANIMATION_SPEED = 0.15;

const ORGANELLE_CONFIG = [
  { id: 'membrane',       name: 'Membrana Plasmática',     color: '#4a8fe0', cat: 'Envoltório' },
  { id: 'cytoplasm',      name: 'Citoplasma',              color: '#8ab8d4', cat: 'Citoplasma' },
  { id: 'nucleus',        name: 'Núcleo',                  color: '#6c3fa0', cat: 'Núcleo' },
  { id: 'nuclearEnvelope',name: 'Envelope Nuclear',        color: '#8a5cc0', cat: 'Núcleo' },
  { id: 'nucleolus',      name: 'Nucléolo',                color: '#c0392b', cat: 'Núcleo' },
  { id: 'chromatin',      name: 'Cromatina',               color: '#d35400', cat: 'Núcleo' },
  { id: 'roughER',        name: 'Retículo Rugoso',         color: '#5b8c5a', cat: 'Endomembranar' },
  { id: 'smoothER',       name: 'Retículo Liso',           color: '#7dce82', cat: 'Endomembranar' },
  { id: 'golgi',          name: 'Complexo de Golgi',       color: '#d4a017', cat: 'Endomembranar' },
  { id: 'mitochondria',   name: 'Mitocôndrias',            color: '#e67e22', cat: 'Energia' },
  { id: 'ribosomes',      name: 'Ribossomos',              color: '#5d6d7e', cat: 'Síntese' },
  { id: 'lysosomes',      name: 'Lisossomos',              color: '#c0392b', cat: 'Digestão' },
  { id: 'peroxisomes',    name: 'Peroxissomos',            color: '#8e44ad', cat: 'Digestão' },
  { id: 'vesicles',       name: 'Vesículas',               color: '#1abc9c', cat: 'Transporte' },
  { id: 'centrioles',     name: 'Centríolos',              color: '#2980b9', cat: 'Citoesqueleto' },
  { id: 'microtubules',   name: 'Microtúbulos',            color: '#7f8c8d', cat: 'Citoesqueleto' },
  { id: 'microfilaments', name: 'Microfilamentos',         color: '#95a5a6', cat: 'Citoesqueleto' },
  { id: 'interFilaments', name: 'Filamentos Interm.',      color: '#bdc3c7', cat: 'Citoesqueleto' },
  { id: 'vacuoles',       name: 'Pequenos Vacúolos',       color: '#48c9b0', cat: 'Armazenamento' },
  { id: 'inclusions',     name: 'Inclusões Citoplasmáticas',color: '#f5b041', cat: 'Armazenamento' },
];

// ============================================================
// INFORMAÇÕES BIOLÓGICAS
// ============================================================
const ORGANELLE_INFO = {
  membrane: {
    description: 'Bicamada lipídica com proteínas integradas e periféricas que delimita a célula.',
    function: 'Proteção, permeabilidade seletiva, transporte de substâncias e comunicação celular.',
  },
  cytoplasm: {
    description: 'Matriz gelatinosa composta por citosol, organelas e inclusões citoplasmáticas.',
    function: 'Suporte estrutural, meio para reações metabólicas e transporte intracelular.',
  },
  nucleus: {
    description: 'Orgânulo delimitado pelo envelope nuclear contendo o material genético (DNA).',
    function: 'Armazenamento e expressão do material genético; controle das atividades celulares.',
  },
  nuclearEnvelope: {
    description: 'Dupla membrana com poros nucleares que envolve o núcleo.',
    function: 'Separação do conteúdo nuclear do citoplasma; regulação do transporte núcleo-citoplasma.',
  },
  nucleolus: {
    description: 'Região densa no interior do núcleo rica em RNA e proteínas.',
    function: 'Produção e montagem das subunidades ribossomais (RNA ribossomal).',
  },
  chromatin: {
    description: 'DNA associado a proteínas histonas em diferentes níveis de condensação.',
    function: 'Empacotamento do DNA; regulação da expressão gênica e replicação.',
  },
  roughER: {
    description: 'Retículo endoplasmático com ribossomos aderidos à sua superfície.',
    function: 'Síntese e modificação de proteínas destinadas à secreção ou à membrana.',
  },
  smoothER: {
    description: 'Retículo endoplasmático sem ribossomos, com aspecto tubular.',
    function: 'Síntese de lipídios, desintoxicação celular e armazenamento de cálcio.',
  },
  golgi: {
    description: 'Conjunto de cisternas achatadas e empilhadas, próximo ao núcleo.',
    function: 'Modificação, empacotamento e distribuição de proteínas e lipídios.',
  },
  mitochondria: {
    description: 'Orgânulos com dupla membrana e dobras internas (cristas mitocondriais).',
    function: 'Produção de ATP através da respiração celular (fosforilação oxidativa).',
  },
  ribosomes: {
    description: 'Complexos de RNA ribossomal e proteínas, livres ou aderidos ao RER.',
    function: 'Síntese de proteínas (tradução do mRNA em cadeias polipeptídicas).',
  },
  lysosomes: {
    description: 'Vesículas contendo enzimas digestivas em ambiente ácido.',
    function: 'Digestão intracelular de macromoléculas, organelas danificadas e patógenos.',
  },
  peroxisomes: {
    description: 'Vesículas com enzimas oxidativas que produzem e degradam peróxido de hidrogênio.',
    function: 'Oxidação de ácidos graxos e desintoxicação de substâncias nocivas.',
  },
  vesicles: {
    description: 'Pequenas bolsas membranosas de transporte no citoplasma.',
    function: 'Transporte de moléculas entre organelas e para a membrana plasmática.',
  },
  centrioles: {
    description: 'Estruturas cilíndricas formadas por microtúbulos, dispostas perpendicularmente.',
    function: 'Organização dos microtúbulos do citoesqueleto e formação dos fusos mitóticos.',
  },
  microtubules: {
    description: 'Filamentos proteicos mais grossos do citoesqueleto (tubulina).',
    function: 'Suporte estrutural, transporte intracelular e movimentação de organelas.',
  },
  microfilaments: {
    description: 'Filamentos finos de actina que formam redes no citoplasma.',
    function: 'Contração muscular, motilidade celular e manutenção da forma da célula.',
  },
  interFilaments: {
    description: 'Filamentos de diâmetro intermédio que reforçam o citoesqueleto.',
    function: 'Resistência mecânica e ancoragem de organelas no citoplasma.',
  },
  vacuoles: {
    description: 'Pequenas vesículas de armazenamento no citoplasma.',
    function: 'Armazenamento de água, nutrientes e resíduos; manutenção da pressão osmótica.',
  },
  inclusions: {
    description: 'Depósitos temporários de substâncias como glicogênio, lipídios e pigmentos.',
    function: 'Reserva de nutrientes e acúmulo de produtos metabólicos.',
  },
};

// ============================================================
// SEÇÃO 1: CENA, CÂMERA E RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(25, 18, 25);

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
controls.minDistance = 6;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(25, 18, 25);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function resetCamera() {
  camera.position.copy(DEFAULT_CAMERA_POS);
  controls.target.copy(DEFAULT_TARGET);
  controls.update();
}

// ============================================================
// SEÇÃO 3: ILUMINAÇÃO
// ============================================================
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x6060ff, 0x404040, 0.8);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xffeedd, 2.5);
mainLight.position.set(20, 30, 15);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.camera.near = 1;
mainLight.shadow.camera.far = 60;
mainLight.shadow.camera.left = -20;
mainLight.shadow.camera.right = 20;
mainLight.shadow.camera.top = 20;
mainLight.shadow.camera.bottom = -20;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.6);
fillLight.position.set(-15, 5, -20);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight.position.set(-10, -20, -15);
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
    side: opts.side ?? THREE.FrontSide,
    envMapIntensity: opts.envMapIntensity ?? 0.4,
    ...opts.extra,
  });
}

const matMembrane  = makeMat('#4a8fe0', { transparent: true, opacity: 0.12, roughness: 0.1, clearcoat: 0.3, side: THREE.DoubleSide });
const matCytoplasm = makeMat('#8ab8d4', { transparent: true, opacity: 0.25, roughness: 0.6 });
const matNucleus   = makeMat('#6c3fa0', { roughness: 0.35, clearcoat: 0.2 });
const matNucEnv    = makeMat('#8a5cc0', { transparent: true, opacity: 0.25, roughness: 0.2, side: THREE.DoubleSide });
const matNucleolus = makeMat('#c0392b', { roughness: 0.3, clearcoat: 0.5, extra: { emissive: '#8b0000', emissiveIntensity: 0.15 } });
const matChromatin = makeMat('#d35400', { roughness: 0.7 });
const matRER       = makeMat('#5b8c5a', { roughness: 0.6 });
const matSmoothER  = makeMat('#7dce82', { roughness: 0.5 });
const matGolgi     = makeMat('#d4a017', { roughness: 0.4, clearcoat: 0.2 });
const matMito      = makeMat('#e67e22', { roughness: 0.5, clearcoat: 0.1 });
const matMitoInner = makeMat('#d35400', { roughness: 0.7 });
const matRibosome  = makeMat('#5d6d7e', { roughness: 0.8 });
const matLysosome  = makeMat('#c0392b', { roughness: 0.3, clearcoat: 0.3 });
const matPerox     = makeMat('#8e44ad', { roughness: 0.4, clearcoat: 0.2 });
const matVesicle   = makeMat('#1abc9c', { transparent: true, opacity: 0.7, roughness: 0.2, clearcoat: 0.2 });
const matCentriole = makeMat('#2980b9', { roughness: 0.3, clearcoat: 0.3 });
const matMicrotub  = makeMat('#7f8c8d', { roughness: 0.5 });
const matMicrofil  = makeMat('#95a5a6', { roughness: 0.5 });
const matInterFil  = makeMat('#bdc3c7', { roughness: 0.5 });
const matVacuole   = makeMat('#48c9b0', { transparent: true, opacity: 0.5, roughness: 0.3 });
const matIncl      = makeMat('#f5b041', { roughness: 0.6 });
const matMembraneBorder = makeMat('#4a8fe0', { transparent: true, opacity: 0.3, roughness: 0.2, side: THREE.DoubleSide });

// ============================================================
// SEÇÃO 5: CRIAÇÃO DAS ORGANELAS
// ============================================================

// --- 5.1 Membrana Plasmática ---
function createMembrane() {
  const group = new THREE.Group();
  group.name = 'Membrana Plasmática';

  const outer = new THREE.Mesh(new THREE.SphereGeometry(CELL_RADIUS * 1.02, 48, 48), matMembrane);
  outer.name = 'membrane';
  outer.userData.organelleId = 'membrane';

  const inner = new THREE.Mesh(new THREE.SphereGeometry(CELL_RADIUS * 0.99, 48, 48), matMembrane.clone());
  inner.material.color.set('#3a7fcf');
  inner.material.opacity = 0.06;
  inner.name = 'membrane';
  inner.userData.organelleId = 'membrane';

  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(CELL_RADIUS * 1.015, 24, 16)),
    new THREE.LineBasicMaterial({ color: '#4a8fe0', transparent: true, opacity: 0.04 })
  );

  group.add(outer);
  group.add(inner);
  group.add(wireframe);
  return group;
}

// --- 5.2 Citoplasma ---
function createCytoplasm() {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(CELL_RADIUS * 0.95, 48, 48), matCytoplasm);
  mesh.name = 'cytoplasm';
  mesh.userData.organelleId = 'cytoplasm';
  const g = new THREE.Group();
  g.name = 'Citoplasma';
  g.add(mesh);
  return g;
}

// --- 5.3 Núcleo ---
function createNucleus() {
  const group = new THREE.Group();
  group.name = 'Núcleo';
  group.position.set(-1.2, 1.0, 0.5);

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(3.2, 40, 40), matNucleus);
  mesh.name = 'nucleus';
  mesh.userData.organelleId = 'nucleus';
  mesh.castShadow = true;
  group.add(mesh);

  return group;
}

// --- 5.4 Envelope Nuclear ---
function createNuclearEnvelope(nucleusGroup) {
  const group = new THREE.Group();
  group.name = 'Envelope Nuclear';
  group.position.copy(nucleusGroup.position);

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(3.5, 40, 40), matNucEnv);
  mesh.name = 'nuclearEnvelope';
  mesh.userData.organelleId = 'nuclearEnvelope';
  group.add(mesh);

  const pores = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.5;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.12, 12),
      new THREE.MeshBasicMaterial({ color: '#a080d0', transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    ring.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    ring.lookAt(0, 0, 0);
    pores.add(ring);
  }
  group.add(pores);
  return group;
}

// --- 5.5 Nucléolo ---
function createNucleolus(nucleusGroup) {
  const group = new THREE.Group();
  group.name = 'Nucléolo';
  group.position.copy(nucleusGroup.position);
  group.position.y += 0.4;

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), matNucleolus);
  mesh.name = 'nucleolus';
  mesh.userData.organelleId = 'nucleolus';
  mesh.castShadow = true;
  group.add(mesh);

  return group;
}

// --- 5.6 Cromatina ---
function createChromatin(nucleusGroup) {
  const group = new THREE.Group();
  group.name = 'Cromatina';
  group.position.copy(nucleusGroup.position);

  const strands = [];
  for (let s = 0; s < 12; s++) {
    const pts = [];
    const count = 4 + Math.floor(Math.random() * 4);
    const r = 1.2 + Math.random() * 1.5;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 16, 0.04 + Math.random() * 0.06, 6, false),
      matChromatin
    );
    tube.userData.organelleId = 'chromatin';
    strands.push(tube);
    group.add(tube);
  }

  const clusters = new THREE.Group();
  for (let c = 0; c < 8; c++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.0 + Math.random() * 1.8;
    const center = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    for (let p = 0; p < 5 + Math.floor(Math.random() * 8); p++) {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 6, 6), matChromatin);
      sphere.position.copy(center);
      sphere.position.x += (Math.random() - 0.5) * 0.4;
      sphere.position.y += (Math.random() - 0.5) * 0.4;
      sphere.position.z += (Math.random() - 0.5) * 0.4;
      sphere.userData.organelleId = 'chromatin';
      clusters.add(sphere);
    }
  }
  group.add(clusters);

  return group;
}

// --- 5.7 Retículo Endoplasmático Rugoso ---
function createRoughER(nucleusGroup) {
  const group = new THREE.Group();
  group.name = 'Retículo Rugoso';
  group.position.copy(nucleusGroup.position);
  group.position.x += 1.5;
  group.position.y += 0.5;
  group.position.z += 0.3;

  const numLayers = 5;
  for (let i = 0; i < numLayers; i++) {
    const w = 2.6 - i * 0.25;
    const h = 1.4 - i * 0.15;
    const geo = new THREE.PlaneGeometry(w, h, 10, 8);
    const pos = geo.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j);
      const y = pos.getY(j);
      const bend = 0.4 * Math.sin((x / w) * Math.PI * 0.8);
      pos.setZ(j, bend);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, matRER);
    mesh.position.set(0, i * 0.28 - 0.6, 0);
    mesh.rotation.z = 0.1;
    mesh.name = 'roughER';
    mesh.userData.organelleId = 'roughER';
    mesh.castShadow = true;
    group.add(mesh);

    const ribCount = 8 + Math.floor(Math.random() * 6);
    for (let r = 0; r < ribCount; r++) {
      const rx = (Math.random() - 0.5) * w * 0.8;
      const ry = (Math.random() - 0.5) * h * 0.8;
      const bendV = 0.4 * Math.sin((rx / w) * Math.PI * 0.8);
      const rib = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), matRibosome);
      rib.position.set(rx, mesh.position.y + ry, bendV + 0.04 * (Math.random() > 0.5 ? 1 : -1));
      rib.userData.organelleId = 'roughER';
      group.add(rib);
    }
  }

  return group;
}

// --- 5.8 Retículo Endoplasmático Liso ---
function createSmoothER(nucleusGroup) {
  const group = new THREE.Group();
  group.name = 'Retículo Liso';
  group.position.copy(nucleusGroup.position);
  group.position.x += 0.8;
  group.position.y += 1.8;
  group.position.z -= 0.5;

  for (let i = 0; i < 8; i++) {
    const pts = [];
    const segments = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const angle = t * Math.PI * 1.5 + i * 0.8;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * (0.4 + Math.random() * 0.6),
        Math.sin(angle * 0.7) * (0.3 + Math.random() * 0.4),
        Math.sin(angle) * (0.3 + Math.random() * 0.5)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 12, 0.06 + Math.random() * 0.04, 8, false),
      matSmoothER
    );
    tube.position.set(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 1.2
    );
    tube.userData.organelleId = 'smoothER';
    group.add(tube);
  }

  return group;
}

// --- 5.9 Complexo de Golgi ---
function createGolgi() {
  const group = new THREE.Group();
  group.name = 'Complexo de Golgi';
  group.position.set(4.0, 0.5, -2.0);

  const numCisternae = 6;
  for (let i = 0; i < numCisternae; i++) {
    const w = 2.0 - i * 0.15;
    const h = 0.8 - i * 0.06;
    const geo = new THREE.PlaneGeometry(w, h, 8, 6);
    const pos = geo.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j);
      const y = pos.getY(j);
      const bend = 0.25 * Math.sin((x / w) * Math.PI * 0.6);
      pos.setZ(j, bend);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, matGolgi);
    mesh.position.set(0, i * 0.15 - 0.4, i * 0.08);
    mesh.rotation.z = 0.2;
    mesh.scale.set(1, 1, 1 + i * 0.1);
    mesh.name = 'golgi';
    mesh.userData.organelleId = 'golgi';
    mesh.castShadow = true;
    group.add(mesh);
  }

  for (let i = 0; i < 8; i++) {
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(0.06 + Math.random() * 0.08, 8, 8), matVesicle);
    vesicle.position.set(
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 1.0 + 0.5,
      (Math.random() - 0.5) * 1.5 - 0.3
    );
    vesicle.userData.organelleId = 'golgi';
    group.add(vesicle);
  }

  return group;
}

// --- 5.10 Mitocôndrias ---
function createMitochondrionGeometry() {
  const geo = new THREE.SphereGeometry(0.5, 16, 12);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const waist = 1 - 0.35 * Math.sin(Math.abs(y) * Math.PI / 1.0);
    x *= 2.2 * waist;
    z *= 1.1 * waist;
    x += 0.2 * (1 - y * y);
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function createMitochondria() {
  const group = new THREE.Group();
  group.name = 'Mitocôndrias';

  const positions = [
    { x: 3.5, y: -1.0, z: 1.5, sx: 1, sy: 0.8, sz: 0.7, ry: 0.3, rx: 0.5 },
    { x: -2.0, y: -2.5, z: 3.0, sx: 0.9, sy: 0.7, sz: 0.8, ry: -0.8, rx: 0.2 },
    { x: 1.5, y: -1.8, z: -3.5, sx: 1.1, sy: 0.9, sz: 0.6, ry: 2.0, rx: 0.1 },
    { x: -3.0, y: 2.0, z: -2.0, sx: 0.8, sy: 0.8, sz: 0.9, ry: -2.2, rx: 0.4 },
    { x: 5.0, y: 1.5, z: 2.0, sx: 0.7, sy: 0.6, sz: 0.7, ry: 0.8, rx: 0.6 },
    { x: -4.5, y: -0.5, z: -1.0, sx: 1.0, sy: 0.7, sz: 0.8, ry: 1.5, rx: 0.3 },
    { x: 2.0, y: 2.8, z: 3.0, sx: 0.6, sy: 0.8, sz: 0.6, ry: -1.0, rx: 0.7 },
    { x: -1.0, y: -3.0, z: -2.5, sx: 0.9, sy: 0.7, sz: 0.7, ry: 0.5, rx: 0.2 },
  ];

  const mitoGeo = createMitochondrionGeometry();

  for (const p of positions) {
    const mGroup = new THREE.Group();
    const outer = new THREE.Mesh(mitoGeo.clone(), matMito);
    outer.castShadow = true;
    outer.userData.organelleId = 'mitochondria';
    mGroup.add(outer);

    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 8),
      matMitoInner
    );
    inner.position.x = 0.3;
    inner.scale.set(1.6, 0.6, 0.6);
    inner.userData.organelleId = 'mitochondria';
    mGroup.add(inner);

    mGroup.position.set(p.x, p.y, p.z);
    mGroup.scale.set(p.sx, p.sy, p.sz);
    mGroup.rotation.set(p.rx, p.ry, 0);

    mGroup.userData.phase = Math.random() * Math.PI * 2;
    mGroup.userData.basePos = new THREE.Vector3(p.x, p.y, p.z);

    group.add(mGroup);
  }

  return group;
}

// --- 5.11 Ribossomos (livres) ---
function createRibosomes() {
  const group = new THREE.Group();
  group.name = 'Ribossomos';

  const ribGeo = new THREE.SphereGeometry(0.07, 6, 6);
  for (let i = 0; i < 120; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * (CELL_RADIUS * 0.75);
    const mesh = new THREE.Mesh(ribGeo, matRibosome);
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    mesh.userData.organelleId = 'ribosomes';
    group.add(mesh);
  }

  return group;
}

// --- 5.12 Lisossomos ---
function createLysosomes() {
  const group = new THREE.Group();
  group.name = 'Lisossomos';

  const geo = new THREE.SphereGeometry(0.25, 12, 12);
  const posData = [
    { x: 1.2, y: -2.5, z: 4.0 },
    { x: -3.8, y: 1.0, z: 2.5 },
    { x: 4.5, y: -0.5, z: -1.5 },
    { x: -1.5, y: 3.5, z: -2.0 },
    { x: 2.8, y: -1.5, z: -3.5 },
    { x: -4.0, y: -2.0, z: 1.0 },
  ];
  for (const p of posData) {
    const mesh = new THREE.Mesh(geo, matLysosome);
    mesh.position.set(p.x, p.y, p.z);
    mesh.userData.organelleId = 'lysosomes';
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}

// --- 5.13 Peroxissomos ---
function createPeroxisomes() {
  const group = new THREE.Group();
  group.name = 'Peroxissomos';

  const geo = new THREE.SphereGeometry(0.22, 10, 10);
  const posData = [
    { x: 3.0, y: 1.8, z: 3.5 },
    { x: -2.5, y: -1.8, z: 4.5 },
    { x: 5.0, y: -1.0, z: -2.0 },
    { x: -4.5, y: 0.5, z: -3.0 },
    { x: 1.0, y: 3.0, z: -3.5 },
  ];
  for (const p of posData) {
    const mesh = new THREE.Mesh(geo, matPerox);
    mesh.position.set(p.x, p.y, p.z);
    mesh.userData.organelleId = 'peroxisomes';
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}

// --- 5.14 Vesículas ---
function createVesicles() {
  const group = new THREE.Group();
  group.name = 'Vesículas';

  const vesicleData = [];
  for (let i = 0; i < 30; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * (CELL_RADIUS * 0.7);
    vesicleData.push({
      pos: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ),
      size: 0.05 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
    });
  }

  for (const d of vesicleData) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.size, 8, 8), matVesicle);
    mesh.position.copy(d.pos);
    mesh.userData.organelleId = 'vesicles';
    mesh.userData.phase = d.phase;
    mesh.userData.speed = d.speed;
    mesh.userData.axis = d.axis;
    mesh.userData.basePos = d.pos.clone();
    group.add(mesh);
  }

  group.userData.vesicleData = vesicleData;
  return group;
}

// --- 5.15 Centríolos ---
function createCentrioles() {
  const group = new THREE.Group();
  group.name = 'Centríolos';
  group.position.set(-0.5, -1.0, 4.0);

  const cylGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
  const cylMat = matCentriole;

  const c1 = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const r = 0.12;
    const triplet = new THREE.Group();
    for (let t = 0; t < 3; t++) {
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.set(0, 0, (t - 1) * 0.03);
      cyl.scale.set(1, 1, 0.7);
      triplet.add(cyl);
    }
    triplet.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    triplet.rotation.z = angle;
    c1.add(triplet);
  }
  c1.position.set(-0.3, 0, 0);

  const c2 = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const r = 0.12;
    const triplet = new THREE.Group();
    for (let t = 0; t < 3; t++) {
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.set(0, 0, (t - 1) * 0.03);
      cyl.scale.set(1, 1, 0.7);
      triplet.add(cyl);
    }
    triplet.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    triplet.rotation.z = angle;
    c2.add(triplet);
  }
  c2.rotation.x = Math.PI / 2;
  c2.position.set(0.3, 0, 0);

  group.add(c1);
  group.add(c2);

  group.userData.organelleId = 'centrioles';
  return group;
}

// --- 5.16 Microtúbulos ---
function createMicrotubules() {
  const group = new THREE.Group();
  group.name = 'Microtúbulos';

  for (let i = 0; i < 18; i++) {
    const pts = [];
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const startR = 1 + Math.random() * 2;
    const endR = 3 + Math.random() * 5;
    const start = new THREE.Vector3(
      startR * Math.sin(phi) * Math.cos(theta),
      startR * Math.cos(phi),
      startR * Math.sin(phi) * Math.sin(theta)
    );
    const end = new THREE.Vector3(
      endR * Math.sin(phi) * Math.cos(theta + (Math.random() - 0.5) * 0.3),
      endR * Math.cos(phi + (Math.random() - 0.5) * 0.3),
      endR * Math.sin(phi) * Math.sin(theta + (Math.random() - 0.5) * 0.3)
    );
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.x += (Math.random() - 0.5) * 2;
    mid.y += (Math.random() - 0.5) * 2;
    mid.z += (Math.random() - 0.5) * 2;
    pts.push(start, mid, end);

    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 12, 0.03, 6, false),
      matMicrotub
    );
    tube.userData.organelleId = 'microtubules';
    group.add(tube);
  }

  return group;
}

// --- 5.17 Microfilamentos ---
function createMicrofilaments() {
  const group = new THREE.Group();
  group.name = 'Microfilamentos';

  const pts = [];
  for (let i = 0; i < 60; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1 + Math.random() * (CELL_RADIUS * 0.7);
    pts.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    ));
  }

  for (let i = 0; i < pts.length; i += 2) {
    if (i + 1 < pts.length) {
      const dist = pts[i].distanceTo(pts[i + 1]);
      if (dist < 5) {
        const mid = new THREE.Vector3().addVectors(pts[i], pts[i + 1]).multiplyScalar(0.5);
        const curve = new THREE.CatmullRomCurve3([pts[i], mid, pts[i + 1]]);
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 6, 0.015, 4, false),
          matMicrofil
        );
        tube.userData.organelleId = 'microfilaments';
        group.add(tube);
      }
    }
  }

  return group;
}

// --- 5.18 Filamentos Intermediários ---
function createIntermediateFilaments() {
  const group = new THREE.Group();
  group.name = 'Filamentos Intermediários';

  for (let i = 0; i < 25; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r1 = 1 + Math.random() * 3;
    const r2 = 4 + Math.random() * 4;
    const p1 = new THREE.Vector3(
      r1 * Math.sin(phi) * Math.cos(theta),
      r1 * Math.cos(phi),
      r1 * Math.sin(phi) * Math.sin(theta)
    );
    const p2 = new THREE.Vector3(
      r2 * Math.sin(phi + (Math.random() - 0.5) * 0.2) * Math.cos(theta + (Math.random() - 0.5) * 0.2),
      r2 * Math.cos(phi + (Math.random() - 0.5) * 0.2),
      r2 * Math.sin(phi + (Math.random() - 0.5) * 0.2) * Math.sin(theta + (Math.random() - 0.5) * 0.2)
    );
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mid.x += (Math.random() - 0.5) * 1.5;
    mid.y += (Math.random() - 0.5) * 1.5;
    mid.z += (Math.random() - 0.5) * 1.5;

    const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 8, 0.025, 4, false),
      matInterFil
    );
    tube.userData.organelleId = 'interFilaments';
    group.add(tube);
  }

  return group;
}

// --- 5.19 Pequenos Vacúolos ---
function createVacuoles() {
  const group = new THREE.Group();
  group.name = 'Pequenos Vacúolos';

  for (let i = 0; i < 8; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * 5;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 + Math.random() * 0.25, 12, 12),
      matVacuole
    );
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    mesh.userData.organelleId = 'vacuoles';
    group.add(mesh);
  }

  return group;
}

// --- 5.20 Inclusões Citoplasmáticas ---
function createInclusions() {
  const group = new THREE.Group();
  group.name = 'Inclusões Citoplasmáticas';

  for (let i = 0; i < 15; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.5 + Math.random() * 6;
    const size = 0.06 + Math.random() * 0.12;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 8, 8),
      matIncl
    );
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    mesh.userData.organelleId = 'inclusions';
    group.add(mesh);
  }

  return group;
}

// ============================================================
// SEÇÃO 6: MONTAGEM DA CENA
// ============================================================
const organelles = {};
const hitTargets = [];
let currentHighlight = null;
let selectedInfo = null;
let isExploded = false;
let explodeProgress = 0;
let targetExplodeProgress = 0;

const mainGroup = new THREE.Group();
scene.add(mainGroup);

const starField = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: '#ffffff', size: 0.05, transparent: true, opacity: 0.6 })
);
const starPos = new Float32Array(3000);
for (let i = 0; i < 3000; i++) {
  starPos[i] = (Math.random() - 0.5) * 200;
}
starField.geometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(starField);

const groundGlow = new THREE.Mesh(
  new THREE.RingGeometry(8, 12, 64),
  new THREE.MeshBasicMaterial({ color: '#4a8fe0', transparent: true, opacity: 0.08, side: THREE.DoubleSide })
);
groundGlow.position.y = -CELL_RADIUS * 0.9;
groundGlow.rotation.x = -Math.PI / 2;
scene.add(groundGlow);

function buildScene() {
  const nucleusGroup = createNucleus();
  organelles.nucleus = nucleusGroup;
  mainGroup.add(nucleusGroup);

  const nuclearEnvelope = createNuclearEnvelope(nucleusGroup);
  organelles.nuclearEnvelope = nuclearEnvelope;
  mainGroup.add(nuclearEnvelope);

  const nucleolus = createNucleolus(nucleusGroup);
  organelles.nucleolus = nucleolus;
  mainGroup.add(nucleolus);

  const chromatin = createChromatin(nucleusGroup);
  organelles.chromatin = chromatin;
  mainGroup.add(chromatin);

  const roughER = createRoughER(nucleusGroup);
  organelles.roughER = roughER;
  mainGroup.add(roughER);

  const smoothER = createSmoothER(nucleusGroup);
  organelles.smoothER = smoothER;
  mainGroup.add(smoothER);

  const golgi = createGolgi();
  organelles.golgi = golgi;
  mainGroup.add(golgi);

  const mitochondria = createMitochondria();
  organelles.mitochondria = mitochondria;
  mainGroup.add(mitochondria);

  const ribosomes = createRibosomes();
  organelles.ribosomes = ribosomes;
  mainGroup.add(ribosomes);

  const lysosomes = createLysosomes();
  organelles.lysosomes = lysosomes;
  mainGroup.add(lysosomes);

  const peroxisomes = createPeroxisomes();
  organelles.peroxisomes = peroxisomes;
  mainGroup.add(peroxisomes);

  const vesicles = createVesicles();
  organelles.vesicles = vesicles;
  mainGroup.add(vesicles);

  const centrioles = createCentrioles();
  organelles.centrioles = centrioles;
  mainGroup.add(centrioles);

  const microtubules = createMicrotubules();
  organelles.microtubules = microtubules;
  mainGroup.add(microtubules);

  const microfilaments = createMicrofilaments();
  organelles.microfilaments = microfilaments;
  mainGroup.add(microfilaments);

  const interFilaments = createIntermediateFilaments();
  organelles.interFilaments = interFilaments;
  mainGroup.add(interFilaments);

  const vacuoles = createVacuoles();
  organelles.vacuoles = vacuoles;
  mainGroup.add(vacuoles);

  const inclusions = createInclusions();
  organelles.inclusions = inclusions;
  mainGroup.add(inclusions);

  const cytoplasm = createCytoplasm();
  organelles.cytoplasm = cytoplasm;
  mainGroup.add(cytoplasm);

  const membrane = createMembrane();
  organelles.membrane = membrane;
  mainGroup.add(membrane);

  collectHitTargets(mainGroup);
}

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.organelleId) {
    hitTargets.push(obj);
  }
  if (obj.children) {
    for (const child of obj.children) {
      collectHitTargets(child);
    }
  }
}

// Store original positions for explode feature
const originalPositions = new Map();

function storeOriginalPositions() {
  originalPositions.clear();
  for (const [id, group] of Object.entries(organelles)) {
    if (group && group.isObject3D) {
      originalPositions.set(id, group.position.clone());
    }
  }
}

buildScene();
storeOriginalPositions();

// ============================================================
// SEÇÃO 7: ANIMAÇÕES
// ============================================================
const clock = new THREE.Clock();
let cellRotationEnabled = true;

function updateAnimations(time, delta) {
  if (cellRotationEnabled) {
    mainGroup.rotation.y += delta * 0.03;
  }

  for (const child of organelles.mitochondria.children) {
    if (child.isGroup && child.userData.phase !== undefined) {
      const phase = child.userData.phase;
      const amp = 0.04;
      child.position.y += Math.sin(time * 0.5 + phase) * amp * delta * 2;
      child.position.x += Math.cos(time * 0.7 + phase) * amp * delta * 2;
      child.rotation.z += Math.sin(time * 0.3 + phase) * delta * 0.1;
    }
  }

  if (organelles.vesicles) {
    for (const child of organelles.vesicles.children) {
      if (child.isMesh && child.userData.basePos) {
        const phase = child.userData.phase ?? 0;
        const speed = child.userData.speed ?? 0.3;
        const axis = child.userData.axis ?? new THREE.Vector3(0, 1, 0);
        const t = time * speed + phase;
        child.position.x = child.userData.basePos.x + Math.sin(t) * 0.08;
        child.position.y = child.userData.basePos.y + Math.cos(t * 0.7) * 0.08;
        child.position.z = child.userData.basePos.z + Math.sin(t * 1.3 + phase) * 0.08;
      }
    }
  }

  if (Math.abs(explodeProgress - targetExplodeProgress) > 0.001) {
    explodeProgress += (targetExplodeProgress - explodeProgress) * 0.06;
    for (const [id, group] of Object.entries(organelles)) {
      const orig = originalPositions.get(id);
      if (orig && group) {
        const dir = orig.clone().normalize();
        const len = orig.length();
        const targetLen = len + (CELL_RADIUS * (EXPLODE_FACTOR - 1)) * explodeProgress;
        group.position.copy(dir.multiplyScalar(targetLen));
      }
    }
  }

  for (const child of organelles.centrioles.children) {
    if (child.isGroup) {
      child.rotation.y += delta * 0.2;
    }
  }

  if (organelles.ribosomes) {
    for (const child of organelles.ribosomes.children) {
      if (child.isMesh) {
        child.position.x += Math.sin(time * 2 + child.id) * delta * 0.002;
        child.position.y += Math.cos(time * 2.3 + child.id) * delta * 0.002;
      }
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

function getOrganelleIdFromHit(hit) {
  let obj = hit.object;
  while (obj) {
    if (obj.userData.organelleId) {
      return obj.userData.organelleId;
    }
    obj = obj.parent;
  }
  return null;
}

function highlightOrganelle(id) {
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

  const config = ORGANELLE_CONFIG.find(c => c.id === id);
  const info = ORGANELLE_INFO[id];
  if (!config || !info) return;

  const meshes = [];
  const group = organelles[id];
  if (group) {
    group.traverse(child => {
      if (child.isMesh) {
        meshes.push(child);
      }
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
    const id = getOrganelleIdFromHit(intersects[0]);
    if (id) {
      highlightOrganelle(id);
      return;
    }
  }

  highlightOrganelle(null);
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);

// ============================================================
// SEÇÃO 9: INTERFACE GRÁFICA
// ============================================================
function createUI() {
  const list = document.getElementById('structure-list');
  list.innerHTML = '';

  for (const config of ORGANELLE_CONFIG) {
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
      if (group) {
        group.visible = cb.checked;
      }
    });

    list.appendChild(item);
  }

  const btnGroup = document.getElementById('btn-group');

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

  const explodeBtn = document.createElement('button');
  explodeBtn.className = 'btn btn-warning';
  explodeBtn.textContent = 'Explodir';
  explodeBtn.addEventListener('click', () => {
    isExploded = !isExploded;
    targetExplodeProgress = isExploded ? 1 : 0;
    explodeBtn.textContent = isExploded ? 'Restaurar' : 'Explodir';
  });

  btnGroup.append(showAllBtn, hideAllBtn, resetCamBtn, explodeBtn);
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

console.log('🔬 Simulação 3D de Célula Animal carregada com sucesso!');
console.log('ℹ️ Clique em qualquer organela para ver informações detalhadas.');
