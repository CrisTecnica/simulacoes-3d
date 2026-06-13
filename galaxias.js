// ============================================================
// GALÁXIAS: FORMAÇÃO E COLISÃO
// ============================================================
const NSTARS = 15000;

const STRUCTS = [
  {id:'galaxy1',name:'Galáxia 1',color:'#7c4dff'},
  {id:'galaxy2',name:'Galáxia 2',color:'#ff6644'},
  {id:'halo',   name:'Halo de Matéria Escura',color:'#4444aa'},
  {id:'bulge',  name:'Bojo Galáctico',color:'#ffdd88'},
  {id:'arms',   name:'Braços Espirais',color:'#88bbff'},
];

// ============================================================
// CENA
// ============================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000005);
const camera = new THREE.PerspectiveCamera(50,W(),H()); camera.position.set(25,18,28);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H()); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.5;
container.appendChild(renderer.domElement);
function W(){return container.clientWidth} function H(){return container.clientHeight}

const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08;
controls.minDistance=5; controls.maxDistance=100; controls.target.set(0,0,0); controls.update();
const DEF_CAM=new THREE.Vector3(25,18,28);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}

scene.add(new THREE.AmbientLight(0x222244,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.5).position.set(20,30,10));

// ============================================================
// PARTICLES
// ============================================================
function makeGalaxyParticles(cx,cy,cz,color1,color2,arms=4,direction=1){
  const N=NSTARS, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const radius=0.5+Math.pow(Math.random(),0.6)*12;
    const armAngle=(i%arms)/arms*Math.PI*2;
    const scatter=(0.3+Math.random()*0.7)*0.4*radius;
    const angle=armAngle+radius*0.6+scatter;
    const spread=0.2+Math.random()*0.5;
    const x=cx+radius*Math.cos(angle)+scatter*0.3*Math.cos(angle+1);
    const z=cz+radius*Math.sin(angle)+scatter*0.3*Math.sin(angle+1);
    const y=cy+(Math.random()-0.5)*spread*Math.pow(radius,0.6);

    pos[i*3]=x; pos[i*3+1]=y*0.3; pos[i*3+2]=z;

    const t=radius/12;
    const c=new THREE.Color(color1).lerp(new THREE.Color(color2),t);
    const bright=0.4+Math.random()*0.6;
    col[i*3]=c.r*bright; col[i*3+1]=c.g*bright; col[i*3+2]=c.b*bright;
  }

  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:.06,vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false});
  return new THREE.Points(geo,mat);
}

function makeGalaxy2(cx,cy,cz,color1,color2,arms=4){
  const N=8000, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const r=0.3+Math.pow(Math.random(),.5)*10;
    const a=Math.random()*Math.PI*2; const sc=(.2+Math.random()*.8)*.5*r;
    const x=cx+r*Math.cos(a)+sc*Math.cos(a+1);
    const z=cz+r*Math.sin(a)+sc*Math.sin(a+1);
    const y=cy+(Math.random()-.5)*.3*Math.pow(r,.5);
    pos[i*3]=x; pos[i*3+1]=y*.3; pos[i*3+2]=z;
    const t=r/10;
    const c=new THREE.Color(color1).lerp(new THREE.Color(color2),t);
    const br=.3+Math.random()*.7;
    col[i*3]=c.r*br; col[i*3+1]=c.g*br; col[i*3+2]=c.b*br;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  return new THREE.Points(geo,new THREE.PointsMaterial({size:.05,vertexColors:true,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
}

// ============================================================
// ESTADO
// ============================================================
const mainGroup=new THREE.Group(); scene.add(mainGroup);
let particles=[], structures={}, hitTargets=[];
let currentHighlight=null; const simClock=new THREE.Clock();
let speedMul=1; let galMode='single';
let explodeProgress=0,targetExplodeProgress=0,isExploded=false;
const origPos=new Map();

// ============================================================
// CONSTRUIR
// ============================================================
function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  particles=[];structures={};hitTargets=[];currentHighlight=null;origPos.clear();

  if(galMode==='single'){
    const g=makeGalaxyParticles(0,0,0,'#7c4dff','#ff88cc',4,1);
    g.userData.org='galaxy1'; mainGroup.add(g); structures.galaxy1=g; particles.push(g);

    const halo=new THREE.Mesh(new THREE.SphereGeometry(14,32,24),
      new THREE.MeshBasicMaterial({color:'#4444aa',transparent:true,opacity:.03,wireframe:true}));
    halo.userData.org='halo'; mainGroup.add(halo); structures.halo=halo;

    const bulge=new THREE.Mesh(new THREE.SphereGeometry(2.5,24,18),
      new THREE.MeshBasicMaterial({color:'#ffdd88',transparent:true,opacity:.08}));
    bulge.userData.org='bulge'; mainGroup.add(bulge); structures.bulge=bulge;

  } else if(galMode==='collide'){
    const g1=makeGalaxyParticles(-5,0,0,'#7c4dff','#ff88cc',4,1);
    g1.userData.org='galaxy1'; mainGroup.add(g1); structures.galaxy1=g1; particles.push(g1);
    const g2=makeGalaxyParticles(5,0,0,'#ff6644','#ffcc44',4,-1);
    g2.userData.org='galaxy2'; mainGroup.add(g2); structures.galaxy2=g2; particles.push(g2);

    const h1=new THREE.Mesh(new THREE.SphereGeometry(12,24,18),new THREE.MeshBasicMaterial({color:'#4444aa',transparent:true,opacity:.02,wireframe:true}));
    h1.position.x=-5; h1.userData.org='halo'; mainGroup.add(h1); structures.halo=h1;

  } else {
    const positions=[[-8,0,0],[8,0,0],[0,0,-7],[0,0,7],[0,5,0],[0,-5,0]];
    const colors=['#7c4dff','#ff6644','#44aaff','#ffcc44','#88ff88','#ff88cc'];
    for(let i=0;i<6;i++){
      const p=positions[i];
      const g=makeGalaxy2(p[0],p[1],p[2],colors[i],'#ffffff',2+Math.floor(Math.random()*3));
      g.userData.org='galaxy'+(i+1); mainGroup.add(g); structures['galaxy'+(i+1)]=g; particles.push(g);
    }
  }

  for(const[id,g]of Object.entries(structures)){if(g&&g.isObject3D)origPos.set(id,g.position.clone())}
  updateUI();
}

// ============================================================
// ANIMAÇÃO
// ============================================================
function update(time,delta){
  mainGroup.rotation.y+=delta*.01;

  if(galMode==='collide'){
    const t=time*.08*speedMul;
    const sep=8*Math.cos(t);
    if(structures.galaxy1&&structures.galaxy2){
      structures.galaxy1.position.x=-sep;
      structures.galaxy2.position.x=sep;
      structures.galaxy1.rotation.y+=delta*.3;
      structures.galaxy2.rotation.y-=delta*.3;
      if(structures.halo)structures.halo.position.x=(structures.galaxy1.position.x+structures.galaxy2.position.x)/2;
    }
  } else if(galMode==='group'){
    for(let i=0;i<6;i++){
      const g=structures['galaxy'+(i+1)];
      if(g){g.rotation.y+=delta*(.1+Math.sin(time*.05+i)*.05);}
    }
  } else {
    if(structures.galaxy1)structures.galaxy1.rotation.y+=delta*.08;
    if(structures.bulge)structures.bulge.rotation.y+=delta*.05;
  }

  // Explode
  if(Math.abs(explodeProgress-targetExplodeProgress)>.001){
    explodeProgress+=(targetExplodeProgress-explodeProgress)*.06;
    for(const[id,g]of Object.entries(structures)){
      const o=origPos.get(id);
      if(o&&g){const d=o.clone().normalize();g.position.copy(d.multiplyScalar(o.length()+5*explodeProgress))}
    }
  }
}

// ============================================================
// UI
// ============================================================
function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    if(galMode==='group'&&s.id==='bulge')continue;
    if(galMode==='group'&&s.id==='halo')continue;
    if(galMode==='single'&&s.id==='galaxy2')continue;
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;cb.dataset.id=s.id;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{if(structures[s.id])structures[s.id].visible=cb.checked});
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b);return b};
  mk('Mostrar Tudo','btn-primary',()=>{for(const[,g]of Object.entries(structures))g.visible=true;document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const[,g]of Object.entries(structures))g.visible=false;document.querySelectorAll('#structure-list input[type="checkbox"]').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  const eb=mk('Explodir','btn-warning',()=>{isExploded=!isExploded;targetExplodeProgress=isExploded?1:0;eb.textContent=isExploded?'Restaurar':'Explodir'});

  const sl=document.createElement('div');sl.style.cssText='width:100%;font-size:10px;color:#a0a0cc;text-align:center;margin-top:4px';
  sl.textContent='VELOCIDADE';bg.appendChild(sl);
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of [0.5,1,3,10,30]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;min-width:0;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#7c4dff':'var(--border-color)'};background:${s===speedMul?'rgba(124,77,255,0.15)':'transparent'};color:${s===speedMul?'#7c4dff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#7c4dff';sb.style.background='rgba(124,77,255,0.15)';sb.style.color='#7c4dff'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}

// ============================================================
// MODO
// ============================================================
document.getElementById('gal-mode').addEventListener('change',function(){galMode=this.value;build()});

// ============================================================
// SELEÇÃO
// ============================================================
const infoPanel=document.getElementById('info-panel');
const infoName=document.getElementById('info-name');
const infoDesc=document.getElementById('info-description');
const infoFunc=document.getElementById('info-function');
function getObjId(obj){while(obj){if(obj.userData.org)return obj.userData.org;obj=obj.parent}return null}
const INFO={galaxy1:'Galáxia espiral com bilhões de estrelas, gás e poeira.',galaxy2:'Segunda galáxia em interação gravitacional.','halo':'Halo de matéria escura que envolve a galáxia, composto por partículas invisíveis.',bulge:'Bojo central denso com estrelas velhas e um buraco supermassivo.',arms:'Braços espirais onde estrelas jovens e nebulosas se concentram.'};
function highlight(id){
  if(currentHighlight){for(const m of currentHighlight.meshes){if(m.material&&m.material.emissive){m.material.emissive=new THREE.Color('#000000');m.material.emissiveIntensity=0}}}
  if(!id){currentHighlight=null;infoPanel.classList.remove('visible');return}
  const s=STRUCTS.find(x=>x.id===id);if(!s)return;
  const meshes=[];const g=structures[id];if(g)meshes.push(g);
  currentHighlight={id,meshes};
  infoName.textContent=s.name;infoDesc.textContent=INFO[id]||'';
  infoFunc.textContent='Objeto astronômico.';infoPanel.classList.add('visible');
}

renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const h=rc.intersectObjects(particles,false);
  if(h.length){highlight('galaxy1')}else{highlight(null)}
});

// ============================================================
// LOOP
// ============================================================
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
function animate(){requestAnimationFrame(animate);controls.update();update(simClock.getElapsedTime(),simClock.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌀 Simulação de Galáxias carregada!');
