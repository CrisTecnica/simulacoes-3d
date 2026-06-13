// ============================================================
// CONFIGURAÇÃO DA SÍNTESE DE PROTEÍNAS
// ============================================================
const mRNA_LENGTH = 24;
const CODON_SPACING = 1.2;
const mRNA_TOTAL_LEN = mRNA_LENGTH * CODON_SPACING;
const RIBOSOME_Y = 1.2;
const SPEED_DEFAULT = 1;

const NUCLEOTIDES = ['A', 'U', 'G', 'C'];
const NUC_COLORS = { A: '#44ff44', U: '#ff6644', G: '#4488ff', C: '#ffcc00' };
const NUC_NAMES = { A: 'Adenina', U: 'Uracila', G: 'Guanina', C: 'Citosina' };

const CODON_TABLE = {
  AUG: { aa: 'Met', color: '#ff6b6b', name: 'Metionina' },
  UUU: { aa: 'Phe', color: '#ff9ff3', name: 'Fenilalanina' },
  UUC: { aa: 'Phe', color: '#ff9ff3', name: 'Fenilalanina' },
  UUA: { aa: 'Leu', color: '#feca57', name: 'Leucina' },
  UUG: { aa: 'Leu', color: '#feca57', name: 'Leucina' },
  CUU: { aa: 'Leu', color: '#feca57', name: 'Leucina' },
  UCU: { aa: 'Ser', color: '#48dbfb', name: 'Serina' },
  UCC: { aa: 'Ser', color: '#48dbfb', name: 'Serina' },
  UCA: { aa: 'Ser', color: '#48dbfb', name: 'Serina' },
  UAU: { aa: 'Tyr', color: '#a29bfe', name: 'Tirosina' },
  UAC: { aa: 'Tyr', color: '#a29bfe', name: 'Tirosina' },
  UGU: { aa: 'Cys', color: '#fd79a8', name: 'Cisteína' },
  UGG: { aa: 'Trp', color: '#e17055', name: 'Triptofano' },
  CCU: { aa: 'Pro', color: '#00b894', name: 'Prolina' },
  CCC: { aa: 'Pro', color: '#00b894', name: 'Prolina' },
  CCA: { aa: 'Pro', color: '#00b894', name: 'Prolina' },
  CAU: { aa: 'His', color: '#e84393', name: 'Histidina' },
  CAA: { aa: 'Gln', color: '#fd79a8', name: 'Glutamina' },
  CGU: { aa: 'Arg', color: '#6c5ce7', name: 'Arginina' },
  CGA: { aa: 'Arg', color: '#6c5ce7', name: 'Arginina' },
  AUU: { aa: 'Ile', color: '#00cec9', name: 'Isoleucina' },
  AUC: { aa: 'Ile', color: '#00cec9', name: 'Isoleucina' },
  AUA: { aa: 'Ile', color: '#00cec9', name: 'Isoleucina' },
  ACU: { aa: 'Thr', color: '#81ecec', name: 'Treonina' },
  ACC: { aa: 'Thr', color: '#81ecec', name: 'Treonina' },
  ACA: { aa: 'Thr', color: '#81ecec', name: 'Treonina' },
  AAU: { aa: 'Asn', color: '#74b9ff', name: 'Asparagina' },
  AAC: { aa: 'Asn', color: '#74b9ff', name: 'Asparagina' },
  AAA: { aa: 'Lys', color: '#0984e3', name: 'Lisina' },
  AAG: { aa: 'Lys', color: '#0984e3', name: 'Lisina' },
  GUU: { aa: 'Val', color: '#55efc4', name: 'Valina' },
  GUC: { aa: 'Val', color: '#55efc4', name: 'Valina' },
  GUG: { aa: 'Val', color: '#55efc4', name: 'Valina' },
  GCA: { aa: 'Ala', color: '#81ecec', name: 'Alanina' },
  GCC: { aa: 'Ala', color: '#81ecec', name: 'Alanina' },
  GCU: { aa: 'Ala', color: '#81ecec', name: 'Alanina' },
  GAU: { aa: 'Asp', color: '#fab1a0', name: 'Aspartato' },
  GAC: { aa: 'Asp', color: '#fab1a0', name: 'Aspartato' },
  GAA: { aa: 'Glu', color: '#e17055', name: 'Glutamato' },
  GAG: { aa: 'Glu', color: '#e17055', name: 'Glutamato' },
  GGU: { aa: 'Gly', color: '#dfe6e9', name: 'Glicina' },
  GGC: { aa: 'Gly', color: '#dfe6e9', name: 'Glicina' },
  GGA: { aa: 'Gly', color: '#dfe6e9', name: 'Glicina' },
  UGA: { aa: null, color: '#ff0000', name: 'STOP' },
  UAA: { aa: null, color: '#ff0000', name: 'STOP' },
  UAG: { aa: null, color: '#ff0000', name: 'STOP' },
};

function generateSequence() {
  const codons = ['AUG'];
  const aas = ['Met', 'Phe', 'Leu', 'Ser', 'Tyr', 'Cys', 'Pro', 'His', 'Gln', 'Arg', 'Ile', 'Thr', 'Asn', 'Lys', 'Val', 'Ala', 'Asp', 'Glu', 'Gly'];
  const codonKeys = Object.keys(CODON_TABLE).filter(k => CODON_TABLE[k].aa !== null);
  for (let i = 0; i < 7; i++) {
    codons.push(codonKeys[Math.floor(Math.random() * codonKeys.length)]);
  }
  codons.push('UAA');
  return codons;
}
const CODON_SEQUENCE = generateSequence();
const TOTAL_CODONS = CODON_SEQUENCE.length;

const STRUCTURE_CONFIG = [
  { id: 'mRNA', name: 'RNA Mensageiro (mRNA)', color: '#44aaff' },
  { id: 'ribosomeLarge', name: 'Subunidade Maior (60S)', color: '#9966ee' },
  { id: 'ribosomeSmall', name: 'Subunidade Menor (40S)', color: '#7744cc' },
  { id: 'tRNA', name: 'RNA Transportador (tRNA)', color: '#ff8844' },
  { id: 'polypeptide', name: 'Cadeia Polipeptídica', color: '#44ff88' },
  { id: 'aminoAcids', name: 'Aminoácidos Livres', color: '#ffcc00' },
];

const STRUCTURE_INFO = {
  mRNA: {
    description: 'Molécula de RNA mensageiro contendo a sequência de códons que codifica uma proteína. Cada trinca de nucleotídeos (códon) especifica um aminoácido.',
    function: 'Transportar a informação genética do DNA no núcleo para os ribossomos no citoplasma, onde ocorre a síntese proteica.',
  },
  ribosomeLarge: {
    description: 'Subunidade maior (60S em eucariotos) do ribossomo, composta por RNA ribossomal e proteínas. Contém os sítios A, P e E para ligação de tRNAs.',
    function: 'Catalisar a formação das ligações peptídicas entre os aminoácidos durante a tradução do mRNA.',
  },
  ribosomeSmall: {
    description: 'Subunidade menor (40S em eucariotos) do ribossomo, responsável por ligar-se ao mRNA e garantir a correta leitura dos códons.',
    function: 'Ligar-se ao mRNA e garantir o pareamento correto entre códon e anticódon durante a tradução.',
  },
  tRNA: {
    description: 'RNA transportador em forma de L, com um anticódon em uma extremidade e um aminoácido específico na outra. Cada tipo carrega um aminoácido específico.',
    function: 'Transportar aminoácidos até o ribossomo e reconhecer os códons do mRNA através do anticódon complementar.',
  },
  polypeptide: {
    description: 'Cadeia linear de aminoácidos unidos por ligações peptídicas, formando a estrutura primária de uma proteína. A sequência é determinada pela ordem dos códons no mRNA.',
    function: 'Constituir a estrutura primária das proteínas; a sequência de aminoácidos determina o dobramento e a função da proteína final.',
  },
  aminoAcids: {
    description: 'Moléculas orgânicas compostas por grupo amino (-NH₂), grupo carboxila (-COOH) e cadeia lateral variável (R). Existem 20 tipos diferentes codificados pelo código genético.',
    function: 'Unidades fundamentais (monômeros) que formam as proteínas por meio de ligações peptídicas durante a tradução.',
  },
};

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(12, 8, 18);

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
controls.maxDistance = 50;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAMERA_POS = new THREE.Vector3(12, 8, 18);
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

const ribLight = new THREE.PointLight(0x44aaff, 0.5, 8);
ribLight.position.set(0, 3, 0);
scene.add(ribLight);

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

const matBackbone = makeMat('#44aaff', { roughness: 0.3, metalness: 0.1, emissive: '#44aaff', emissiveIntensity: 0.05 });
const matRibLarge = makeMat('#9966ee', { roughness: 0.3, clearcoat: 0.3, emissive: '#7744cc', emissiveIntensity: 0.08 });
const matRibSmall = makeMat('#7744cc', { roughness: 0.3, clearcoat: 0.2, emissive: '#6633aa', emissiveIntensity: 0.05 });
const matTRNA = makeMat('#ff8844', { roughness: 0.4, emissive: '#ff6622', emissiveIntensity: 0.05 });
const matAminoAcid = makeMat('#ffcc00', { roughness: 0.3, clearcoat: 0.4, emissive: '#ffaa00', emissiveIntensity: 0.1 });
const matPeptideBond = new THREE.MeshPhysicalMaterial({ color: '#44ff88', transparent: true, opacity: 0.6, roughness: 0.3 });
const matCodonMarker = makeMat('#ffffff', { transparent: true, opacity: 0.12, roughness: 0.2 });

// ============================================================
// CRIAÇÃO DOS COMPONENTES
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

function getCodonPosition(index) {
  const x = (index - TOTAL_CODONS / 2) * CODON_SPACING;
  const y = RIBOSOME_Y + 0.15 * Math.sin(x * 0.3);
  const z = 0.15 * Math.cos(x * 0.25);
  return new THREE.Vector3(x, y, z);
}

// --- mRNA ---
function createMRNA() {
  const group = new THREE.Group();
  group.name = 'mRNA';

  const pts = [];
  for (let i = 0; i <= TOTAL_CODONS; i++) {
    const p = getCodonPosition(i);
    pts.push(new THREE.Vector3(p.x, p.y - 0.1, p.z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, TOTAL_CODONS * 4, 0.12, 8, false),
    matBackbone
  );
  tube.userData.organelleId = 'mRNA';
  tube.castShadow = true;
  group.add(tube);

  for (let i = 0; i < TOTAL_CODONS; i++) {
    const pos = getCodonPosition(i);
    for (let n = 0; n < 3; n++) {
      const offset = (n - 1) * 0.15;
      const nucLetter = CODON_SEQUENCE[i][n];
      const nucMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(NUC_COLORS[nucLetter]),
        emissive: new THREE.Color(NUC_COLORS[nucLetter]),
        emissiveIntensity: 0.15,
        roughness: 0.3,
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), nucMat);
      sphere.position.set(pos.x + offset, pos.y + 0.2 + 0.06 * Math.sin(i + n), pos.z + 0.05 * Math.cos(i * 0.5 + n));
      sphere.userData.organelleId = 'mRNA';
      sphere.userData.nucleotide = nucLetter;
      sphere.userData.codonIndex = i;
      group.add(sphere);
    }

    if (i < TOTAL_CODONS - 1) {
      const midP = getCodonPosition(i + 0.5);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.02, 6, 12),
        matCodonMarker
      );
      ring.position.copy(midP);
      ring.position.y += 0.05;
      ring.userData.organelleId = 'mRNA';
      group.add(ring);
    }
  }

  return group;
}

// --- Ribosome ---
function createRibosome() {
  const group = new THREE.Group();
  group.name = 'Ribossomo';
  group.position.set(0, RIBOSOME_Y, 0);

  const lgGeo = new THREE.SphereGeometry(1.1, 24, 24);
  const pos = lgGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0) {
      pos.setY(i, y * 0.1);
    }
  }
  lgGeo.computeVertexNormals();

  const largeSub = new THREE.Mesh(lgGeo, matRibLarge);
  largeSub.position.y = 0.3;
  largeSub.scale.set(1.0, 0.85, 0.9);
  largeSub.name = 'ribosomeLarge';
  largeSub.userData.organelleId = 'ribosomeLarge';
  largeSub.castShadow = true;
  group.add(largeSub);

  const smGeo = new THREE.SphereGeometry(0.85, 20, 20);
  const smPos = smGeo.attributes.position;
  for (let i = 0; i < smPos.count; i++) {
    const y = smPos.getY(i);
    if (y > 0) {
      smPos.setY(i, y * 0.15);
    }
  }
  smGeo.computeVertexNormals();

  const smallSub = new THREE.Mesh(smGeo, matRibSmall);
  smallSub.position.y = -0.5;
  smallSub.scale.set(0.9, 0.8, 0.85);
  smallSub.name = 'ribosomeSmall';
  smallSub.userData.organelleId = 'ribosomeSmall';
  smallSub.castShadow = true;
  group.add(smallSub);

  const tunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.8, 8),
    new THREE.MeshPhysicalMaterial({ color: '#5533aa', transparent: true, opacity: 0.2, roughness: 0.5 })
  );
  tunnel.position.y = -0.1;
  tunnel.rotation.x = 0.1;
  tunnel.userData.organelleId = 'ribosomeLarge';
  group.add(tunnel);

  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.35, 16),
    new THREE.MeshBasicMaterial({ color: '#44aaff', transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  glowRing.position.y = -0.5;
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.userData.organelleId = 'ribosomeSmall';
  group.add(glowRing);

  return group;
}

// --- tRNA ---
function createTRNA(color, anticodon) {
  const group = new THREE.Group();
  group.name = 'tRNA';

  const armMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.4,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.05,
  });

  const stem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.5, 6), armMat);
  stem1.position.set(0, 0.25, 0);
  stem1.rotation.z = 0.2;
  stem1.userData.organelleId = 'tRNA';
  group.add(stem1);

  const stem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.4, 6), armMat);
  stem2.position.set(0, -0.2, 0.15);
  stem2.rotation.x = -0.8;
  stem2.rotation.z = 0.1;
  stem2.userData.organelleId = 'tRNA';
  group.add(stem2);

  const loop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), armMat);
  loop.position.set(0, -0.42, 0.12);
  loop.userData.organelleId = 'tRNA';
  group.add(loop);

  const acceptor = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.15, 6), armMat);
  acceptor.position.set(0.02, 0.45, -0.03);
  acceptor.rotation.z = 0.3;
  acceptor.rotation.x = 0.2;
  acceptor.userData.organelleId = 'tRNA';
  group.add(acceptor);

  if (anticodon) {
    for (let n = 0; n < 3; n++) {
      const acSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 6, 6),
        new THREE.MeshPhysicalMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.2, roughness: 0.3 })
      );
      acSphere.position.set((n - 1) * 0.06, -0.38, 0.2);
      acSphere.userData.organelleId = 'tRNA';
      group.add(acSphere);
    }
  }

  return group;
}

// --- Amino Acid ---
function createAminoAcid(color, label) {
  const group = new THREE.Group();

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    clearcoat: 0.4,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.15,
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), mat);
  body.userData.organelleId = 'aminoAcids';
  body.userData.aaColor = color;
  body.userData.aaLabel = label;
  group.add(body);

  const sideChain = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), mat);
  sideChain.position.set(0.12, 0.05, 0.05);
  sideChain.userData.organelleId = 'aminoAcids';
  group.add(sideChain);

  return group;
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

const mRNAGroup = createMRNA();
structures.mRNA = mRNAGroup;
mainGroup.add(mRNAGroup);

const ribosomeGroup = createRibosome();
structures.ribosomeLarge = ribosomeGroup;
structures.ribosomeSmall = ribosomeGroup;
mainGroup.add(ribosomeGroup);

const tRNAGroups = [];
const freeAAGroup = new THREE.Group();
freeAAGroup.name = 'Aminoácidos Livres';
structures.aminoAcids = freeAAGroup;
mainGroup.add(freeAAGroup);

for (let i = 0; i < 20; i++) {
  const codonKey = Object.keys(CODON_TABLE).filter(k => CODON_TABLE[k].aa !== null)[Math.floor(Math.random() * 10)];
  const info = CODON_TABLE[codonKey];
  const aa = createAminoAcid(info.color, info.aa);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 2 + Math.random() * 3;
  aa.position.set(
    -5 + r * Math.sin(phi) * Math.cos(theta),
    1 + r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
  freeAAGroup.add(aa);
}

const polypeptideGroup = new THREE.Group();
polypeptideGroup.name = 'Cadeia Polipeptídica';
structures.polypeptide = polypeptideGroup;
mainGroup.add(polypeptideGroup);

function collectHitTargets(obj) {
  if (obj.isMesh && obj.userData.organelleId) hitTargets.push(obj);
  if (obj.children) for (const c of obj.children) collectHitTargets(c);
}
collectHitTargets(mainGroup);

// ============================================================
// SISTEMA DE TRADUÇÃO
// ============================================================
const translation = {
  currentCodon: 0,
  phase: 'IDLE',
  phaseTime: 0,
  cycleDuration: 4.0,
  speed: SPEED_DEFAULT,
  tRNAs: [],
  chainAminoAcids: [],
  activeTRNA: null,
  activeAA: null,
  chainMeshes: [],
  finished: false,
  paused: false,
};

function getCodonInfo(index) {
  if (index < 0 || index >= CODON_SEQUENCE.length) return null;
  const codon = CODON_SEQUENCE[index];
  return CODON_TABLE[codon] || null;
}

function createTRNAForCodon(codonIndex) {
  const codon = CODON_SEQUENCE[codonIndex];
  const info = CODON_TABLE[codon];
  if (!info || !info.aa) return null;

  const color = info.color;
  const trna = createTRNA(color, codon);

  const aaMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    clearcoat: 0.4,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.2,
  });
  const aaSphere = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), aaMat);
  aaSphere.position.set(0.02, 0.55, -0.03);
  aaSphere.userData.organelleId = 'tRNA';
  aaSphere.userData.aaColor = color;
  aaSphere.userData.aaLabel = info.aa;
  trna.add(aaSphere);

  trna.userData.codonIndex = codonIndex;
  trna.userData.aaColor = color;
  trna.userData.aaLabel = info.aa;
  trna.userData.anticodon = codon;

  const startPos = new THREE.Vector3(6 + Math.random() * 2, 2 + Math.random() * 3, (Math.random() - 0.5) * 2);
  trna.position.copy(startPos);

  return trna;
}

let currentTRNA = null;
let currentAASphere = null;
let ribosomeTargetX = 0;

function startTranslationCycle() {
  if (translation.finished) return;
  if (translation.currentCodon >= CODON_SEQUENCE.length) {
    translation.finished = true;
    return;
  }

  const info = getCodonInfo(translation.currentCodon);
  if (!info || !info.aa) {
    if (!info || info.aa === null) {
      translation.finished = true;
    } else {
      translation.currentCodon++;
      startTranslationCycle();
    }
    return;
  }

  const trna = createTRNAForCodon(translation.currentCodon);
  if (!trna) {
    translation.currentCodon++;
    startTranslationCycle();
    return;
  }

  mainGroup.add(trna);
  currentTRNA = trna;
  translation.phase = 'APPROACH';
  translation.phaseTime = 0;
}

function updateTranslation(delta) {
  if (translation.paused || translation.finished) return;

  const speed = translation.speed;
  translation.phaseTime += delta * speed;

  switch (translation.phase) {
    case 'IDLE':
      if (translation.phaseTime > 0.5) {
        startTranslationCycle();
      }
      break;

    case 'APPROACH': {
      if (!currentTRNA) break;
      const approachDur = 1.2;
      const t = Math.min(translation.phaseTime / approachDur, 1);
      const eased = t * t * (3 - 2 * t);
      if (!currentTRNA.userData.startPos) {
        currentTRNA.userData.startPos = currentTRNA.position.clone();
      }
      const codonPos = getCodonPosition(translation.currentCodon);
      const target = new THREE.Vector3(codonPos.x + 0.4, codonPos.y + 0.8, 0.3);
      currentTRNA.position.lerpVectors(currentTRNA.userData.startPos, target, eased);

      if (currentTRNA.children.length > 0) {
        currentTRNA.rotation.x += delta * 0.5 * (1 - t);
        currentTRNA.rotation.z = Math.sin(translation.phaseTime * 2) * 0.1 * (1 - t);
      }

      if (t >= 1) {
        translation.phase = 'BOND';
        translation.phaseTime = 0;
      }
      break;
    }

    case 'BOND': {
      const duration = 0.8 / speed * (translation.speed > 1 ? 1 : speed);
      if (translation.phaseTime < 0.3) {
        const flashMat = new THREE.MeshBasicMaterial({ color: '#ffff00', transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const flash = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), flashMat);
        const codonPos = getCodonPosition(translation.currentCodon);
        flash.position.set(codonPos.x, codonPos.y + 0.5, 0);
        mainGroup.add(flash);
        setTimeout(() => mainGroup.remove(flash), 300 / speed);
      }

      if (translation.phaseTime >= duration) {
        const info = getCodonInfo(translation.currentCodon);
        if (info) {
          addAAToChain(info.color, info.aa);
        }
        translation.phase = 'TRANSLOCATE';
        translation.phaseTime = 0;
      }
      break;
    }

    case 'TRANSLOCATE': {
      const translocateDur = 1.2;
      const t = Math.min(translation.phaseTime / translocateDur, 1);
      const eased = t * t * (3 - 2 * t);

      const currentPos = getCodonPosition(translation.currentCodon);
      const nextPos = getCodonPosition(Math.min(translation.currentCodon + 1, TOTAL_CODONS - 1));
      const riboX = currentPos.x + (nextPos.x - currentPos.x) * eased;
      ribosomeGroup.position.x = riboX;

      if (currentTRNA && currentTRNA.userData.startPosT) {
        const trnaTarget = new THREE.Vector3(nextPos.x + 0.4, nextPos.y + 0.8, 0.3);
        currentTRNA.position.lerpVectors(currentTRNA.userData.startPosT, trnaTarget, eased);
      } else if (currentTRNA) {
        currentTRNA.userData.startPosT = currentTRNA.position.clone();
      }

      if (t >= 1) {
        translation.currentCodon++;
        translation.phase = 'EXIT';
        translation.phaseTime = 0;
      }
      break;
    }

    case 'EXIT': {
      const exitDur = 0.8;
      if (currentTRNA) {
        const exitT = Math.min(translation.phaseTime / exitDur, 1);
        currentTRNA.position.x += delta * 6 * speed;
        currentTRNA.position.y += delta * speed;
        currentTRNA.rotation.z += delta * 3 * speed;
        const fade = currentTRNA.material;
      }

      if (translation.phaseTime >= exitDur || (currentTRNA && currentTRNA.position.x > 12)) {
        if (currentTRNA) {
          mainGroup.remove(currentTRNA);
          currentTRNA = null;
        }
        translation.phase = 'IDLE';
        translation.phaseTime = 0;
      }
      break;
    }
  }
}

function addAAToChain(color, label) {
  const idx = translation.chainMeshes.length;

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    clearcoat: 0.4,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.15,
  });

  const x = idx * 0.3;
  const y = -0.5 - idx * 0.25;
  const z = 0.1 * Math.sin(idx * 0.8);

  const aa = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), mat);
  aa.position.set(x, y, z);
  aa.userData.organelleId = 'polypeptide';
  aa.userData.aaColor = color;
  aa.userData.aaLabel = label;
  polypeptideGroup.add(aa);

  if (idx > 0) {
    const prev = translation.chainMeshes[idx - 1];
    const start = new THREE.Vector3(prev.position.x, prev.position.y, prev.position.z);
    const end = new THREE.Vector3(x, y, z);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    if (len > 0.01) {
      const bond = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, len, 4),
        new THREE.MeshPhysicalMaterial({ color: '#44ff88', transparent: true, opacity: 0.5, roughness: 0.3 })
      );
      bond.position.copy(mid);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      bond.userData.organelleId = 'polypeptide';
      polypeptideGroup.add(bond);
    }
  }

  translation.chainMeshes.push(aa);
}

// ============================================================
// ANIMAÇÕES
// ============================================================
const clock = new THREE.Clock();
let rotationEnabled = true;

function updateAnimations(time, delta) {
  if (rotationEnabled) {
    mainGroup.rotation.y += delta * 0.02;
  }

  updateTranslation(delta);
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
    if (mesh.material) { mesh.material.emissive = new THREE.Color('#44aaff'); mesh.material.emissiveIntensity = 0.3; }
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
      translation.speed = parseFloat(btn.dataset.speed);
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
startTranslationCycle();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  updateAnimations(elapsed, delta);
  renderer.render(scene, camera);
}
animate();

console.log('🧬 Simulação 3D de Síntese de Proteínas carregada!');
