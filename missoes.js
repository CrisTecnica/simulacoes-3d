// ============================================================
// MISSÕES ESPACIAIS HISTÓRICAS E TRAJETÓRIAS DE SONDAS
// ============================================================
const STRUCTS = [
  {id:'sun',    name:'Sol',      color:'#ffcc00'},
  {id:'planets',name:'Planetas', color:'#4488ff'},
  {id:'probe',  name:'Sonda',    color:'#ff8800'},
  {id:'trail',  name:'Trajetória',color:'#ff4400'},
  {id:'launch', name:'Lançamento',color:'#00ff88'},
];

const MISSIONS = [
  {id:'apollo11',  name:'Apollo 11',  year:1969, desc:'Primeiro pouso tripulado na Lua. Neil Armstrong e Buzz Aldrin.', dest:'Lua', planets:[{id:'earth',r:5,angle:0},{id:'moon',r:2.5,angle:Math.PI}], path:[ /* simplified */ ]},
  {id:'voyager1',  name:'Voyager 1',  year:1977, desc:'Sonda interestelar que visitou Júpiter e Saturno. Primeiro objeto humano no espaço interestelar.', dest:'Espaço Interestelar', planets:[{id:'earth',r:5,angle:0},{id:'jupiter',r:12,angle:2.5},{id:'saturn',r:16,angle:4.2}], path:[]},
  {id:'voyager2',  name:'Voyager 2',  year:1977, desc:'Única sonda a visitar Júpiter, Saturno, Urano e Netuno.', dest:'Espaço Interestelar', planets:[{id:'earth',r:5,angle:0},{id:'jupiter',r:12,angle:1.8},{id:'saturn',r:16,angle:3.5},{id:'uranus',r:20,angle:5.0},{id:'neptune',r:24,angle:6.2}], path:[]},
  {id:'iss',       name:'ISS',        year:1998, desc:'Estação Espacial Internacional. Laboratório em órbita baixa da Terra.', dest:'Órbita Baixa', planets:[{id:'earth',r:5,angle:0}], path:[]},
  {id:'hubble',    name:'Hubble',     year:1990, desc:'Telescópio espacial que revolucionou a astronomia com imagens do universo profundo.', dest:'Órbita Baixa', planets:[{id:'earth',r:5,angle:0}], path:[]},
  {id:'jwst',      name:'James Webb', year:2021, desc:'Maior telescópio espacial já lançado. Opera no ponto Lagrange L2.', dest:'L2 (Sol-Terra)', planets:[{id:'earth',r:5,angle:0}], path:[]},
  {id:'mars2020',  name:'Mars 2020',  year:2020, desc:'Missão Perseverance: rover em Marte buscando sinais de vida antiga.', dest:'Marte', planets:[{id:'earth',r:5,angle:0},{id:'mars',r:8,angle:Math.PI*1.5}], path:[]},
  {id:'cassini',   name:'Cassini',    year:1997, desc:'Sonda que estudou Saturno e suas luas por 13 anos.', dest:'Saturno', planets:[{id:'earth',r:5,angle:0},{id:'jupiter',r:12,angle:2.0},{id:'saturn',r:16,angle:4.5}], path:[]},
  {id:'newhorizons',name:'New Horizons',year:2006, desc:'Sonda que sobrevoou Plutão e o Cinturão de Kuiper.', dest:'Plutão', planets:[{id:'earth',r:5,angle:0},{id:'jupiter',r:12,angle:3.0}], path:[]},
  {id:'sputnik',   name:'Sputnik 1',  year:1957, desc:'Primeiro satélite artificial da história. Início da era espacial.', dest:'Órbita Baixa', planets:[{id:'earth',r:5,angle:0}], path:[]},
];

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000005);
const camera = new THREE.PerspectiveCamera(50,W(),H()); camera.position.set(0,10,20);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.4;
container.appendChild(renderer.domElement);
function W(){return container.clientWidth} function H(){return container.clientHeight}
const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08;
controls.minDistance=3; controls.maxDistance=80; controls.target.set(0,0,0); controls.update();
const DEF_CAM=new THREE.Vector3(0,10,20);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x111122,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(0,15,5));

const mainGroup = new THREE.Group(); scene.add(mainGroup);
let structures={}, particles=[], trailPoints=[], probeObj=null, trailLine=null, animPhase=0;
let currentMission=MISSIONS[0];
const STARFIELD = new Float32Array(3000*3);
for(let i=0;i<3000*3;i++)STARFIELD[i]=((Math.random()-.5)*80);

// Build planets
const PLANET_COLORS = {earth:0x4488ff,moon:0xaaaaaa,jupiter:0xffaa66,saturn:0xddcc88,uranus:0x88ddff,neptune:0x4444ff,mars:0xff6644};

function build(){
  while(mainGroup.children.length){
    const c=mainGroup.children[0];mainGroup.remove(c);
    if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();
  }
  structures={};particles=[];trailPoints=[];probeObj=null;trailLine=null;animPhase=0;

  // Starfield
  const sg=new THREE.BufferGeometry();
  sg.setAttribute('position',new THREE.BufferAttribute(STARFIELD.slice(),3));
  const sm=new THREE.PointsMaterial({color:0xffffff,size:0.06,transparent:true,opacity:0.6});
  const stars=new THREE.Points(sg,sm); stars.userData.org='stars';
  mainGroup.add(stars);

  // Sun
  const sunGeo=new THREE.SphereGeometry(1,24,18);
  const sunMat=new THREE.MeshBasicMaterial({color:0xffcc00});
  const sun=new THREE.Mesh(sunGeo,sunMat); sun.userData.org='sun';
  mainGroup.add(sun); structures.sun=sun;

  // Sun glow
  const glowGeo=new THREE.SphereGeometry(1.4,24,18);
  const glowMat=new THREE.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:0.15});
  const glow=new THREE.Mesh(glowGeo,glowMat);
  mainGroup.add(glow);

  // Planets
  const planetsGroup=new THREE.Group(); planetsGroup.userData.org='planets';
  const pData = currentMission.planets || [];
  const placed = new Set();
  for(const pd of pData){
    if(placed.has(pd.id))continue; placed.add(pd.id);
    const size = pd.id==='earth'?0.4:pd.id==='moon'?0.15:pd.id==='jupiter'?0.8:pd.id==='saturn'?0.7:pd.id==='uranus'||pd.id==='neptune'?0.5:pd.id==='mars'?0.3:0.4;
    const geo=new THREE.SphereGeometry(size,16,12);
    const mat=new THREE.MeshStandardMaterial({
      color:PLANET_COLORS[pd.id]||0x888888,
      roughness:0.6,metalness:0.1,
      emissive:PLANET_COLORS[pd.id]||0x888888,emissiveIntensity:0.05
    });
    const m=new THREE.Mesh(geo,mat);
    const a=pd.angle||0; const r=pd.r||5;
    m.position.set(r*Math.cos(a),0,r*Math.sin(a));
    m.userData.orbitR=r; m.userData.orbitA=a;
    planetsGroup.add(m);
  }
  mainGroup.add(planetsGroup); structures.planets=planetsGroup;

  // Trajectory line
  const numPts=200;
  const tPos=new Float32Array(numPts*3);
  const tGeo=new THREE.BufferGeometry();
  tGeo.setAttribute('position',new THREE.BufferAttribute(tPos,3));
  const tMat=new THREE.LineBasicMaterial({color:0xff4400,transparent:true,opacity:0.4});
  trailLine=new THREE.Line(tGeo,tMat); trailLine.frustumCulled=false;
  trailLine.userData.org='trail';
  mainGroup.add(trailLine); structures.trail=trailLine;

  // Probe
  const prGeo=new THREE.SphereGeometry(0.12,8,6);
  const prMat=new THREE.MeshBasicMaterial({color:0xff8800});
  probeObj=new THREE.Mesh(prGeo,prMat); probeObj.userData.org='probe';
  mainGroup.add(probeObj); structures.probe=probeObj;

  // Launch glow
  const lgGeo=new THREE.SphereGeometry(0.2,8,6);
  const lgMat=new THREE.MeshBasicMaterial({color:0x00ff88,transparent:true,opacity:0.6});
  const lg=new THREE.Mesh(lgGeo,lgMat); lg.userData.org='launch';
  lg.position.set(0,0,0); mainGroup.add(lg); structures.launch=lg;
  particles.push(lg);

  updateUI();
}

function update(time,delta){
  animPhase+=delta*0.08;

  // Animate planets in orbit
  if(structures.planets){
    structures.planets.children.forEach(m=>{
      if(m.userData.orbitR){
        m.userData.orbitA+=delta*(0.1/m.userData.orbitR);
        const r=m.userData.orbitR;
        m.position.x=r*Math.cos(m.userData.orbitA);
        m.position.z=r*Math.sin(m.userData.orbitA);
      }
    });
  }

  // Probe trajectory
  if(probeObj && trailLine){
    const pData = currentMission.planets || [];
    const totalT = pData.length;
    const t = animPhase % (totalT+1);
    const seg = Math.min(Math.floor(t), totalT-1);
    const frac = t-seg;
    let px,py,pz;
    if(seg<0 || totalT===0){
      px=0;py=0;pz=0;
    } else if(seg>=totalT-1){
      const last=pData[totalT-1];
      const r=last.r||5;
      px=r*Math.cos((last.angle||0)+time*0.1);
      py=0; pz=r*Math.sin((last.angle||0)+time*0.1);
    } else {
      const a=pData[seg], b=pData[seg+1];
      const r1=a.r||5, r2=b.r||5;
      const ang1=(a.angle||0)+time*0.1, ang2=(b.angle||0)+time*0.1;
      px=(r1+(r2-r1)*frac)*Math.cos(ang1+(ang2-ang1)*frac);
      py=Math.sin(frac*Math.PI)*0.5;
      pz=(r1+(r2-r1)*frac)*Math.sin(ang1+(ang2-ang1)*frac);
    }
    probeObj.position.set(px,py,pz);

    // Update trail
    trailPoints.push(new THREE.Vector3(px,py,pz));
    if(trailPoints.length>200)trailPoints.shift();
    const tPos=trailLine.geometry.attributes.position.array;
    const n=Math.min(trailPoints.length,tPos.length/3);
    for(let i=0;i<n;i++){
      tPos[i*3]=trailPoints[i].x; tPos[i*3+1]=trailPoints[i].y; tPos[i*3+2]=trailPoints[i].z;
    }
    for(let i=n;i<tPos.length/3;i++){
      tPos[i*3]=0; tPos[i*3+1]=-999; tPos[i*3+2]=0;
    }
    trailLine.geometry.attributes.position.needsUpdate=true;

    // Launch glow
    if(structures.launch){
      const pulse=0.3+0.7*(0.5+0.5*Math.sin(time*3));
      structures.launch.material.opacity=pulse*0.5;
    }
  }

  // Sun pulse
  if(structures.sun){
    const s=1+0.02*Math.sin(time*1.5);
    structures.sun.scale.set(s,s,s);
  }
}

// Populate missions
const sel=document.getElementById('missao-select');
for(const m of MISSIONS){
  const opt=document.createElement('option');opt.value=m.id;opt.textContent=`${m.name} (${m.year})`;
  sel.appendChild(opt);
}
sel.addEventListener('change',function(){
  currentMission=MISSIONS.find(m=>m.id===this.value)||MISSIONS[0];
  build();
});
sel.value='apollo11';

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;cb.dataset.id=s.id;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{
      for(const[k,v]of Object.entries(structures)){if(k.startsWith(s.id)||(k==='planets'&&s.id==='planets')||(k==='sun'&&s.id==='sun'))v.visible=cb.checked}
    });
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b);return b};
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures)){if(g.isObject3D)g.visible=true}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures)){if(g.isObject3D)g.visible=false}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);

  // Mission info
  const info = document.createElement('div'); info.style.cssText='padding:0 20px 10px;font-size:11px;color:#a0a0cc';
  info.innerHTML=`<strong>${currentMission.name}</strong> (${currentMission.year})<br>${currentMission.desc}<br><em>Destino: ${currentMission.dest}</em>`;
  bg.prepend(info);
}

const infoPanel=document.getElementById('info-panel');
const infoName=document.getElementById('info-name');
const infoDesc=document.getElementById('info-description');
const infoFunc=document.getElementById('info-function');
const INFO={sun:'Estrela central do sistema solar.',planets:'Planetas em órbita ao redor do Sol.',probe:'Sonda espacial com instrumentos científicos.',trail:'Trajetória percorrida pela sonda desde o lançamento.',launch:'Ponto de lançamento e propulsão inicial.'};
function highlight(id){
  if(!id){infoPanel.classList.remove('visible');return}
  const s=STRUCTS.find(x=>x.id===id);if(!s)return;
  infoName.textContent=s.name;infoDesc.textContent=INFO[id]||'';infoFunc.textContent='Missão espacial.';infoPanel.classList.add('visible');
}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const meshes=[];for(const v of Object.values(structures)){if(v.isMesh&&v.geometry.type==='SphereGeometry')meshes.push(v);if(v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)})}
  const h=rc.intersectObjects(meshes,false);
  if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}
  highlight(null);
});

window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🚀 Missões Espaciais carregada!');
