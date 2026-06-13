// ============================================================
// CAMPO GRAVITACIONAL E ÓRBITAS DE SATÉLITES
// ============================================================
const STRUCTS = [
  {id:'central', name:'Corpo Central', color:'#44dd88'},
  {id:'satellites',name:'Satélites',   color:'#88ddff'},
  {id:'orbits',  name:'Órbitas',       color:'#44aaff'},
  {id:'grid',    name:'Grade 3D',      color:'#336644'},
];

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000a06);
const camera = new THREE.PerspectiveCamera(50,W(),H()); camera.position.set(0,8,12);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.5;
container.appendChild(renderer.domElement);
function W(){return container.clientWidth} function H(){return container.clientHeight}
const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08;
controls.minDistance=2; controls.maxDistance=60; controls.target.set(0,0,0); controls.update();
const DEF_CAM=new THREE.Vector3(0,8,12);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112211,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(0,10,5));

const mainGroup = new THREE.Group(); scene.add(mainGroup);
let structures={}, particles=[], orbitLines=[], satData=[];
let currentMode='orbits';

const _c=new THREE.Color();

function makeGravityWell(){
  const g=new THREE.Group(); g.userData.org='grid';
  // Central sphere
  const s=new THREE.Mesh(new THREE.SphereGeometry(0.8,24,18),new THREE.MeshStandardMaterial({color:0x44dd88,roughness:0.3,metalness:0.1,emissive:0x44dd88,emissiveIntensity:0.1}));
  s.userData.org='central'; g.add(s);
  // Grid lines showing well
  const pts=[]; const rings=12;
  for(let r=1;r<=rings;r++){
    const depth=-2*Math.exp(-r/4);
    const segs=32;
    for(let i=0;i<=segs;i++){
      const ang=i/segs*Math.PI*2;
      const x=r*Math.cos(ang), z=r*Math.sin(ang);
      pts.push(x,depth,z);
    }
  }
  // Radial lines
  for(let i=0;i<16;i++){
    const ang=i/16*Math.PI*2;
    for(let r=0;r<=rings;r+=0.5){
      const depth=-2*Math.exp(-r/4);
      pts.push(r*Math.cos(ang),depth,r*Math.sin(ang));
    }
  }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  const mat=new THREE.LineBasicMaterial({color:0x44dd88,transparent:true,opacity:0.15});
  const lines=new THREE.LineSegments(geo,mat); g.add(lines);
  return g;
}

function makeOrbitSatellites(){
  const g=new THREE.Group();
  // Central body
  const s=new THREE.Mesh(new THREE.SphereGeometry(0.8,24,18),new THREE.MeshStandardMaterial({color:0x44dd88,roughness:0.3,metalness:0.1,emissive:0x44dd88,emissiveIntensity:0.2}));
  s.userData.org='central'; g.add(s);

  // Satellites at different orbits
  const configs = [
    {r:2.5, speed:0.8, incl:0, color:0x88ddff, name:'LEO'},
    {r:4, speed:0.5, incl:0.3, color:0x66bbff, name:'MEO'},
    {r:6, speed:0.33, incl:0.6, color:0x4499ff, name:'GEO'},
    {r:3.2, speed:0.7, incl:-0.2, color:0xaae0ff, name:'Polar'},
    {r:5, speed:0.4, incl:0.8, color:0x77ccff, name:'Molniya'},
    {r:1.8, speed:1.1, incl:0.1, color:0xccf0ff, name:'ISS'},
  ];
  for(const cfg of configs){
    const size=0.06+Math.random()*0.04;
    const sat=new THREE.Mesh(new THREE.SphereGeometry(size,6,4),new THREE.MeshBasicMaterial({color:cfg.color}));
    sat.userData={...cfg,angle:Math.random()*Math.PI*2};
    g.add(sat);
    satData.push(sat);
  }

  // Orbit rings
  const orbitGroup=new THREE.Group(); orbitGroup.userData.org='orbits';
  for(const cfg of configs){
    const pts=[]; const segs=48;
    for(let i=0;i<=segs;i++){
      const ang=i/segs*Math.PI*2;
      const x=cfg.r*Math.cos(ang);
      const z=cfg.r*Math.sin(ang);
      const y=Math.sin(ang)*cfg.r*Math.sin(cfg.incl)*0.5;
      pts.push(x,y,z);
    }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    const mat=new THREE.LineBasicMaterial({color:cfg.color,transparent:true,opacity:0.15});
    const line=new THREE.Line(geo,mat);
    orbitGroup.add(line);
  }
  g.add(orbitGroup);
  return g;
}

function makeNbody(){
  const g=new THREE.Group();
  const n=150; const pos=new Float32Array(n*3), vel=new Float32Array(n*3), col=new Float32Array(n*3);
  const masses=[];
  // Central massive body
  for(let i=0;i<n;i++){
    const r=0.5+Math.pow(Math.random(),0.3)*8;
    const a=Math.random()*Math.PI*2;
    const incl=(Math.random()-0.5)*0.3;
    pos[i*3]=r*Math.cos(a); pos[i*3+1]=r*Math.sin(incl); pos[i*3+2]=r*Math.sin(a);
    const orbSpeed=0.4*Math.sqrt(1/(r+0.5));
    vel[i*3]=-orbSpeed*Math.sin(a); vel[i*3+1]=Math.random()*0.02-0.01; vel[i*3+2]=orbSpeed*Math.cos(a);
    const t=r/8; _c.setHSL(0.35-t*0.2,0.8,0.4+Math.random()*0.4);
    col[i*3]=_c.r; col[i*3+1]=_c.g; col[i*3+2]=_c.b;
    masses.push(0.1+Math.random()*0.3);
  }
  // Central object
  const cs=new THREE.Mesh(new THREE.SphereGeometry(0.6,16,12),new THREE.MeshStandardMaterial({color:0x44dd88,emissive:0x44dd88,emissiveIntensity:0.1}));
  cs.userData.org='central'; g.add(cs);

  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:0.04,vertexColors:true,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false});
  const pts=new THREE.Points(geo,mat); pts.userData.vel=vel; pts.userData.masses=masses; pts.userData.isNbody=true;
  g.add(pts);
  return g;
}

let structuresToBuild={};
function build(){
  while(mainGroup.children.length){
    const c=mainGroup.children[0];mainGroup.remove(c);
    if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();
    if(c.children)c.children.forEach(ch=>{if(ch.geometry)ch.geometry.dispose();if(ch.material)ch.material.dispose()});
  }
  structures={};particles=[];satData=[];orbitLines=[];

  if(currentMode==='gravitywell'){
    const w=makeGravityWell(); mainGroup.add(w);
    structures.central=w.children.find(c=>c.userData.org==='central');
    structures.grid=w;

    // Sphere particles to show well shape
    const n=4000; const pos=new Float32Array(n*3), col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const r=0.5+Math.random()*12;
      const a=Math.random()*Math.PI*2;
      const depth=-2*Math.exp(-r/4);
      const spread=0.1+Math.random()*0.4;
      pos[i*3]=r*Math.cos(a)+(Math.random()-0.5)*spread;
      pos[i*3+1]=depth+(Math.random()-0.5)*spread;
      pos[i*3+2]=r*Math.sin(a)+(Math.random()-0.5)*spread;
      const t=r/12; _c.setHSL(0.35-t*0.2,0.6,0.3+Math.random()*0.5);
      col[i*3]=_c.r; col[i*3+1]=_c.g; col[i*3+2]=_c.b;
    }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const mat=new THREE.PointsMaterial({size:0.04,vertexColors:true,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false});
    const pts=new THREE.Points(geo,mat); pts.userData.org='central';
    mainGroup.add(pts); particles.push(pts);
  } else if(currentMode==='nbody'){
    const nb=makeNbody(); mainGroup.add(nb);
    structures.central=nb.children.find(c=>c.userData.org==='central');
    nb.children.forEach(c=>{if(c.userData&&c.userData.isNbody){structures.satellites=c;particles.push(c)}});
  } else {
    const o=makeOrbitSatellites();
    mainGroup.add(o);
    o.children.forEach(c=>{
      if(c.userData.org==='central')structures.central=c;
      else if(c.userData.org==='orbits'){structures.orbits=c;}
      else {structures.satellites=o; satData.push(c);}
    });
    // Store reference to whole group
    structures.satellites=o;
  }
  updateUI();
}

function update(time,delta){
  if(currentMode==='orbits'){
    for(const sat of satData){
      if(!sat||!sat.userData)continue;
      const cfg=sat.userData;
      cfg.angle+=delta*cfg.speed*0.5;
      const r=cfg.r||2; const incl=cfg.incl||0;
      sat.position.x=r*Math.cos(cfg.angle);
      sat.position.z=r*Math.sin(cfg.angle);
      sat.position.y=Math.sin(cfg.angle)*r*Math.sin(incl)*0.5;
    }
  }

  if(currentMode==='nbody' && structures.satellites){
    const geo=structures.satellites.geometry;
    if(!geo||!geo.attributes.position)return;
    const pos=geo.attributes.position.array;
    const vel=structures.satellites.userData.vel;
    const masses=structures.satellites.userData.masses;
    const n=pos.length/3;
    const dt=delta*0.05;

    for(let i=0;i<n;i++){
      let fx=0,fy=0,fz=0;
      for(let j=0;j<n;j++){
        if(i===j)continue;
        const dx=pos[j*3]-pos[i*3];
        const dy=pos[j*3+1]-pos[i*3+1];
        const dz=pos[j*3+2]-pos[i*3+2];
        const d=Math.sqrt(dx*dx+dy*dy+dz*dz)+0.1;
        const f=masses[j]/(d*d*d);
        fx+=dx*f; fy+=dy*f; fz+=dz*f;
      }
      // Central force
      const dx=-pos[i*3], dy=-pos[i*3+1], dz=-pos[i*3+2];
      const d=Math.sqrt(dx*dx+dy*dy+dz*dz)+0.1;
      const cf=5/(d*d*d);
      vel[i*3]+=(fx+dx*cf)*dt;
      vel[i*3+1]+=(fy+dy*cf)*dt;
      vel[i*3+2]+=(fz+dz*cf)*dt;
    }

    for(let i=0;i<n;i++){
      pos[i*3]+=vel[i*3]*dt;
      pos[i*3+1]+=vel[i*3+1]*dt;
      pos[i*3+2]+=vel[i*3+2]*dt;
    }
    geo.attributes.position.needsUpdate=true;
  }
}

document.getElementById('cg-mode').addEventListener('change',function(){currentMode=this.value;build()});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  const filtered=currentMode==='gravitywell'?STRUCTS.filter(s=>s.id!=='satellites'&&s.id!=='orbits'):STRUCTS;
  for(const s of filtered){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;cb.dataset.id=s.id;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{
      for(const[k,v]of Object.entries(structures)){if(k.startsWith(s.id)){if(v.isGroup)v.visible=cb.checked;else v.visible=cb.checked}}
    });
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b);return b};
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures)){if(g&&g.isObject3D)g.visible=true}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures)){if(g&&g.isObject3D)g.visible=false}document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
}

const infoPanel=document.getElementById('info-panel');
const infoName=document.getElementById('info-name');
const infoDesc=document.getElementById('info-description');
const infoFunc=document.getElementById('info-function');
const INFO={central:'Corpo massivo central que gera o campo gravitacional.',satellites:'Satélites artificiais em diferentes órbitas.',orbits:'Trajetórias orbitais ao redor do corpo central.',grid:'Grade de deformação do espaço-tempo mostrando o poço gravitacional.'};
function highlight(id){
  if(!id){infoPanel.classList.remove('visible');return}
  const s=STRUCTS.find(x=>x.id===id);if(!s)return;
  infoName.textContent=s.name;infoDesc.textContent=INFO[id]||'';infoFunc.textContent='Gravitação.';infoPanel.classList.add('visible');
}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const meshes=[];for(const v of Object.values(structures)){if(v&&v.isMesh)meshes.push(v);if(v&&v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)})}
  const h=rc.intersectObjects(meshes,false);
  if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}
  highlight(null);
});

window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌍 Campo Gravitacional carregada!');
