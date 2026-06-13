const STRUCTS=[{id:'plates',name:'Placas',color:'#ff8844'},{id:'mantle',name:'Manto',color:'#ff4400'},{id:'crust',name:'Crosta',color:'#44aa44'},{id:'magma',name:'Magma',color:'#ff0000'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x040608);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,4,8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=3;controls.maxDistance=15;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,4,8);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221111,.2));scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(2,5,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1,mode='divergente';

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  // Mantle (semi-transparent sphere)
  const mantle=new THREE.Mesh(new THREE.SphereGeometry(1.8,32,24),new THREE.MeshBasicMaterial({color:0xff4400,transparent:true,opacity:0.15,wireframe:true}));
  mantle.userData.org='mantle';mainGroup.add(mantle);structures.mantle=mantle;
  // Crust plates
  const plateW=3.5,plateH=0.08,plateD=2.5;
  const p1=new THREE.Mesh(new THREE.BoxGeometry(plateW,plateH,plateD),new THREE.MeshStandardMaterial({color:0x44aa44,roughness:0.6}));
  p1.position.set(-plateW/2,1.8,0);p1.userData.org='plates';mainGroup.add(p1);structures.p1=p1;
  const p2=new THREE.Mesh(new THREE.BoxGeometry(plateW,plateH,plateD),new THREE.MeshStandardMaterial({color:0x88cc44,roughness:0.6}));
  p2.position.set(plateW/2,1.8,0);p2.userData.org='plates';mainGroup.add(p2);structures.p2=p2;
  // Magma between plates
  const magma=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.06,plateD),new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.6}));
  magma.position.set(0,1.8,0);magma.userData.org='magma';mainGroup.add(magma);structures.magma=magma;
  // Arrow indicators
  const arrowDir=mode==='divergente'?-1:mode==='convergente'?1:mode==='transformante'?0:1;
  if(arrowDir!==0){const a1=new THREE.ArrowHelper(new THREE.Vector3(arrowDir,0,0),new THREE.Vector3(-1.8,1.8,0),1,0xff8844);a1.userData.org='plates';mainGroup.add(a1);const a2=new THREE.ArrowHelper(new THREE.Vector3(-arrowDir,0,0),new THREE.Vector3(1.8,1.8,0),1,0xff8844);a2.userData.org='plates';mainGroup.add(a2)}
  if(mode==='transformante'){const a1=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,1.8,1),0.8,0xff8844);a1.userData.org='plates';mainGroup.add(a1);const a2=new THREE.ArrowHelper(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1.8,-1),0.8,0xff8844);a2.userData.org='plates';mainGroup.add(a2)}
  updateUI();
}
function update(time,delta){const spd=delta*speedMul*0.3;
  if(structures.p1&&structures.p2){const speed=mode==='divergente'?0.3:mode==='convergente'?-0.2:0;if(mode==='transformante'){structures.p1.position.z+=spd*0.5;structures.p2.position.z-=spd*0.5;if(Math.abs(structures.p1.position.z)>2)structures.p1.position.z=-2;if(Math.abs(structures.p2.position.z)>2)structures.p2.position.z=-2}else{structures.p1.position.x+=spd*speed;structures.p2.position.x-=spd*speed;if(Math.abs(structures.p1.position.x)>3)structures.p1.position.x=-3;if(Math.abs(structures.p2.position.x)>3)structures.p2.position.x=3}}
  if(structures.magma&&mode==='divergente'){structures.magma.scale.x=0.5+0.5*Math.sin(time*2)}
}
document.getElementById('tect-mode').addEventListener('change',function(){mode=this.value;build()});
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff8844':'var(--border-color)'};background:${s===speedMul?'rgba(255,136,68,0.15)':'transparent'};color:${s===speedMul?'#ff8844':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff8844';sb.style.background='rgba(255,136,68,0.15)';sb.style.color='#ff8844'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={plates:'Placas tectônicas se movendo sobre o manto.',mantle:'Manto terrestre: camada de rocha derretida.',crust:'Crosta terrestre: camada sólida superficial.',magma:'Magma ascendente entre placas divergentes.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Geologia.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌍 Tectônica carregado!');
