// ============================================================
// BURACOS NEGROS E DISCOS DE ACREÇÃO
// ============================================================
const N_DISK = 18000; const N_JET = 3000; const N_STARS = 5000;

const STRUCTS = [
  {id:'blackhole', name:'Buraco Negro',  color:'#000000'},
  {id:'photonring',name:'Anel de Fótons',color:'#ff6600'},
  {id:'disk',      name:'Disco de Acreção',color:'#ff4400'},
  {id:'jets',      name:'Jatos Relativísticos',color:'#88ccff'},
  {id:'stars',     name:'Campo Estelar',color:'#ffffff'},
];

// ============================================================
// CENA
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000002);
const camera = new THREE.PerspectiveCamera(55,W(),H()); camera.position.set(10,6,14);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.4;
container.appendChild(renderer.domElement);
function W(){return container.clientWidth} function H(){return container.clientHeight}

const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08;
controls.minDistance=2; controls.maxDistance=80; controls.target.set(0,0,0); controls.update();
const DEF_CAM=new THREE.Vector3(10,6,14);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}

const amb = new THREE.AmbientLight(0x111122,.1); scene.add(amb);
const dl = new THREE.DirectionalLight(0xff8844,.2); dl.position.set(0,10,0); scene.add(dl);

let camSpeedMul = 1;
document.getElementById('cam-speed').addEventListener('change', function(){camSpeedMul=parseFloat(this.value)});

// ============================================================
// UTIL
// ============================================================
const _c = new THREE.Color();

// ============================================================
// CONSTRUÇÃO
// ============================================================
const mainGroup = new THREE.Group(); scene.add(mainGroup);
let particles=[], structures={};

function buildDisk(rInner, rOuter, thickness, particleCount, colorInner, colorOuter) {
  const N = particleCount;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const sizes = new Float32Array(N);
  const temps = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const r = rInner + Math.pow(Math.random(), 0.4) * (rOuter - rInner);
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * thickness * Math.pow(r / rOuter, 0.3);
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);

    pos[i*3] = x;
    pos[i*3+1] = height;
    pos[i*3+2] = z;

    const t = (r - rInner) / (rOuter - rInner);
    _c.setHSL(0.08 - t * 0.08, 1, 0.5 + t * 0.3);
    const bright = 0.6 + Math.random() * 0.4;
    col[i*3] = _c.r * bright;
    col[i*3+1] = _c.g * bright;
    col[i*3+2] = _c.b * bright;
    sizes[i] = 0.03 + Math.random() * 0.04;
    temps[i] = 1 - t;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const mat = new THREE.PointsMaterial({
    size: 0.06, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
    sizeAttenuation: true
  });
  const points = new THREE.Points(geo, mat);
  points.userData.rInner = rInner;
  points.userData.rOuter = rOuter;
  points.userData.temps = temps;
  return points;
}

function buildJets(bhRadius, length, count) {
  const N = count * 2; // both jets
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const dir = i < count ? 1 : -1;
    const dist = bhRadius * 0.5 + Math.random() * length;
    const spread = (0.1 + Math.random() * 0.3) * Math.pow(dist / length, 0.4);
    const x = (Math.random() - 0.5) * spread;
    const z = (Math.random() - 0.5) * spread;
    const y = dir * dist + (Math.random() - 0.5) * spread;
    pos[i*3] = x;
    pos[i*3+1] = y;
    pos[i*3+2] = z;
    const t = dist / length;
    _c.setHSL(0.6 - t * 0.2, 1, 0.5 + t * 0.3);
    col[i*3] = _c.r * (1 - t * 0.5);
    col[i*3+1] = _c.g * (1 - t * 0.5);
    col[i*3+2] = _c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  return new THREE.Points(geo, mat);
}

function buildBackground() {
  const pos = new Float32Array(N_STARS * 3);
  const col = new Float32Array(N_STARS * 3);
  for (let i = 0; i < N_STARS; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 40 + Math.random() * 40;
    pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.cos(phi);
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    const br = 0.3 + Math.random() * 0.7;
    col[i*3] = br; col[i*3+1] = br; col[i*3+2] = br + Math.random() * 0.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  return new THREE.Points(geo, mat);
}

let currentMode = 'stellar';

function build() {
  while (mainGroup.children.length) {
    const c = mainGroup.children[0];
    mainGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  }
  particles = []; structures = {};

  const bhRad = currentMode === 'stellar' ? 0.8 : currentMode === 'supermassive' ? 1.5 : 0.6;
  const diskInner = bhRad * 1.8;
  const diskOuter = currentMode === 'stellar' ? 7 : currentMode === 'supermassive' ? 12 : 5;
  const diskThick = currentMode === 'stellar' ? 1.2 : currentMode === 'supermassive' ? 1.8 : 0.8;

  // Black hole sphere (event horizon)
  const bhGeo = new THREE.SphereGeometry(bhRad, 32, 24);
  const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const bh = new THREE.Mesh(bhGeo, bhMat);
  bh.userData.org = 'blackhole';
  mainGroup.add(bh);
  structures.blackhole = bh;

  // Photon ring (glow around BH)
  const ringGeo = new THREE.RingGeometry(bhRad * 1.2, bhRad * 1.8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff6600, transparent: true, opacity: 0.15,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.3;
  ring.userData.org = 'photonring';
  mainGroup.add(ring);
  structures.photonring = ring;

  // Second photon ring layer
  const ringGeo2 = new THREE.RingGeometry(bhRad * 1.1, bhRad * 1.3, 48);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xffaa00, transparent: true, opacity: 0.25,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = Math.PI * 0.4;
  ring2.userData.org = 'photonring';
  mainGroup.add(ring2);
  structures.photonring2 = ring2;

  // Accretion disk
  const disk = buildDisk(diskInner, diskOuter, diskThick, N_DISK, '#ff4400', '#ffaa44');
  disk.userData.org = 'disk';
  disk.userData.isDisk = true;
  if (currentMode === 'binary') disk.position.x = -1.5;
  mainGroup.add(disk);
  structures.disk = disk;
  particles.push(disk);

  // Relativistic jets
  const jetLen = currentMode === 'stellar' ? 8 : currentMode === 'supermassive' ? 12 : 6;
  const jets = buildJets(bhRad, jetLen, N_JET);
  jets.userData.org = 'jets';
  jets.userData.isJet = true;
  mainGroup.add(jets);
  structures.jets = jets;
  particles.push(jets);

  // Background stars
  const stars = buildBackground();
  stars.userData.org = 'stars';
  stars.userData.isStar = true;
  mainGroup.add(stars);
  structures.stars = stars;

  // Binary companion
  if (currentMode === 'binary') {
    const bh2Geo = new THREE.SphereGeometry(bhRad * 0.6, 24, 18);
    const bh2Mat = new THREE.MeshBasicMaterial({ color: 0x220011 });
    const bh2 = new THREE.Mesh(bh2Geo, bh2Mat);
    bh2.position.set(3, 0, 0);
    bh2.userData.org = 'blackhole';
    mainGroup.add(bh2);
    structures.blackhole2 = bh2;

    const disk2 = buildDisk(diskInner * 0.6, diskOuter * 0.5, diskThick * 0.6, 6000, '#ff6644', '#ffcc66');
    disk2.position.set(3, 0, 0);
    disk2.userData.org = 'disk';
    disk2.userData.isDisk = true;
    mainGroup.add(disk2);
    structures.disk2 = disk2;
    particles.push(disk2);
  }

  updateUI();
}

// ============================================================
// ANIMAÇÃO
// ============================================================
let timeAcc = 0;

function update(time, delta) {
  const spd = delta * camSpeedMul;
  timeAcc += spd;

  // Rotate accretion disks
  if (structures.disk && structures.disk.userData.isDisk) {
    structures.disk.rotation.y += spd * 0.3;
  }
  if (structures.disk2) {
    structures.disk2.rotation.y += spd * 0.35;
  }

  // Rotate photon rings
  if (structures.photonring) structures.photonring.rotation.y += spd * 0.15;
  if (structures.photonring2) structures.photonring2.rotation.y -= spd * 0.1;

  // Pulsing glow on photon rings
  const pulse = 0.5 + 0.5 * Math.sin(time * 2);
  if (structures.photonring) structures.photonring.material.opacity = 0.08 + pulse * 0.12;
  if (structures.photonring2) structures.photonring2.material.opacity = 0.15 + pulse * 0.15;

  // Binary orbit
  if (currentMode === 'binary' && structures.blackhole2 && structures.disk2) {
    const angle = timeAcc * 0.15;
    const rad = 4.5;
    structures.blackhole2.position.x = Math.cos(angle) * rad;
    structures.blackhole2.position.z = Math.sin(angle) * rad;
    structures.disk2.position.copy(structures.blackhole2.position);
    structures.disk2.rotation.y += spd * 0.1;
  }

  // Accretion disk particles: inner parts glow more
  if (structures.disk && structures.disk.geometry.attributes.position) {
    const pos = structures.disk.geometry.attributes.position;
    const arr = pos.array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], z = arr[i+2];
      const r = Math.sqrt(x*x + z*z);
      const ang = Math.atan2(z, x) + spd * (0.4 + 0.6 / (r + 0.5));
      const nr = r;
      arr[i] = nr * Math.cos(ang);
      arr[i+2] = nr * Math.sin(ang);
    }
    pos.needsUpdate = true;
  }
  if (structures.disk2 && structures.disk2.geometry.attributes.position) {
    const pos = structures.disk2.geometry.attributes.position;
    const arr = pos.array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], z = arr[i+2];
      const r = Math.sqrt(x*x + z*z);
      const ang = Math.atan2(z, x) + spd * (0.45 + 0.55 / (r + 0.5));
      arr[i] = r * Math.cos(ang);
      arr[i+2] = r * Math.sin(ang);
    }
    pos.needsUpdate = true;
  }

  // Jet particles movement
  if (structures.jets) {
    const pos = structures.jets.geometry.attributes.position;
    const arr = pos.array;
    const half = arr.length / 2;
    for (let i = 0; i < half; i += 3) {
      const dir = i < half/2 ? 1 : -1;
      arr[i*2+1] += spd * dir * (1.5 + Math.random() * 0.5);
      if (Math.abs(arr[i*2+1]) > 12) {
        arr[i*2] = (Math.random() - 0.5) * 0.3;
        arr[i*2+1] = dir * 0.5;
        arr[i*2+2] = (Math.random() - 0.5) * 0.3;
      }
    }
    pos.needsUpdate = true;
  }

  // Background stars: subtle twinkle
  if (structures.stars) {
    const c = structures.stars.geometry.attributes.color;
    if (c) {
      const arr = c.array;
      for (let i = 0; i < arr.length; i += 3) {
        const brightness = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * (0.3 + (i % 10) * 0.1) + i));
        arr[i] = brightness * (0.5 + 0.5 * Math.sin(time * 0.5 + i * 0.01));
      }
      c.needsUpdate = true;
    }
  }
}

// ============================================================
// MODO
// ============================================================
document.getElementById('bh-mode').addEventListener('change', function() {
  currentMode = this.value;
  build();
});

// ============================================================
// UI
// ============================================================
function updateUI() {
  const list = document.getElementById('structure-list'); list.innerHTML = '';
  for (const s of STRUCTS) {
    if (currentMode !== 'binary' && s.id === 'jets' && false) continue;
    const item = document.createElement('label'); item.className = 'structure-item';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = true; cb.dataset.id = s.id;
    const dot = document.createElement('span'); dot.className = 'color-dot'; dot.style.background = s.color;
    const lbl = document.createElement('span'); lbl.className = 'structure-label'; lbl.textContent = s.name;
    item.append(cb, dot, lbl);
    cb.addEventListener('change', () => {
      // Toggle all objects with this org
      for (const [key, obj] of Object.entries(structures)) {
        if (obj.userData.org === s.id || key.startsWith(s.id)) obj.visible = cb.checked;
      }
    });
    list.appendChild(item);
  }
  const bg = document.getElementById('btn-group'); bg.innerHTML = '';
  const mk = (t, c, fn) => { const b = document.createElement('button'); b.className = 'btn ' + c; b.textContent = t; b.addEventListener('click', fn); bg.appendChild(b); return b; };
  mk('Mostrar Tudo', 'btn-primary', () => { for (const g of Object.values(structures)) g.visible = true; document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = true); });
  mk('Ocultar Tudo', 'btn-danger', () => { for (const g of Object.values(structures)) g.visible = false; document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c => c.checked = false); });
  mk('Resetar Câmera', '', resetCamera);
  document.querySelectorAll('.btn-warning').forEach(b => b.remove());
}

// ============================================================
// SELEÇÃO
// ============================================================
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');
const INFO = {
  blackhole: 'Região do espaço-tempo com gravidade tão intensa que nada escapa, nem a luz.',
  photonring: 'Anel de fótons no limite do horizonte de eventos, onde a luz orbita o buraco negro.',
  disk: 'Disco de gás e poeira superaquecido em rotação ao redor do buraco negro.',
  jets: 'Jatos de plasma relativisticos ejetados dos polos a velocidades próximas à da luz.',
  stars: 'Campo estelar de fundo usado como referência para observar a lente gravitacional.',
};

function highlight(id) {
  if (!id) { infoPanel.classList.remove('visible'); return; }
  const s = STRUCTS.find(x => x.id === id);
  if (!s) return;
  infoName.textContent = s.name;
  infoDesc.textContent = INFO[id] || '';
  infoFunc.textContent = 'Objeto astrofísico.';
  infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  const r = renderer.domElement.getBoundingClientRect();
  const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  const rc = new THREE.Raycaster(); rc.setFromCamera(p, camera);
  const h = rc.intersectObjects(particles, false);
  if (h.length) {
    let obj = h[0].object;
    if (obj.userData.org) { highlight(obj.userData.org); return; }
  }
  // Check meshes
  const meshes = [];
  for (const [k, v] of Object.entries(structures)) {
    if (v.isMesh) meshes.push(v);
  }
  const hm = rc.intersectObjects(meshes, false);
  if (hm.length) {
    let obj = hm[0].object;
    while (obj) { if (obj.userData.org) { highlight(obj.userData.org); return; } obj = obj.parent; }
  }
  highlight(null);
});

// ============================================================
// LOOP
// ============================================================
window.addEventListener('resize', () => { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); });
const simClock = new THREE.Clock();
function animate() { requestAnimationFrame(animate); controls.update(); update(simClock.getElapsedTime(), simClock.getDelta()); renderer.render(scene, camera); }
build(); animate();
console.log('🕳️ Simulação de Buracos Negros carregada!');
