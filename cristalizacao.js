const STRUCTS=[{id:'ions',name:'Íons',color:'#88ddff'},{id:'lattice',name:'Rede Cristalina',color:'#44aaff'},{id:'bonds',name:'Ligações',color:'#88ffaa'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x04080a);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(4,4,6);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=2;controls.maxDistance=15;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(4,4,6);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112244,.2));scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(2,5,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  const size=4;const spacing=0.7;const g=new THREE.Group();g.userData.org='lattice';
  for(let x=0;x<size;x++)for(let y=0;y<size;y++)for(let z=0;z<size;z++){
    const isNa=(x+y+z)%2===0;
    const m=new THREE.Mesh(new THREE.SphereGeometry(isNa?0.2:0.15,8,6),new THREE.MeshStandardMaterial({color:isNa?0x4488ff:0x44ff88,roughness:0.4,metalness:0.2}));
    m.position.set((x-size/2)*spacing,(y-size/2)*spacing,(z-size/2)*spacing);m.userData.org='ions';g.add(m);
    // Bonds to neighbors
    if(x<size-1){const ln=makeBond(m.position,new THREE.Vector3((x+1-size/2)*spacing,(y-size/2)*spacing,(z-size/2)*spacing));ln.userData.org='bonds';g.add(ln)}
    if(y<size-1){const ln=makeBond(m.position,new THREE.Vector3((x-size/2)*spacing,(y+1-size/2)*spacing,(z-size/2)*spacing));ln.userData.org='bonds';g.add(ln)}
    if(z<size-1){const ln=makeBond(m.position,new THREE.Vector3((x-size/2)*spacing,(y-size/2)*spacing,(z+1-size/2)*spacing));ln.userData.org='bonds';g.add(ln)}
  }
  mainGroup.add(g);structures.lattice=g;
  // Floating particles (crystallizing)
  const n=400;const pos=new Float32Array(n*3),col=new Float32Array(n*3);
  for(let i=0;i<n;i++){pos[i*3]=(Math.random()-0.5)*6;pos[i*3+1]=(Math.random()-0.5)*4;pos[i*3+2]=(Math.random()-0.5)*6;const c2=new THREE.Color().setHSL(0.55+Math.random()*0.05,0.6,0.4+Math.random()*0.4);col[i*3]=c2.r;col[i*3+1]=c2.g;col[i*3+2]=c2.b}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:0.03,vertexColors:true,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));
  pts.userData.org='ions';mainGroup.add(pts);
  updateUI();
}
function makeBond(from,to){const mid=new THREE.Vector3().addVectors(from,to).multiplyScalar(0.5);const dir=new THREE.Vector3().subVectors(to,from);const len=dir.length();const geo=new THREE.CylinderGeometry(0.02,0.02,len,4,1);const mat=new THREE.MeshBasicMaterial({color:0x88ffaa,transparent:true,opacity:0.3});const m=new THREE.Mesh(geo,mat);m.position.copy(mid);const up=new THREE.Vector3(0,1,0);const q=new THREE.Quaternion().setFromUnitVectors(up,dir.clone().normalize());m.quaternion.copy(q);return m}
function update(time,delta){}function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked;mainGroup.children.forEach(g=>g.children.forEach(c=>{if(c.userData.org===s.id)c.visible=cb.checked}))});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;mainGroup.children.forEach(g=>g.children.forEach(c=>c.visible=true));document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;mainGroup.children.forEach(g=>g.children.forEach(c=>c.visible=false));document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#88ddff':'var(--border-color)'};background:${s===speedMul?'rgba(136,221,255,0.15)':'transparent'};color:${s===speedMul?'#88ddff':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#88ddff';sb.style.background='rgba(136,221,255,0.15)';sb.style.color='#88ddff'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={ions:'Íons se organizando em rede cristalina regular.',lattice:'Estrutura cristalina organizada (ex: NaCl).',bonds:'Ligações iônicas entre cátions e ânions.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const[k,v]of Object.entries(structures)){if(v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)});if(v.isMesh)meshes.push(v)}const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('💎 Cristalização carregado!');
