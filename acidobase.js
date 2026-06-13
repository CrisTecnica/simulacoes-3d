const STRUCTS=[{id:'acids',name:'Ácidos (H+)',color:'#ff4444'},{id:'bases',name:'Bases (OH-)',color:'#4444ff'},{id:'water',name:'Água',color:'#44aaff'},{id:'indicator',name:'Indicador',color:'#ff44aa'}];
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x040608);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=3;controls.maxDistance=20;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,5,8);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221122,.2));scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1;
const NA=300,NB=300;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  const total=NA+NB;
  const posA=new Float32Array(NA*3),colA=new Float32Array(NA*3),posB=new Float32Array(NB*3),colB=new Float32Array(NB*3);
  for(let i=0;i<NA;i++){posA[i*3]=(Math.random()-0.5)*3-1.5;posA[i*3+1]=(Math.random()-0.5)*4;posA[i*3+2]=(Math.random()-0.5)*3;colA[i*3]=1;colA[i*3+1]=0.3;colA[i*3+2]=0.3}
  for(let i=0;i<NB;i++){posB[i*3]=(Math.random()-0.5)*3+1.5;posB[i*3+1]=(Math.random()-0.5)*4;posB[i*3+2]=(Math.random()-0.5)*3;colB[i*3]=0.3;colB[i*3+1]=0.3;colB[i*3+2]=1}
  const ga=new THREE.BufferGeometry();ga.setAttribute('position',new THREE.BufferAttribute(posA,3));ga.setAttribute('color',new THREE.BufferAttribute(colA,3));
  const gb=new THREE.BufferGeometry();gb.setAttribute('position',new THREE.BufferAttribute(posB,3));gb.setAttribute('color',new THREE.BufferAttribute(colB,3));
  const mat=new THREE.PointsMaterial({size:0.08,vertexColors:true,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false});
  const pa=new THREE.Points(ga,mat);pa.userData.org='acids';pa.userData.vel=[];for(let i=0;i<NA;i++)pa.userData.vel.push({x:(Math.random()-0.5)*0.2,y:(Math.random()-0.5)*0.2,z:(Math.random()-0.5)*0.2});
  const pb=new THREE.Points(gb,mat);pb.userData.org='bases';pb.userData.vel=[];for(let i=0;i<NB;i++)pb.userData.vel.push({x:(Math.random()-0.5)*0.2,y:(Math.random()-0.5)*0.2,z:(Math.random()-0.5)*0.2});
  mainGroup.add(pa);mainGroup.add(pb);structures.acids=pa;structures.bases=pb;
  // Water background
  const bg=new THREE.Mesh(new THREE.BoxGeometry(8,5,4),new THREE.MeshBasicMaterial({color:0x44aaff,transparent:true,opacity:0.04,wireframe:true}));
  bg.userData.org='water';mainGroup.add(bg);structures.water=bg;
  // Indicator (pH color)
  const ind=new THREE.Mesh(new THREE.SphereGeometry(0.5,16,12),new THREE.MeshBasicMaterial({color:0xff44aa,transparent:true,opacity:0.15}));
  ind.position.set(0,0,0);ind.userData.org='indicator';mainGroup.add(ind);structures.indicator=ind;
  updateUI();
}
function update(time,delta){const spd=delta*speedMul;
  ['acids','bases'].forEach(k=>{const v=structures[k];if(!v||!v.geometry.attributes.position)return;const pos=v.geometry.attributes.position.array;const vel=v.userData.vel;for(let i=0;i<pos.length/3;i++){pos[i*3]+=vel[i].x*spd;pos[i*3+1]+=vel[i].y*spd;pos[i*3+2]+=vel[i].z*spd;if(Math.abs(pos[i*3])>3.5)vel[i].x*=-1;if(Math.abs(pos[i*3+1])>2.2)vel[i].y*=-1;if(Math.abs(pos[i*3+2])>1.7)vel[i].z*=-1}v.geometry.attributes.position.needsUpdate=true});
  // Neutralization when close
  const pa=structures.acids;const pb2=structures.bases;
  if(pa&&pb2){const pa2=pa.geometry.attributes.position.array;const pbb=pb2.geometry.attributes.position.array;const ca=pa.geometry.attributes.color.array;const cb=pb2.geometry.attributes.color.array;for(let i=0;i<NA;i++)for(let j=0;j<NB;j++){const dx=pa2[i*3]-pbb[j*3],dy=pa2[i*3+1]-pbb[j*3+1],dz=pa2[i*3+2]-pbb[j*3+2];if(dx*dx+dy*dy+dz*dz<0.5){ca[i*3]=0.5;ca[i*3+1]=0.5;ca[i*3+2]=0.5;cb[j*3]=0.5;cb[j*3+1]=0.5;cb[j*3+2]=0.5;pa.geometry.attributes.color.needsUpdate=true;pb2.geometry.attributes.color.needsUpdate=true}}}
  if(structures.indicator){const ph=0.5+0.5*Math.sin(time*0.5);structures.indicator.material.color.setHSL(0.9-ph*0.7,0.8,0.5);structures.indicator.scale.setScalar(1+0.1*Math.sin(time*2))}
}
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff44aa':'var(--border-color)'};background:${s===speedMul?'rgba(255,68,170,0.15)':'transparent'};color:${s===speedMul?'#ff44aa':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff44aa';sb.style.background='rgba(255,68,170,0.15)';sb.style.color='#ff44aa'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={acids:'Íons H+ (ácidos) doadores de prótons.',bases:'Íons OH- (bases) receptores de prótons.',water:'Meio aquoso onde ocorre a reação.',indicator:'Indicador de pH que muda de cor conforme a acidez.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🧪 Ácido-Base carregado!');
