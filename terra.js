const STRUCTS=[{id:'crust',name:'Crosta',color:'#44aa44'},{id:'mantle',name:'Manto',color:'#ff8800'},{id:'outer',name:'Núcleo Externo',color:'#ffdd00'},{id:'inner',name:'Núcleo Interno',color:'#ff4400'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x040406);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,2,5);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=2;controls.maxDistance=10;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,2,5);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x111122,.2));scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(1,3,2));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1;
function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  const layers=[
    {r:2.0,color:0x44aa44,opacity:0.15,wire:false,name:'crust'},
    {r:1.7,color:0xff8800,opacity:0.12,wire:true,name:'mantle'},
    {r:1.2,color:0xffdd00,opacity:0.2,wire:false,name:'outer'},
    {r:0.6,color:0xff4400,opacity:0.3,wire:false,name:'inner'},
  ];
  for(const l of layers){const geo=new THREE.SphereGeometry(l.r,32,24);const mat=new THREE.MeshBasicMaterial({color:l.color,transparent:true,opacity:l.opacity,wireframe:l.wire});const m=new THREE.Mesh(geo,mat);m.userData.org=l.name;mainGroup.add(m);structures[l.name]=m}
  updateUI();
}
function update(time,delta){const spd=delta*speedMul;if(structures.inner)structures.inner.rotation.y+=spd*0.5;if(structures.outer)structures.outer.rotation.y+=spd*0.2}
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff6622':'var(--border-color)'};background:${s===speedMul?'rgba(255,102,34,0.15)':'transparent'};color:${s===speedMul?'#ff6622':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff6622';sb.style.background='rgba(255,102,34,0.15)';sb.style.color='#ff6622'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={crust:'Crosta terrestre: camada mais externa e fina.',mantle:'Manto: camada de rocha parcialmente derretida.',outer:'Núcleo externo: ferro e níquel líquidos.',inner:'Núcleo interno: esfera sólida de ferro e níquel.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Geologia.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌍 Estrutura da Terra carregado!');
