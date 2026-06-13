// ============================================================
// VIA LÁCTEA: MOVIMENTO DE ESTRELAS
// ============================================================
const N_STARS = 20000;
const STRUCTS = [
  {id:'spiralarms', name:'Braços Espirais', color:'#4488ff'},
  {id:'bulge',      name:'Bojo Galáctico',  color:'#ffdd88'},
  {id:'halo',       name:'Halo Estelar',    color:'#6666cc'},
  {id:'globulars',  name:'Aglomerados Globulares', color:'#ffaa44'},
  {id:'nebula',     name:'Nebulosas',       color:'#ff66aa'},
];

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000008);
const camera = new THREE.PerspectiveCamera(50,W(),H()); camera.position.set(0,20,30);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.5;
container.appendChild(renderer.domElement);
function W(){return container.clientWidth} function H(){return container.clientHeight}

const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08;
controls.minDistance=5; controls.maxDistance=100; controls.target.set(0,0,0); controls.update();
const DEF_CAM=new THREE.Vector3(0,20,30);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x111133,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(0,20,10));

const mainGroup = new THREE.Group(); scene.add(mainGroup);
let particles=[], structures={}, starData=[];

function makeSpiralStars(count, innerR, outerR, arms, armTightness, color1, color2, heightScale) {
  const N = count;
  const pos = new Float32Array(N*3);
  const col = new Float32Array(N*3);
  const data = [];
  for(let i=0;i<N;i++){
    const r = innerR + Math.pow(Math.random(),0.5)*(outerR-innerR);
    const armAngle = (i%arms)/arms*Math.PI*2;
    const scatter = (0.1+Math.random()*0.9)*0.35;
    const angle = armAngle + Math.pow(r/outerR,armTightness)*2.5 + scatter;
    const x = r*Math.cos(angle);
    const z = r*Math.sin(angle);
    const y = (Math.random()-0.5)*heightScale*Math.pow(r/outerR,0.5);
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const t = (r-innerR)/(outerR-innerR);
    const c = new THREE.Color(color1).lerp(new THREE.Color(color2),t);
    const br = 0.4+Math.random()*0.6;
    col[i*3]=c.r*br; col[i*3+1]=c.g*br; col[i*3+2]=c.b*br;
    data.push({r, angle: angle, y, armAngle, scatter, heightScale, arms, armTightness, speed: 0.3+0.7/(r*0.5+0.5)});
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const mat = new THREE.PointsMaterial({
    size: 0.04, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  return {points:new THREE.Points(geo,mat), data};
}

function makeBulge(count, radius) {
  const N = count;
  const pos = new Float32Array(N*3);
  const col = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const r = radius*Math.cbrt(Math.random());
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(2*Math.random()-1);
    pos[i*3] = r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = r*Math.cos(phi)*0.4;
    pos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
    const br = 0.5+Math.random()*0.5;
    col[i*3]=1*br; col[i*3+1]=0.85*br; col[i*3+2]=0.5*br;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.05, vertexColors: true, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
}

function makeHalo(count, innerR, outerR) {
  const N = count, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const r = innerR + Math.pow(Math.random(),0.3)*(outerR-innerR);
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(2*Math.random()-1);
    pos[i*3] = r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = r*Math.cos(phi)*0.3;
    pos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
    const br = 0.1+Math.random()*0.3;
    col[i*3]=0.3*br; col[i*3+1]=0.3*br; col[i*3+2]=0.6*br;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  return new THREE.Points(geo,new THREE.PointsMaterial({
    size:0.06,vertexColors:true,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false
  }));
}

function makeGlobulars() {
  const group = new THREE.Group();
  for(let g=0;g<25;g++){
    const rad = 4+Math.random()*12;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(2*Math.random()-1);
    const cx = rad*Math.sin(phi)*Math.cos(theta);
    const cy = rad*Math.cos(phi)*0.3;
    const cz = rad*Math.sin(phi)*Math.sin(theta);
    const n = 30+Math.floor(Math.random()*60);
    const pos = new Float32Array(n*3), col = new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const r = 0.3+Math.random()*0.8;
      const a = Math.random()*Math.PI*2;
      const p = Math.acos(2*Math.random()-1);
      pos[i*3] = cx+r*Math.sin(p)*Math.cos(a);
      pos[i*3+1] = cy+r*Math.cos(p)*0.5;
      pos[i*3+2] = cz+r*Math.sin(p)*Math.sin(a);
      const br = 0.5+Math.random()*0.5;
      col[i*3]=1*br; col[i*3+1]=0.8*br; col[i*3+2]=0.4*br;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const m = new THREE.Points(geo,new THREE.PointsMaterial({
      size:0.05,vertexColors:true,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false
    }));
    group.add(m);
  }
  return group;
}

function makeNebula(count) {
  const N=count, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const arm = Math.floor(Math.random()*4);
    const angOff = arm*Math.PI/2;
    const r = 3+Math.random()*8;
    const scatter = (0.1+Math.random()*0.9)*0.5;
    const angle = angOff + Math.pow(r/11,1.2)*2.5 + scatter;
    const x=r*Math.cos(angle), z=r*Math.sin(angle);
    const y=(Math.random()-0.5)*0.5;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const hue = 0.8+Math.random()*0.2;
    _c.setHSL(hue,0.8,0.3+Math.random()*0.4);
    col[i*3]=_c.r*0.6; col[i*3+1]=_c.g*0.6; col[i*3+2]=_c.b*0.6;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  return new THREE.Points(geo,new THREE.PointsMaterial({
    size:0.15,vertexColors:true,transparent:true,opacity:0.15,blending:THREE.AdditiveBlending,depthWrite:false
  }));
}
const _c=new THREE.Color();

let currentMode='rotation';
function build(){
  while(mainGroup.children.length){
    const c=mainGroup.children[0];mainGroup.remove(c);
    if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();
    if(c.children)c.children.forEach(ch=>{if(ch.geometry)ch.geometry.dispose();if(ch.material)ch.material.dispose()});
  }
  particles=[];structures={};starData=[];

  const spiral = makeSpiralStars(N_STARS,1.5,13,4,1.2,'#4488ff','#88aaff',0.6);
  spiral.points.userData.org='spiralarms';
  mainGroup.add(spiral.points);
  structures.spiralarms=spiral.points;
  particles.push(spiral.points);
  starData = spiral.data;

  const bulge = makeBulge(3000,2);
  bulge.userData.org='bulge';
  mainGroup.add(bulge); structures.bulge=bulge;
  particles.push(bulge);

  const halo = makeHalo(4000,8,25);
  halo.userData.org='halo';
  mainGroup.add(halo); structures.halo=halo;

  if(currentMode==='cluster'){
    const glob = makeGlobulars();
    glob.userData.org='globulars';
    mainGroup.add(glob); structures.globulars=glob;

    const neb = makeNebula(3000);
    neb.userData.org='nebula';
    mainGroup.add(neb); structures.nebula=neb;
  }
  updateUI();
}

function update(time,delta){
  if(currentMode==='rotation' || currentMode==='cluster'){
    const pos = structures.spiralarms.geometry.attributes.position;
    const arr = pos.array;
    for(let i=0;i<starData.length;i++){
      const d = starData[i];
      const speed = d.speed*delta*0.15;
      d.angle += speed;
      const r = d.r;
      arr[i*3] = r*Math.cos(d.angle);
      arr[i*3+2] = r*Math.sin(d.angle);
    }
    pos.needsUpdate=true;
  }
  if(currentMode==='proper'){
    const pos = structures.spiralarms.geometry.attributes.position;
    const arr = pos.array;
    for(let i=0;i<starData.length;i++){
      const d = starData[i];
      const dr = 0.01*(Math.sin(time*0.1+i*0.001))*delta;
      d.r += dr;
      if(d.r<1.5 || d.r>13)d.r = Math.max(1.5, Math.min(13, d.r));
      arr[i*3] = d.r*Math.cos(d.angle);
      arr[i*3+2] = d.r*Math.sin(d.angle);
    }
    pos.needsUpdate=true;
  }
  if(structures.globulars){
    structures.globulars.children.forEach((g,i)=>{
      g.rotation.y+=delta*(0.02+0.01*Math.sin(time*0.05+i));
    });
  }
}

document.getElementById('vl-mode').addEventListener('change',function(){currentMode=this.value;build()});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  const show=currentMode==='cluster'?STRUCTS:STRUCTS.filter(s=>s.id!=='globulars'&&s.id!=='nebula');
  for(const s of show){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;cb.dataset.id=s.id;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{
      for(const[k,v]of Object.entries(structures)){if(k.startsWith(s.id))v.visible=cb.checked}
    });
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b);return b};
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures)){if(g.isObject3D)g.visible=true;if(g.children)g.children.forEach(c=>c.visible=true)}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures)){if(g.isObject3D)g.visible=false;if(g.children)g.children.forEach(c=>c.visible=false)}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  if(!document.querySelector('.btn-warning')){}
}

const infoPanel=document.getElementById('info-panel');
const infoName=document.getElementById('info-name');
const infoDesc=document.getElementById('info-description');
const infoFunc=document.getElementById('info-function');
const INFO={spiralarms:'Braços espirais onde estrelas jovens e gás interestelar se concentram.',bulge:'Bojo central denso com estrelas velhas e um buraco supermassivo.',halo:'Halo esférico de estrelas antigas e matéria escura.',globulars:'Aglomerados globulares: grupos densos de milhares de estrelas antigas.',nebula:'Regiões de formação estelar com gás e poeira ionizados.'};
function highlight(id){
  if(!id){infoPanel.classList.remove('visible');return}
  const s=STRUCTS.find(x=>x.id===id);if(!s)return;
  infoName.textContent=s.name;infoDesc.textContent=INFO[id]||'';infoFunc.textContent='Estrutura galáctica.';infoPanel.classList.add('visible');
}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const h=rc.intersectObjects(particles,false);
  if(h.length){let o=h[0].object;if(o.userData.org){highlight(o.userData.org);return}}
  highlight(null);
});

window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌌 Via Láctea carregada!');
