// ============================================================
// ECLIPSES SOLARES E LUNARES
// ============================================================
const S2 = Math.sqrt(2);

const STRUCTS = [
  { id:'sun',   name:'Sol',   color:'#ff6b00' },
  { id:'earth', name:'Terra', color:'#4a90d9' },
  { id:'moon',  name:'Lua',   color:'#cccccc' },
  { id:'shadow',name:'Cone de Sombra', color:'#ff4400' },
  { id:'orbits',name:'Órbitas',        color:'#555577' },
  { id:'rays',  name:'Raios de Luz',  color:'#ffdd44' },
];

// ============================================================
// CENA
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000010);

const camera = new THREE.PerspectiveCamera(45,w(),600); camera.position.set(12,8,16);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(w(),h()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.6;
container.appendChild(renderer.domElement);
function w(){return container.clientWidth} function h(){return container.clientHeight}

const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=0.08;
controls.minDistance=4; controls.maxDistance=50; controls.target.set(0,0,0); controls.update();
const DEF_CAM = new THREE.Vector3(12,8,16);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update();}

// ILUMINAÇÃO
scene.add(new THREE.AmbientLight(0x222244,0.15));
const sunLight = new THREE.PointLight(0xffffff,2.5,40); sunLight.position.set(0,0,0);
sunLight.castShadow=true; sunLight.shadow.mapSize.width=1024; sunLight.shadow.mapSize.height=1024;
scene.add(sunLight);
scene.add(new THREE.DirectionalLight(0x4444ff,0.1).position.set(-10,10,-15));

// ============================================================
// MATERIAIS
// ============================================================
function M(c,o={}){return new THREE.MeshPhysicalMaterial({color:new THREE.Color(c),roughness:o.r??0.5,metalness:o.m??0,emissive:o.e?new THREE.Color(o.e):new THREE.Color('#000000'),emissiveIntensity:o.ei??0,transparent:o.t??false,opacity:o.o??1,side:o.s??THREE.FrontSide})}

const mSun    = M('#ff8800',{r:.15,e:'#ff4400',ei:.8});
const mEarth  = M('#4a90d9',{r:.6});
const mEarthC = M('#ffffff',{t:true,o:.12,r:.1});
const mMoon   = M('#bbbbbb',{r:.7});
const mOrbit  = new THREE.LineBasicMaterial({color:'#555577',transparent:true,opacity:.12});
const mShadow = new THREE.MeshBasicMaterial({color:'#ff4400',transparent:true,opacity:.06,side:THREE.DoubleSide});
const mRay    = new THREE.LineBasicMaterial({color:'#ffdd44',transparent:true,opacity:.08});

// ============================================================
// ESTRELAS
// ============================================================
(()=>{const N=3000,g=new THREE.BufferGeometry(),p=new Float32Array(N*3);
for(let i=0;i<N;i++){const t=Math.random()*6.2832,ph=Math.acos(2*Math.random()-1),r=80+Math.random()*200;
p[i*3]=r*Math.sin(ph)*Math.cos(t);p[i*3+1]=r*Math.cos(ph);p[i*3+2]=r*Math.sin(ph)*Math.sin(t)}
g.setAttribute('position',new THREE.BufferAttribute(p,3));
scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:.1,transparent:true,opacity:.6})))})();

// ============================================================
// ESTADO
// ============================================================
const mainGroup = new THREE.Group(); scene.add(mainGroup);
let bodies={}, structures={}, hitTargets=[];
let currentHighlight=null; let explodeProgress=0,targetExplodeProgress=0,isExploded=false;
const origPos = new Map(); const simClock = new THREE.Clock();
let speedMul = 1; let eclipseMode = 'free';

// ============================================================
// CONSTRUIR
// ============================================================
function build() {
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  bodies={};structures={};hitTargets=[];currentHighlight=null;origPos.clear();

  // Sol
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.8,40,40),mSun);
  sun.userData.org='sun'; sun.castShadow=true; mainGroup.add(sun);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(2.1,24,24),new THREE.MeshBasicMaterial({color:'#ff6600',transparent:true,opacity:.06}));
  glow.userData.org='sun'; mainGroup.add(glow);
  structures.sun=sun; bodies.sun={mesh:sun,angle:0};

  // Lua (orbit Earth, we'll position manually)
  const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(.3,16,14),mMoon);
  moonMesh.userData.org='moon'; moonMesh.castShadow=true;
  structures.moon=moonMesh; mainGroup.add(moonMesh);

  // Terra
  const earth = new THREE.Mesh(new THREE.SphereGeometry(.7,32,24),mEarth);
  earth.userData.org='earth'; earth.castShadow=true;
  const ec = new THREE.Mesh(new THREE.SphereGeometry(.72,24,18),mEarthC);
  ec.userData.org='earth';
  const eGrp = new THREE.Group(); eGrp.add(earth); eGrp.add(ec);
  eGrp.position.x = 6;
  structures.earth=eGrp; mainGroup.add(eGrp);
  bodies.earth={group:eGrp,mesh:earth,angle:Math.PI*.3};
  bodies.earthCloud=ec;

  // Lua orbit group (child of main, position relative to Earth)
  const moonOrbit = .9;
  bodies.moon={mesh:moonMesh,orbit:moonOrbit,angle:0};
  moonMesh.position.set(6+moonOrbit,0,0);

  // Sombras
  const shadowGroup = new THREE.Group(); shadowGroup.name='Cone';
  const coneH=7, coneR=1.2;
  const cone = new THREE.Mesh(new THREE.ConeGeometry(coneR,coneH,24,1,true),mShadow);
  cone.position.z = -coneH/2; cone.rotation.x = Math.PI/2;
  shadowGroup.add(cone);
  const cone2 = cone.clone(); cone2.position.z = coneH/2;
  shadowGroup.add(cone2);
  shadowGroup.position.set(6,0,0);
  structures.shadow=shadowGroup; mainGroup.add(shadowGroup);

  // Raios
  const rayGroup = new THREE.Group(); rayGroup.name='Raios';
  for(let i=0;i<16;i++){
    const a=(i/16)*Math.PI*2; const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(12,0,0)];
    const r=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mRay);
    r.rotation.z=a; rayGroup.add(r);
  }
  structures.rays=rayGroup; mainGroup.add(rayGroup);

  // Órbitas
  const oGrp = new THREE.Group();
  const pts=[]; for(let i=0;i<=48;i++){const a=(i/48)*6.2832;pts.push(new THREE.Vector3(6*Math.cos(a),0,6*Math.sin(a)))}
  oGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mOrbit));
  structures.orbits=oGrp; mainGroup.add(oGrp);

  // Hit targets
  mainGroup.traverse(c=>{if(c.isMesh&&c.userData.org)hitTargets.push(c)});

  for(const[id,g]of Object.entries(structures)){if(g&&g.isObject3D)origPos.set(id,g.position.clone())}
  updateUI();
}

// ============================================================
// ECLIPSE MODE
// ============================================================
function setEclipseMode(mode) {
  eclipseMode = mode;
  if (mode==='solar') {
    // Moon exactly between Sun and Earth
    bodies.moon.angle = 0; // Moon at angle 0 relative to Earth-Sun line
  } else if (mode==='lunar') {
    bodies.moon.angle = Math.PI; // Moon behind Earth relative to Sun
  }
}

// ============================================================
// ANIMAÇÃO
// ============================================================
function update(time, delta) {
  mainGroup.rotation.y += delta * 0.003;

  // Earth orbit
  const eb = bodies.earth;
  eb.angle += delta * 0.4 * speedMul;
  eb.group.position.x = 6 * Math.cos(eb.angle);
  eb.group.position.z = 6 * Math.sin(eb.angle);
  eb.mesh.rotation.y += delta * 0.5;

  // Moon orbit around Earth
  const mb = bodies.moon;
  if (eclipseMode==='solar') {
    mb.angle += delta * 1.5 * speedMul;
    // Keep moon slightly adjusting to stay near eclipse alignment
  } else if (eclipseMode==='lunar') {
    mb.angle += delta * 1.5 * speedMul;
  } else {
    mb.angle += delta * 1.5 * speedMul;
  }

  const ex = eb.group.position.x, ez = eb.group.position.z;
  mb.mesh.position.x = ex + mb.orbit * Math.cos(mb.angle + eb.angle);
  mb.mesh.position.z = ez + mb.orbit * Math.sin(mb.angle + eb.angle);
  mb.mesh.position.y = 0.04 * Math.sin(mb.angle * 2);

  // Shadow cone follows Earth, points toward Sun
  const sg = structures.shadow;
  sg.position.copy(eb.group.position);

  // Point cone toward Sun (origin)
  sg.lookAt(0,0,0);

  // Rays follow Earth
  structures.rays.position.copy(eb.group.position);
  structures.rays.lookAt(0,0,0);

  // Sun pulse
  const pulse = 0.7+0.3*Math.sin(time*.5);
  mSun.emissiveIntensity = 0.5+0.5*pulse;

  // Explode
  if(Math.abs(explodeProgress-targetExplodeProgress)>.001){
    explodeProgress += (targetExplodeProgress-explodeProgress)*.06;
    for(const[id,g]of Object.entries(structures)){
      const o=origPos.get(id); if(o&&g){const d=o.clone().normalize();g.position.copy(d.multiplyScalar(o.length()+3*explodeProgress))}
    }
  }
}

// ============================================================
// UI
// ============================================================
function updateUI() {
  const list = document.getElementById('structure-list'); list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label'); item.className='structure-item';
    const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=true; cb.dataset.id=s.id;
    const dot=document.createElement('span'); dot.className='color-dot'; dot.style.background=s.color;
    const lbl=document.createElement('span'); lbl.className='structure-label'; lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{if(structures[s.id])structures[s.id].visible=cb.checked});
    list.appendChild(item);
  }

  const bg=document.getElementById('btn-group'); bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b);return b};
  mk('Mostrar Tudo','btn-primary',()=>{for(const[,g]of Object.entries(structures))g.visible=true;document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const[,g]of Object.entries(structures))g.visible=false;document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  const eb=mk('Explodir','btn-warning',()=>{isExploded=!isExploded;targetExplodeProgress=isExploded?1:0;eb.textContent=isExploded?'Restaurar':'Explodir'});

  // Speed
  const sl=document.createElement('div'); sl.style.cssText='width:100%;font-size:10px;color:#a0a0cc;text-align:center;margin-top:4px';
  sl.textContent='VELOCIDADE'; bg.appendChild(sl);
  const sr=document.createElement('div'); sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of [0.5,1,3,10,30]){
    const sb=document.createElement('button'); sb.className='btn'; sb.textContent=s+'×';
    sb.style.cssText=`flex:1;min-width:0;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff6b00':'var(--border-color)'};background:${s===speedMul?'rgba(255,107,0,0.15)':'transparent'};color:${s===speedMul?'#ff6b00':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff6b00';sb.style.background='rgba(255,107,0,0.15)';sb.style.color='#ff6b00'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}

// ============================================================
// SELETOR DE MODO
// ============================================================
document.getElementById('eclipse-mode').addEventListener('change', function() {
  setEclipseMode(this.value);
});

// ============================================================
// SELEÇÃO
// ============================================================
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-description');
const infoFunc = document.getElementById('info-function');

function getObjId(obj){while(obj){if(obj.userData.org)return obj.userData.org;obj=obj.parent}return null}

const INFO_DATA={
  sun:'Sol. Fonte de luz do sistema. Quando a Lua bloqueia sua luz, ocorre um eclipse solar.',
  earth:'Terra. Quando se interpõe entre o Sol e a Lua, projeta sua sombra sobre a Lua (eclipse lunar).',
  moon:'Lua. Quando passa entre o Sol e a Terra, projeta sua sombra sobre a Terra (eclipse solar).',
  shadow:'Cone de sombra projetado pelo corpo que bloqueia a luz. Dentro da umbra, o eclipse é total.',
  rays:'Raios de luz solar. Mostram como a luz se propaga em linha reta.',
  orbits:'Trajetória da Terra ao redor do Sol.',
};
function getDesc(id){return INFO_DATA[id]||''}

function highlight(id){
  if(currentHighlight){for(const m of currentHighlight.meshes){if(m.material){m.material.emissive=new THREE.Color('#000000');m.material.emissiveIntensity=0}}}
  if(!id){currentHighlight=null;infoPanel.classList.remove('visible');return}
  const s=STRUCTS.find(s=>s.id===id); if(!s)return;
  const meshes=[]; const g=structures[id]; if(g)g.traverse(c=>{if(c.isMesh&&c.userData.org===id)meshes.push(c)});
  for(const m of meshes){if(m.material&&m.material.emissive){m.material.emissive=new THREE.Color('#ff6b00');m.material.emissiveIntensity=.3}}
  currentHighlight={id,meshes};
  infoName.textContent=s.name; infoDesc.textContent=getDesc(id);
  infoFunc.textContent=s.id==='sun'?'Fonte de luz central.':'Corpo celeste do sistema.';
  infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const h=rc.intersectObjects(hitTargets,false);
  highlight(h.length?getObjId(h[0]):null);
});

// ============================================================
// RESIZE / LOOP
// ============================================================
window.addEventListener('resize',()=>{camera.aspect=w()/h();camera.updateProjectionMatrix();renderer.setSize(w(),h())});

function animate(){requestAnimationFrame(animate);controls.update();update(simClock.getElapsedTime(),simClock.getDelta());renderer.render(scene,camera)}
build(0); animate();
console.log('🌑 Simulação de Eclipses carregada!');
