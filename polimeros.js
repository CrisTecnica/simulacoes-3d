const STRUCTS=[{id:'monomers',name:'Monômeros',color:'#ffaa44'},{id:'polymer',name:'Cadeia Polimérica',color:'#ff6644'},{id:'catalyst',name:'Catalisador',color:'#44ddff'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x060408);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(5,3,6);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=2;controls.maxDistance=15;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(5,3,6);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221122,.2));scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(2,5,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1,monomers=[],polyChain=[];

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};monomers=[];polyChain=[];
  const n=40;const g=new THREE.Group();g.userData.org='monomers';
  for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),new THREE.MeshStandardMaterial({color:0xffaa44,roughness:0.4}));const x=(Math.random()-0.5)*6,y=(Math.random()-0.5)*4,z=(Math.random()-0.5)*3;m.position.set(x,y,z);m.userData={v:{x:(Math.random()-0.5)*0.2,y:(Math.random()-0.5)*0.2,z:(Math.random()-0.5)*0.2},connected:false,idx:i};g.add(m);monomers.push(m)}
  mainGroup.add(g);structures.monomers=g;
  // Catalyst
  const cat=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,8),new THREE.MeshBasicMaterial({color:0x44ddff,transparent:true,opacity:0.4}));cat.position.set(0,0,0);cat.userData.org='catalyst';mainGroup.add(cat);structures.catalyst=cat;
  // Polymer chain group
  const pg=new THREE.Group();pg.userData.org='polymer';mainGroup.add(pg);structures.polymer=pg;
  updateUI();
}
function update(time,delta){const spd=delta*speedMul;
  for(const m of monomers){if(m.userData.connected)continue;const d=m.userData;m.position.x+=d.v.x*spd;m.position.y+=d.v.y*spd;m.position.z+=d.v.z*spd;if(Math.abs(m.position.x)>3.2)d.v.x*=-1;if(Math.abs(m.position.y)>2.2)d.v.y*=-1;if(Math.abs(m.position.z)>1.7)d.v.z*=-1;if(Math.random()<0.005&&structures.polymer){d.connected=true;polyChain.push(m);m.material.color.setHex(0xff6644)}}
  // Rebuild chain visualization
  if(structures.polymer&&polyChain.length>1){while(structures.polymer.children.length){const c=structures.polymer.children[0];structures.polymer.remove(c);if(c.geometry)c.geometry.dispose()}for(let i=0;i<polyChain.length;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),new THREE.MeshStandardMaterial({color:0xff6644}));m.position.copy(polyChain[i].position);structures.polymer.add(m);if(i>0){const from=polyChain[i-1].position,to=polyChain[i].position;const mid=new THREE.Vector3().addVectors(from,to).multiplyScalar(0.5);const dir=new THREE.Vector3().subVectors(to,from);const len=dir.length();const geo=new THREE.CylinderGeometry(0.04,0.04,len,4,1);const mat=new THREE.MeshBasicMaterial({color:0xff8866,transparent:true,opacity:0.5});const bond=new THREE.Mesh(geo,mat);bond.position.copy(mid);const up=new THREE.Vector3(0,1,0);const q=new THREE.Quaternion().setFromUnitVectors(up,dir.clone().normalize());bond.quaternion.copy(q);structures.polymer.add(bond)}}}
}
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id)){if(v instanceof THREE.Group)v.visible=cb.checked;else v.visible=cb.checked}});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ffaa44':'var(--border-color)'};background:${s===speedMul?'rgba(255,170,68,0.15)':'transparent'};color:${s===speedMul?'#ffaa44':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ffaa44';sb.style.background='rgba(255,170,68,0.15)';sb.style.color='#ffaa44'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={monomers:'Moléculas monoméricas livres na solução.',polymer:'Cadeia polimérica formada por monômeros ligados.',catalyst:'Catalisador que acelera a reação de polimerização.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures)){if(v.isMesh)meshes.push(v);if(v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)})}const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🧬 Polímeros carregado!');
