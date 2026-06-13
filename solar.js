// ============================================================
// CONFIGURAÇÃO DO SISTEMA SOLAR
// ============================================================
const PLANET_DATA = [
  {
    id: 'sun', name: 'Sol', color: '#f39c12', emissive: '#ff6b00', radius: 2.5, orbit: 0,
    speed: 0, rotSpeed: 0.003, tilt: 0,
    desc: 'Estrela anã amarela (G2V) composta principalmente de hidrogênio (73%) e hélio (25%).',
    func: 'Fonte primária de energia do sistema solar; fusão nuclear no núcleo gera luz e calor.',
  },
  {
    id: 'mercury', name: 'Mercúrio', color: '#b5b5b5', radius: 0.25, orbit: 3.5,
    speed: 1.8, rotSpeed: 0.005, tilt: 0.03,
    desc: 'Menor planeta do sistema solar e mais próximo do Sol. Superfície craterada similar à Lua.',
    func: 'Planeta rochoso com extrema variação térmica (-180°C a 430°C) e atmosfera quase inexistente.',
  },
  {
    id: 'venus', name: 'Vênus', color: '#e8cda0', radius: 0.45, orbit: 5.0,
    speed: 1.4, rotSpeed: -0.002, tilt: 2.64,
    desc: 'Segundo planeta mais próximo do Sol. Atmosfera densa de CO₂ causa efeito estufa extremo.',
    func: 'Planeta mais quente (462°C); rotação retrógrada; brilho intenso ("Estrela d\'Alva").',
  },
  {
    id: 'earth', name: 'Terra', color: '#4a90d9', radius: 0.5, orbit: 6.5,
    speed: 1.2, rotSpeed: 0.02, tilt: 0.41,
    desc: 'Terceiro planeta do Sol. Único planeta conhecido com água líquida e vida.',
    func: 'Atmosfera rica em nitrogênio e oxigênio; campo magnético protetor; 70% da superfície coberta por água.',
  },
  {
    id: 'mars', name: 'Marte', color: '#c1440e', radius: 0.35, orbit: 8.0,
    speed: 1.0, rotSpeed: 0.019, tilt: 0.44,
    desc: 'Quarto planeta. Conhecido como "Planeta Vermelho" devido ao óxido de ferro na superfície.',
    func: 'Maior montanha do sistema solar (Monte Olimpo, 21 km); atmosfera fina de CO₂; calotas polares.',
  },
  {
    id: 'jupiter', name: 'Júpiter', color: '#d4a574', radius: 1.3, orbit: 10.5,
    speed: 0.6, rotSpeed: 0.04, tilt: 0.05,
    desc: 'Maior planeta do sistema solar. Gigante gasoso sem superfície sólida definida.',
    func: 'Composição de H₂ e He; Grande Mancha Vermelha (tempestade secular); 95 luas conhecidas.',
  },
  {
    id: 'saturn', name: 'Saturno', color: '#ead6b8', radius: 1.1, orbit: 13.0,
    speed: 0.45, rotSpeed: 0.038, tilt: 0.47,
    desc: 'Sexto planeta. Famoso por seu sistema de anéis compostos de gelo e rocha.',
    func: 'Gigante gasoso; densidade menor que a água; anéis com 280.000 km de diâmetro; 146 luas.',
  },
  {
    id: 'uranus', name: 'Urano', color: '#7ec8e3', radius: 0.7, orbit: 15.5,
    speed: 0.3, rotSpeed: -0.03, tilt: 1.71,
    desc: 'Sétimo planeta. Gigante de gelo com inclinação axial extrema (98°).',
    func: 'Rota "deitado"; atmosfera de H₂, He e CH₄ (metano); 27 luas; anéis finos e escuros.',
  },
  {
    id: 'neptune', name: 'Netuno', color: '#3f54ba', radius: 0.65, orbit: 18.0,
    speed: 0.2, rotSpeed: 0.032, tilt: 0.49,
    desc: 'Oitavo e mais distante planeta. Gigante de gelo com ventos mais rápidos do sistema.',
    func: 'Ventos de até 2.100 km/h; atmosfera azul profunda (metano); 16 luas; Grande Mancha Escura.',
  },
];

const MOON_DATA = {
  earth: [
    { id: 'moon_earth', name: 'Lua', radius: 0.08, orbit: 0.9, color: '#cccccc', speed: 3.0,
      desc: 'Único satélite natural da Terra. Quinto maior satélite do sistema solar.',
      func: 'Estabiliza a inclinação axial da Terra; causa as marés; essencial para ciclos biológicos.',
    },
  ],
  mars: [
    { id: 'moon_phobos', name: 'Fobos', radius: 0.04, orbit: 0.5, color: '#aa8866', speed: 5.0,
      desc: 'Maior lua de Marte. Forma irregular e órbita em espiral descendente.',
      func: 'Colidirá com Marte ou se desintegrará em anel em ~50 milhões de anos.',
    },
    { id: 'moon_deimos', name: 'Deimos', radius: 0.03, orbit: 0.7, color: '#bb9977', speed: 2.5,
      desc: 'Menor lua de Marte. Possível asteroide capturado.',
      func: 'Órbita distante e lenta; superfície lisa por poeira espacial.',
    },
  ],
  jupiter: [
    { id: 'moon_io', name: 'Io', radius: 0.06, orbit: 1.8, color: '#ffdd66', speed: 4.0,
      desc: 'Lua mais interna dos quatro satélites galileanos. Corpo vulcanicamente mais ativo do sistema solar.',
      func: 'Vulcões de enxofre; intensa atividade geológica causada por aquecimento de maré.',
    },
    { id: 'moon_europa', name: 'Europa', radius: 0.05, orbit: 2.3, color: '#88bbdd', speed: 3.0,
      desc: 'Lua gelada de Júpiter. Superfície de gelo sobre um oceano global subterrâneo.',
      func: 'Considerada um dos melhores candidatos para vida extraterrestre no sistema solar.',
    },
    { id: 'moon_ganymede', name: 'Ganímedes', radius: 0.09, orbit: 3.0, color: '#aa8866', speed: 2.0,
      desc: 'Maior lua de Júpiter e de todo o sistema solar. Maior que Mercúrio.',
      func: 'Possui seu próprio campo magnético; oceano subterrâneo; superfície de gelo e rocha.',
    },
    { id: 'moon_callisto', name: 'Calisto', radius: 0.08, orbit: 3.8, color: '#776655', speed: 1.5,
      desc: 'Lua mais externa dos galileanos. Superfície mais antiga e cheia de crateras.',
      func: 'Geologicamente inativa; possível oceano subterrâneo; radiação fraca na superfície.',
    },
  ],
  saturn: [
    { id: 'moon_titan', name: 'Titã', radius: 0.08, orbit: 2.2, color: '#ddaa66', speed: 2.0,
      desc: 'Maior lua de Saturno. Única lua com atmosfera densa e líquidos na superfície.',
      func: 'Lagos de metano e etano; ciclo hidrológico de hidrocarbonetos; possível vida exótica.',
    },
    { id: 'moon_rhea', name: 'Reia', radius: 0.05, orbit: 1.5, color: '#ccbbaa', speed: 3.0,
      desc: 'Segunda maior lua de Saturno. Superfície gelada com crateras e fraturas.',
      func: 'Composta principalmente de gelo de água; possível tênue atmosfera de oxigênio.',
    },
    { id: 'moon_enceladus', name: 'Encélado', radius: 0.03, orbit: 1.0, color: '#ffffff', speed: 4.0,
      desc: 'Lua pequena e brilhante de Saturno. Gêiseres de água no polo sul.',
      func: 'Oceanos subterrâneos; partículas de gelo formam o anel E de Saturno; potencial para vida.',
    },
  ],
  uranus: [
    { id: 'moon_titania', name: 'Titânia', radius: 0.06, orbit: 1.2, color: '#88aacc', speed: 2.0,
      desc: 'Maior lua de Urano. Superfície com cânions e falhas geológicas.',
      func: 'Possível atividade tectônica passada; crateras de impacto evidentes.',
    },
    { id: 'moon_oberon', name: 'Oberon', radius: 0.055, orbit: 1.5, color: '#7799bb', speed: 1.5,
      desc: 'Segunda maior lua de Urano. Superfície escura com crateras e montanhas.',
      func: 'Depósitos de gelo escuro no fundo de crateras; pouca atividade geológica.',
    },
  ],
  neptune: [
    { id: 'moon_triton', name: 'Tritão', radius: 0.07, orbit: 1.0, color: '#aabbdd', speed: 2.5,
      desc: 'Maior lua de Netuno. Órbita retrógrada — provável objeto do Cinturão de Kuiper capturado.',
      func: 'Gêiseres de nitrogênio líquido; superfície de gelo; clima ativo com ventos.',
    },
  ],
};

const MOON_FLAT = Object.values(MOON_DATA).flat();

const STRUCTURE_CONFIG = [
  { id: 'sun',      name: 'Sol',              color: '#f39c12' },
  { id: 'mercury',  name: 'Mercúrio',         color: '#b5b5b5' },
  { id: 'venus',    name: 'Vênus',            color: '#e8cda0' },
  { id: 'earth',    name: 'Terra',            color: '#4a90d9' },
  { id: 'moon_earth', name: '  Lua',          color: '#cccccc' },
  { id: 'mars',     name: 'Marte',            color: '#c1440e' },
  { id: 'moon_phobos', name: '  Fobos',       color: '#aa8866' },
  { id: 'moon_deimos', name: '  Deimos',      color: '#bb9977' },
  { id: 'jupiter',  name: 'Júpiter',          color: '#d4a574' },
  { id: 'moon_io', name: '  Io',              color: '#ffdd66' },
  { id: 'moon_europa', name: '  Europa',      color: '#88bbdd' },
  { id: 'moon_ganymede', name: '  Ganímedes', color: '#aa8866' },
  { id: 'moon_callisto', name: '  Calisto',   color: '#776655' },
  { id: 'saturn',   name: 'Saturno',          color: '#ead6b8' },
  { id: 'moon_titan', name: '  Titã',         color: '#ddaa66' },
  { id: 'moon_rhea', name: '  Reia',          color: '#ccbbaa' },
  { id: 'moon_enceladus', name: '  Encélado', color: '#ffffff' },
  { id: 'uranus',   name: 'Urano',            color: '#7ec8e3' },
  { id: 'moon_titania', name: '  Titânia',    color: '#88aacc' },
  { id: 'moon_oberon', name: '  Oberon',      color: '#7799bb' },
  { id: 'neptune',  name: 'Netuno',           color: '#3f54ba' },
  { id: 'moon_triton', name: '  Tritão',      color: '#aabbdd' },
  { id: 'asteroids',name: 'Cinturão de Asteroides', color: '#8c7e6b' },
  { id: 'orbits',   name: 'Órbitas',          color: '#555577' },
];

const MOON_IDS = new Set(MOON_FLAT.map(m => m.id));

// ============================================================
// CENA, CÂMERA, RENDERIZADOR
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000005);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
camera.position.set(20, 16, 22);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
container.appendChild(renderer.domElement);

// ============================================================
// CONTROLES
// ============================================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 80;
controls.target.set(0, 0, 0);
controls.update();

const DEFAULT_CAM_POS = new THREE.Vector3(20, 16, 22);

function resetCamera() {
  camera.position.copy(DEFAULT_CAM_POS);
  controls.target.set(0, 0, 0);
  controls.update();
}

// ============================================================
// ILUMINAÇÃO
// ============================================================
scene.add(new THREE.AmbientLight(0x222244, 0.3));

const sunLight = new THREE.PointLight(0xffffff, 2.0, 100);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

scene.add(new THREE.DirectionalLight(0x4444aa, 0.2).position.set(-20, 10, -30));

// ============================================================
// MATERIAIS
// ============================================================
function makeMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.1,
    emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color('#000000'),
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    side: opts.side ?? THREE.FrontSide,
  });
}

const matSun = makeMat('#f39c12', { roughness: 0.2, emissive: '#ff6b00', emissiveIntensity: 0.6 });

const matOrbit = new THREE.LineBasicMaterial({ color: '#555577', transparent: true, opacity: 0.2 });
const matAsteroid = makeMat('#8c7e6b', { roughness: 0.9 });
const matRing = makeMat('#b8a88a', { roughness: 0.8, transparent: true, opacity: 0.5, side: THREE.DoubleSide });

// ============================================================
// CRIAÇÃO DOS CORPOS CELESTES
// ============================================================
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const celestialBodies = {};
const hitTargets = [];
let currentHighlight = null;

// --- Sol ---
function createSun() {
  const group = new THREE.Group();
  group.name = 'Sol';

  const core = new THREE.Mesh(new THREE.SphereGeometry(PLANET_DATA[0].radius, 48, 48), matSun);
  core.userData.organelleId = 'sun';
  core.castShadow = true;
  group.add(core);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(PLANET_DATA[0].radius * 1.15, 32, 32),
    new THREE.MeshBasicMaterial({ color: '#ff8c00', transparent: true, opacity: 0.12 })
  );
  glow.userData.organelleId = 'sun';
  group.add(glow);

  const glow2 = new THREE.Mesh(
    new THREE.SphereGeometry(PLANET_DATA[0].radius * 1.4, 24, 24),
    new THREE.MeshBasicMaterial({ color: '#ff5500', transparent: true, opacity: 0.04 })
  );
  glow2.userData.organelleId = 'sun';
  group.add(glow2);

  return group;
}

// --- Planetas ---
function createPlanet(data, index) {
  const group = new THREE.Group();
  group.name = data.name;
  group.userData.planetIndex = index;

  const mat = makeMat(data.color, {
    roughness: data.id === 'earth' ? 0.6 : 0.4,
    emissive: data.id === 'sun' ? data.emissive : undefined,
    emissiveIntensity: data.id === 'sun' ? 0.6 : 0,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 24), mat);
  mesh.userData.organelleId = data.id;
  mesh.castShadow = true;
  group.add(mesh);

  if (data.id === 'earth') {
    const cloudMat = makeMat('#ffffff', { transparent: true, opacity: 0.15, roughness: 0.1 });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(data.radius * 1.02, 24, 18), cloudMat);
    clouds.userData.organelleId = 'earth';
    clouds.name = 'clouds';
    group.add(clouds);
  }

  if (data.id === 'saturn') {
    const innerR = data.radius * 1.3;
    const outerR = data.radius * 2.4;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(innerR, outerR, 64),
      matRing
    );
    ring.rotation.x = Math.PI / 2.5;
    ring.userData.organelleId = 'saturn';
    ring.name = 'rings';
    group.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(innerR * 1.15, outerR * 0.92, 64),
      makeMat('#c8b898', { roughness: 0.7, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
    );
    ring2.rotation.x = Math.PI / 2.5;
    ring2.userData.organelleId = 'saturn';
    group.add(ring2);
  }

  if (data.id === 'jupiter') {
    for (let i = 0; i < 6; i++) {
      const lat = -0.4 + i * 0.16;
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(data.radius * 1.01, 0.015, 4, 48),
        makeMat(['#c8a87c', '#a08060', '#d4b896', '#b89870'][i % 4], { roughness: 0.6, transparent: true, opacity: 0.3 })
      );
      band.rotation.x = Math.PI / 2;
      band.position.y = lat * data.radius;
      band.userData.organelleId = 'jupiter';
      group.add(band);
    }
  }

  // Moons
  const moons = MOON_DATA[data.id];
  if (moons) {
    for (const md of moons) {
      const moonMat = makeMat(md.color, { roughness: 0.6 });
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(md.radius, 12, 10), moonMat);
      moonMesh.userData.organelleId = md.id;
      moonMesh.castShadow = true;
      const moonGroup = new THREE.Group();
      moonGroup.add(moonMesh);
      moonGroup.position.x = md.orbit;

      const moonOrbitPts = [];
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        moonOrbitPts.push(new THREE.Vector3(md.orbit * Math.cos(a), 0, md.orbit * Math.sin(a)));
      }
      const moonOrbitLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(moonOrbitPts),
        new THREE.LineBasicMaterial({ color: md.color, transparent: true, opacity: 0.12 })
      );
      moonOrbitLine.userData.organelleId = md.id;
      moonGroup.add(moonOrbitLine);

      group.add(moonGroup);
      celestialBodies[md.id] = { group: moonGroup, mesh: moonMesh, data: md, angle: Math.random() * Math.PI * 2, parentId: data.id };
    }
  }

  const pos = data.orbit;
  group.position.x = pos;

  celestialBodies[data.id] = { group, mesh, data, angle: Math.random() * Math.PI * 2 };
  return group;
}

// --- Cinturão de Asteroides ---
function createAsteroidBelt() {
  const group = new THREE.Group();
  group.name = 'Cinturão de Asteroides';

  const count = 600;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 8.5 + Math.random() * 1.8;
    const y = (Math.random() - 0.5) * 0.8;
    positions[i * 3] = r * Math.cos(angle);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = r * Math.sin(angle);
    sizes[i] = 0.02 + Math.random() * 0.06;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: '#8c7e6b', size: 0.04, transparent: true, opacity: 0.5 })
  );
  points.userData.organelleId = 'asteroids';
  group.add(points);

  return group;
}

// --- Órbitas ---
function createOrbits() {
  const group = new THREE.Group();
  group.name = 'Órbitas';

  for (const data of PLANET_DATA) {
    if (data.orbit === 0) continue;
    const pts = [];
    const segs = 64;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(data.orbit * Math.cos(a), 0, data.orbit * Math.sin(a)));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, matOrbit);
    line.userData.organelleId = 'orbits';
    group.add(line);
  }

  return group;
}

// ============================================================
// ESTRELAS DE FUNDO
// ============================================================
function createStars() {
  const count = 4000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 100 + Math.random() * 200;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const c = 0.4 + Math.random() * 0.6;
    const tint = Math.random();
    colors[i * 3] = tint < 0.1 ? c : c * 1.0;
    colors[i * 3 + 1] = c;
    colors[i * 3 + 2] = tint > 0.9 ? c : c * 1.0;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 }));
  scene.add(stars);
}
createStars();

// ============================================================
// MONTAGEM
// ============================================================
structures = {};
originalPositions = new Map();

const sunGroup = createSun();
structures.sun = sunGroup;
mainGroup.add(sunGroup);

const orbitGroup = createOrbits();
structures.orbits = orbitGroup;
mainGroup.add(orbitGroup);

for (let i = 1; i < PLANET_DATA.length; i++) {
  const data = PLANET_DATA[i];
  const g = createPlanet(data, i);
  structures[data.id] = g;
  mainGroup.add(g);
  // Register moons in structures
  const moons = MOON_DATA[data.id];
  if (moons) {
    for (const md of moons) {
      const mg = celestialBodies[md.id]?.group;
      if (mg) structures[md.id] = mg;
    }
  }
}

const asteroidGroup = createAsteroidBelt();
structures.asteroids = asteroidGroup;
mainGroup.add(asteroidGroup);

function collectTargets(obj) {
  if (obj.isMesh && obj.userData.organelleId && obj.name !== 'clouds' && obj.name !== 'rings') {
    hitTargets.push(obj);
  }
  if (obj.children) for (const c of obj.children) collectTargets(c);
}
collectTargets(mainGroup);

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
let rotationEnabled = true;
let isExploded = false;
let explodeProgress = 0;
let targetExplodeProgress = 0;
let speedMultiplier = 1.5;
let totalEarthAngle = 0;
let earthAnglePrev = 0;

function updateAnimations(time, delta) {
  if (rotationEnabled) mainGroup.rotation.y += delta * 0.005;

  // Orbital motion
  for (const key of Object.keys(celestialBodies)) {
    const body = celestialBodies[key];
    if (!body) continue;
    body.angle += delta * body.data.speed * speedMultiplier;
    if (body.data.orbit > 0) {
      body.group.position.x = body.data.orbit * Math.cos(body.angle);
      body.group.position.z = body.data.orbit * Math.sin(body.angle);
    }
    body.mesh.rotation.y += delta * body.data.rotSpeed * 5;

    // Earth clouds
    if (body.data.id === 'earth') {
      const clouds = body.group.getObjectByName('clouds');
      if (clouds) clouds.rotation.y += delta * 0.015;
    }

    // Sun glow pulse
    if (body.data.id === 'sun') {
      const pulse = 0.8 + 0.2 * Math.sin(time * 0.3);
      body.mesh.material.emissiveIntensity = 0.4 + 0.3 * pulse;
    }

    // Moon orbit around planet (moons are in parent planet's local space)
    if (body.parentId && celestialBodies[body.parentId]) {
      const parent = celestialBodies[body.parentId];
      const moonLocalAngle = body.angle;
      body.group.position.x = body.data.orbit * Math.cos(moonLocalAngle);
      body.group.position.z = body.data.orbit * Math.sin(moonLocalAngle);
    }
  }

  // Track Earth days
  if (celestialBodies.earth) {
    const ea = celestialBodies.earth.angle;
    let diff = ea - earthAnglePrev;
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    totalEarthAngle += Math.abs(diff);
    earthAnglePrev = ea;
  }

  // Update clock
  updateClock();

  // Explode
  if (Math.abs(explodeProgress - targetExplodeProgress) > 0.001) {
    explodeProgress += (targetExplodeProgress - explodeProgress) * 0.06;
    for (const [id, g] of Object.entries(structures)) {
      const orig = originalPositions.get(id);
      if (orig && g) {
        const dir = orig.clone().normalize();
        const len = orig.length();
        const targetLen = len + 5 * explodeProgress;
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

function getObjId(obj) {
  while (obj) {
    if (obj.userData.organelleId) return obj.userData.organelleId;
    obj = obj.parent;
  }
  return null;
}

function getPlanetInfo(id) {
  return PLANET_DATA.find(p => p.id === id) || MOON_FLAT.find(m => m.id === id);
}

function highlight(id) {
  if (currentHighlight) {
    for (const mesh of currentHighlight.meshes) {
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive = new THREE.Color('#000000');
        mesh.material.emissiveIntensity = 0;
      }
    }
  }

  if (!id) { currentHighlight = null; infoPanel.classList.remove('visible'); return; }

  const info = getPlanetInfo(id);
  if (!info) return;

  const meshes = [];
  const g = structures[id];
  if (g) g.traverse(c => { if (c.isMesh && c.userData.organelleId === id) meshes.push(c); });

  for (const mesh of meshes) {
    if (mesh.material) {
      mesh.material.emissive = new THREE.Color('#f39c12');
      mesh.material.emissiveIntensity = 0.3;
    }
  }

  currentHighlight = { id, meshes };
  infoName.textContent = info.name;
  infoDesc.textContent = info.desc;
  infoFunc.textContent = `Característica: ${info.func}`;
  infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hitTargets, false);
  highlight(hits.length ? getObjId(hits[0]) : null);
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
  const mkBtn = (text, cls, fn) => {
    const b = document.createElement('button');
    b.className = `btn ${cls}`; b.textContent = text; b.addEventListener('click', fn);
    btnGroup.appendChild(b);
    return b;
  };

  mkBtn('Mostrar Tudo', 'btn-primary', () => {
    for (const [id, g] of Object.entries(structures)) g.visible = true;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = true);
  });
  mkBtn('Ocultar Tudo', 'btn-danger', () => {
    for (const [id, g] of Object.entries(structures)) g.visible = false;
    document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  });
  mkBtn('Resetar Câmera', '', resetCamera);

  const eb = mkBtn('Explodir', 'btn-warning', () => {
    isExploded = !isExploded;
    targetExplodeProgress = isExploded ? 1 : 0;
    eb.textContent = isExploded ? 'Restaurar' : 'Explodir';
  });

  // Speed controls
  const speedLabel = document.createElement('div');
  speedLabel.style.cssText = 'width:100%;font-size:10px;color:#a0a0cc;text-align:center;margin-top:4px;letter-spacing:0.3px;';
  speedLabel.textContent = 'VELOCIDADE ORBITAL';
  btnGroup.appendChild(speedLabel);

  const speedRow = document.createElement('div');
  speedRow.style.cssText = 'display:flex;gap:4px;width:100%;';
  const speeds = [1, 3, 10, 50, 100, 300];
  for (const s of speeds) {
    const sb = document.createElement('button');
    sb.className = 'btn';
    sb.textContent = `${s}×`;
    sb.style.cssText = `flex:1;min-width:0;padding:6px 4px;font-size:10px;border-color:${s === speedMultiplier ? '#f39c12' : 'var(--border-color)'};background:${s === speedMultiplier ? 'rgba(243,156,18,0.15)' : 'transparent'};color:${s === speedMultiplier ? '#f39c12' : 'var(--text-primary)'}`;
    sb.addEventListener('click', () => {
      speedMultiplier = s;
      speedRow.querySelectorAll('button').forEach(b => {
        b.style.borderColor = 'var(--border-color)';
        b.style.background = 'transparent';
        b.style.color = 'var(--text-primary)';
      });
      sb.style.borderColor = '#f39c12';
      sb.style.background = 'rgba(243,156,18,0.15)';
      sb.style.color = '#f39c12';
    });
    speedRow.appendChild(sb);
  }
  btnGroup.appendChild(speedRow);
}
createUI();

// ============================================================
// RELÓGIO
// ============================================================
function createClock() {
  const el = document.createElement('div');
  el.id = 'sim-clock';
  el.innerHTML = `
    <div class="clock-time">Dia 0</div>
    <div class="clock-speed">1.5×</div>
  `;
  Object.assign(el.style, {
    position: 'fixed', top: '20px', left: '20px', zIndex: '10',
    background: 'rgba(10,10,26,0.8)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '12px 18px',
    backdropFilter: 'blur(8px)', fontFamily: "'Segoe UI',system-ui,sans-serif",
    pointerEvents: 'none', userSelect: 'none',
  });
  const timeEl = el.querySelector('.clock-time');
  Object.assign(timeEl.style, {
    fontSize: '20px', fontWeight: '700', color: '#f39c12', letterSpacing: '0.5px',
  });
  const speedEl = el.querySelector('.clock-speed');
  Object.assign(speedEl.style, {
    fontSize: '11px', color: '#a0a0cc', marginTop: '2px', letterSpacing: '0.3px',
  });
  document.body.appendChild(el);
  return { timeEl, speedEl };
}

function updateClock() {
  const days = Math.floor(totalEarthAngle / (Math.PI * 2) * 365);
  clockUI.timeEl.textContent = `Dia ${days.toLocaleString()}`;
  clockUI.speedEl.textContent = `${speedMultiplier.toFixed(1)}× vel. orbital`;
}

const clockUI = createClock();

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

console.log('🌌 Simulação 3D do Sistema Solar carregada!');
