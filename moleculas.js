const STRUCTS=[
  {id:'atoms',name:'Átomos',color:'#ff6688'},
  {id:'bonds',name:'Ligações',color:'#88aaff'},
  {id:'cloud',name:'Nuvem Eletrônica',color:'#ff88aa'},
  {id:'orbitals',name:'Orbitais',color:'#44ddff'},
  {id:'labels',name:'Rótulos',color:'#ffffff'},
];

const MOLECULES = {
  H2O: {name:'Agua (H2O)', atoms:[{x:0,y:0,z:0,e:'O',r:0.5},{x:0.7,y:0.5,z:0,e:'H',r:0.35},{x:-0.7,y:0.5,z:0,e:'H',r:0.35}], bonds:[[0,1],[0,2]], desc:'Molecula polar essencial a vida. Geometria angular (104,5).'},
  CO2: {name:'Dioxido de Carbono (CO2)', atoms:[{x:0,y:0,z:0,e:'C',r:0.45},{x:1.3,y:0,z:0,e:'O',r:0.5},{x:-1.3,y:0,z:0,e:'O',r:0.5}], bonds:[[0,1,2],[0,2,2]], desc:'Molecula linear (180). Principal gas do efeito estufa.'},
  CH4: {name:'Metano (CH4)', atoms:[{x:0,y:0,z:0,e:'C',r:0.45},{x:0.7,y:0.7,z:0.7,e:'H',r:0.35},{x:-0.7,y:-0.7,z:0.7,e:'H',r:0.35},{x:0.7,y:-0.7,z:-0.7,e:'H',r:0.35},{x:-0.7,y:0.7,z:-0.7,e:'H',r:0.35}], bonds:[[0,1],[0,2],[0,3],[0,4]], desc:'Geometria tetraedrica (109,5). Principal componente do gas natural.'},
  NH3: {name:'Amoniaco (NH3)', atoms:[{x:0,y:0.5,z:0,e:'N',r:0.5},{x:0.7,y:-0.3,z:0.6,e:'H',r:0.35},{x:-0.7,y:-0.3,z:0.6,e:'H',r:0.35},{x:0,y:-0.3,z:-0.8,e:'H',r:0.35}], bonds:[[0,1],[0,2],[0,3]], desc:'Geometria piramidal. Usado em fertilizantes e produtos de limpeza.'},
  C6H6: {name:'Benzeno (C6H6)', atoms:[{x:0.7,y:0,z:0.4,e:'C',r:0.45},{x:0,y:0,z:-0.8,e:'C',r:0.45},{x:-0.7,y:0,z:-0.4,e:'C',r:0.45},{x:-0.7,y:0,z:0.4,e:'C',r:0.45},{x:0,y:0,z:0.8,e:'C',r:0.45},{x:0.7,y:0,z:-0.4,e:'C',r:0.45}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]], desc:'Anel aromatico de 6 carbonos. Estrutura ressonante.'},
  C2H5OH: {name:'Etanol (C2H5OH)', atoms:[{x:-0.8,y:0,z:0,e:'C',r:0.45},{x:0.5,y:0,z:0.7,e:'C',r:0.45},{x:1.5,y:0,z:0,e:'O',r:0.5},{x:-1.5,y:0,z:0.7,e:'H',r:0.35},{x:-0.8,y:0.9,z:-0.6,e:'H',r:0.35},{x:-0.8,y:-0.9,z:-0.6,e:'H',r:0.35},{x:0.5,y:0.9,z:1.3,e:'H',r:0.35},{x:0.5,y:-0.9,z:1.3,e:'H',r:0.35}], bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7]], desc:'Alcool etilico. Usado como combustivel e em bebidas.'},
};

const ATOM_COLORS = {C:0x666666,H:0xffffff,O:0xff3333,N:0x3333ff};
const ATOM_NAMES = {C:'Carbono',H:'Hidrogênio',O:'Oxigênio',N:'Nitrogênio'};

const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x08060a);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,0,5);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2;controls.maxDistance=12;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,0,5);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x222244,.3));
scene.add(new THREE.DirectionalLight(0xffffff,.5).position.set(2,3,4));
scene.add(new THREE.DirectionalLight(0xffffff,.2).position.set(-2,-1,-3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},molGroup=null,speedMul=1,currentMol='H2O';

function buildMol(id){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};molGroup=null;

  molGroup=new THREE.Group();mainGroup.add(molGroup);
  const mol=MOLECULES[id];
  if(!mol)return;

  const atomGroup=new THREE.Group();atomGroup.userData.org='atoms';
  const bondGroup=new THREE.Group();bondGroup.userData.org='bonds';

  for(const a of mol.atoms){
    const geo=new THREE.SphereGeometry(a.r,24,18);
    const mat=new THREE.MeshStandardMaterial({
      color:ATOM_COLORS[a.e]||0x888888,
      roughness:0.3,metalness:0.1,emissive:ATOM_COLORS[a.e]||0x888888,emissiveIntensity:0.05
    });
    const m=new THREE.Mesh(geo,mat);
    m.position.set(a.x,a.y,a.z);
    m.userData.org='atoms';m.userData.element=a.e;
    atomGroup.add(m);
  }

  for(const b of mol.bonds){
    const from=mol.atoms[b[0]],to=mol.atoms[b[1]];
    const bondOrder=b[2]||1;
    const dx=to.x-from.x,dy=to.y-from.y,dz=to.z-from.z;
    const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
    for(let o=0;o<bondOrder;o++){
      const off=(o-(bondOrder-1)/2)*0.08;
      const perpX=-dy,perpY=dx,perpZ=0;
      const pl=Math.sqrt(perpX*perpX+perpY*perpY+perpZ*perpZ)||1;
      const midX=(from.x+to.x)/2+perpX/pl*off;
      const midY=(from.y+to.y)/2+perpY/pl*off;
      const midZ=(from.z+to.z)/2+perpZ/pl*off;
      const geo=new THREE.CylinderGeometry(0.06,0.06,len,6,1);
      const mat=new THREE.MeshStandardMaterial({color:0x88aaff,roughness:0.4,metalness:0.1});
      const mesh=new THREE.Mesh(geo,mat);
      mesh.position.set(midX,midY,midZ);
      const up=new THREE.Vector3(0,1,0);
      const dir=new THREE.Vector3(dx,dy,dz).normalize();
      const q=new THREE.Quaternion().setFromUnitVectors(up,dir);
      mesh.quaternion.copy(q);
      mesh.userData.org='bonds';
      bondGroup.add(mesh);
    }
  }

  molGroup.add(atomGroup);molGroup.add(bondGroup);

  // Electron cloud
  const nCloud=1500;const cp=new Float32Array(nCloud*3),cc=new Float32Array(nCloud*3);
  for(let i=0;i<nCloud;i++){
    const theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);
    const r=0.3+Math.pow(Math.random(),0.5)*1.5;
    cp[i*3]=r*Math.sin(phi)*Math.cos(theta);
    cp[i*3+1]=r*Math.cos(phi);
    cp[i*3+2]=r*Math.sin(phi)*Math.sin(theta);
    cc[i*3]=0.8+Math.random()*0.2;cc[i*3+1]=0.3+Math.random()*0.3;cc[i*3+2]=0.4+Math.random()*0.3;
  }
  const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.BufferAttribute(cp,3));cg.setAttribute('color',new THREE.BufferAttribute(cc,3));
  const cm=new THREE.PointsMaterial({size:0.02,vertexColors:true,transparent:true,opacity:0.2,blending:THREE.AdditiveBlending,depthWrite:false});
  const cloud=new THREE.Points(cg,cm);cloud.userData.org='cloud';
  molGroup.add(cloud);

  updateUI();
}
document.getElementById('mol-select').addEventListener('change',function(){currentMol=this.value;buildMol(currentMol)});

// Populate dropdown
const sel=document.getElementById('mol-select');
for(const[key,m]of Object.entries(MOLECULES)){
  const opt=document.createElement('option');opt.value=key;opt.textContent=m.name;sel.appendChild(opt);
}
sel.value='H2O';

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{
      for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked;
      if(molGroup)molGroup.children.forEach(ch=>{if(ch.userData.org===s.id)ch.visible=cb.checked});
    });
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};
  mk('Mostrar Tudo','btn-primary',()=>{molGroup&&molGroup.children.forEach(c=>c.visible=true);document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{molGroup&&molGroup.children.forEach(c=>c.visible=false);document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.5,1,3,10]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff6688':'var(--border-color)'};background:${s===speedMul?'rgba(255,102,136,0.15)':'transparent'};color:${s===speedMul?'#ff6688':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff6688';sb.style.background='rgba(255,102,136,0.15)';sb.style.color='#ff6688'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={atoms:'Átomos dos elementos químicos na molécula.',bonds:'Ligações covalentes entre átomos.',cloud:'Nuvem eletrônica ao redor da molécula.',orbitals:'Orbitais atômicos e moleculares.',labels:'Rótulos com símbolos dos elementos.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);if(molGroup)molGroup.children.forEach(g=>g.children.forEach(c=>{if(c.isMesh)meshes.push(c)}));const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);if(o.userData.element){const mol=MOLECULES[currentMol];if(mol){iD.textContent=ATOM_NAMES[o.userData.element]||'';iF.textContent='Elemento químico.'}}return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();if(molGroup)molGroup.rotation.y+=0.002*speedMul;renderer.render(scene,camera)}
buildMol('H2O');animate();
console.log('🧪 Moléculas carregado!');
