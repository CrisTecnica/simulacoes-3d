const STRUCTS=[{id:'reagents',name:'Reagentes',color:'#44ffaa'},{id:'products',name:'Produtos',color:'#ff44aa'},{id:'catalyst',name:'Catalisador',color:'#ffdd44'},{id:'energy',name:'Energia',color:'#ff8844'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x040806);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=3;controls.maxDistance=15;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,5,8);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112211,.2));scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1,temp=1,conc=0.5,collisions=0;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};collisions=0;
  const nA=Math.floor(300*conc),nB=Math.floor(300*conc);
  const pos=new Float32Array((nA+nB)*3),col=new Float32Array((nA+nB)*3);const vel=[];
  for(let i=0;i<nA;i++){pos[i*3]=(Math.random()-0.5)*4-1;pos[i*3+1]=(Math.random()-0.5)*3;pos[i*3+2]=(Math.random()-0.5)*3;col[i*3]=0.3;col[i*3+1]=1;col[i*3+2]=0.6;vel.push({x:(Math.random()-0.5)*0.2*temp,y:(Math.random()-0.5)*0.2*temp,z:(Math.random()-0.5)*0.2*temp,type:'A'})}
  for(let i=0;i<nB;i++){const idx=nA+i;pos[idx*3]=(Math.random()-0.5)*4+1;pos[idx*3+1]=(Math.random()-0.5)*3;pos[idx*3+2]=(Math.random()-0.5)*3;col[idx*3]=1;col[idx*3+1]=0.3;col[idx*3+2]=0.6;vel.push({x:(Math.random()-0.5)*0.2*temp,y:(Math.random()-0.5)*0.2*temp,z:(Math.random()-0.5)*0.2*temp,type:'B',converted:false})}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:0.07,vertexColors:true,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false});
  const pts=new THREE.Points(geo,mat);pts.userData.vel=vel;pts.userData.nA=nA;pts.userData.org='reagents';
  mainGroup.add(pts);structures.reagents=pts;
  // Catalyst
  const cat=new THREE.Mesh(new THREE.SphereGeometry(0.4,12,8),new THREE.MeshBasicMaterial({color:0xffdd44,transparent:true,opacity:0.1}));
  cat.position.set(0,0,0);cat.userData.org='catalyst';mainGroup.add(cat);structures.catalyst=cat;
  updateUI();
}
function update(time,delta){const spd=delta*speedMul;
  if(structures.reagents){const pos=structures.reagents.geometry.attributes.position.array;const col=structures.reagents.geometry.attributes.color.array;const vel=structures.reagents.userData.vel;const na=structures.reagents.userData.nA;const n=pos.length/3;let rate=0;const speed=temp*spd;for(let i=0;i<n;i++){pos[i*3]+=vel[i].x*speed;pos[i*3+1]+=vel[i].y*speed;pos[i*3+2]+=vel[i].z*speed;if(Math.abs(pos[i*3])>2.8)vel[i].x*=-1;if(Math.abs(pos[i*3+1])>1.8)vel[i].y*=-1;if(Math.abs(pos[i*3+2])>1.8)vel[i].z*=-1;if(i<na)for(let j=na;j<n;j++){if(vel[j].converted)continue;const dx=pos[i*3]-pos[j*3],dy=pos[i*3+1]-pos[j*3+1],dz=pos[i*3+2]-pos[j*3+2];if(dx*dx+dy*dy+dz*dz<0.3){rate++;vel[j].converted=true;col[j*3]=0.5;col[j*3+1]=0.8;col[j*3+2]=1;col[i*3]=0.5;col[i*3+1]=0.8;col[i*3+2]=1;structures.reagents.geometry.attributes.color.needsUpdate=true;break}}}document.getElementById('rate-display').textContent='Taxa: '+rate;structures.reagents.geometry.attributes.position.needsUpdate=true}
}
document.getElementById('temp-cin').addEventListener('input',function(){temp=parseFloat(this.value);build()});
document.getElementById('conc-cin').addEventListener('input',function(){conc=parseFloat(this.value);build()});
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);mk('Reiniciar','btn-warning',()=>{build()});const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#44ffaa':'var(--border-color)'};background:${s===speedMul?'rgba(68,255,170,0.15)':'transparent'};color:${s===speedMul?'#44ffaa':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#44ffaa';sb.style.background='rgba(68,255,170,0.15)';sb.style.color='#44ffaa'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={reagents:'Moléculas reagentes que colidem para formar produtos.',products:'Produtos formados pela reação química.',catalyst:'Catalisador que reduz a energia de ativação.',energy:'Energia de ativação e perfil energético da reação.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('⚗️ Cinética carregado!');
