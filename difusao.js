const STRUCTS=[
  {id:'molecules',name:'Moléculas',color:'#44aaff'},
  {id:'membrane',name:'Membrana',color:'#8866ff'},
  {id:'gradient',name:'Gradiente',color:'#ff8844'},
  {id:'medium',name:'Meio',color:'#224466'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x04060a);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=20;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,5,8);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112244,.2));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},particles=[],speedMul=1,mode='simples',temp=1;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};particles=[];

  const n=600;
  const pos=new Float32Array(n*3),col=new Float32Array(n*3),vel=[];
  for(let i=0;i<n;i++){
    const side=i<n/2?-1:1;
    pos[i*3]=(Math.random()-0.5)*6;pos[i*3+1]=(Math.random()-0.5)*4;pos[i*3+2]=(Math.random()-0.5)*3;
    const hue=i<n/2?0.55:0.1;
    const c=new THREE.Color().setHSL(hue,0.7,0.5);
    col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;
    vel.push({x:(Math.random()-0.5)*0.3,y:(Math.random()-0.5)*0.3,z:(Math.random()-0.5)*0.3,side:side});
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:0.06,vertexColors:true,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false});
  const pts=new THREE.Points(geo,mat);pts.userData.vel=vel;pts.userData.n=n;
  pts.userData.org='molecules';mainGroup.add(pts);structures.molecules=pts;particles.push(pts);

  // Container/medium (wireframe box)
  const box=new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(6.5,4.5,3.5)),
    new THREE.LineBasicMaterial({color:0x224466,transparent:true,opacity:0.3})
  );box.userData.org='medium';mainGroup.add(box);structures.medium=box;

  // Membrane (for osmose)
  if(mode==='osmose'){
    const mem=new THREE.Mesh(new THREE.PlaneGeometry(6,3.5),new THREE.MeshBasicMaterial({color:0x8866ff,transparent:true,opacity:0.1,side:THREE.DoubleSide}));
    mem.position.set(0,0,0);mem.userData.org='membrane';mainGroup.add(mem);structures.membrane=mem;
    // Pores
    for(let i=0;i<8;i++){
      const pore=new THREE.Mesh(new THREE.RingGeometry(0.05,0.1,8),new THREE.MeshBasicMaterial({color:0xaa88ff,transparent:true,opacity:0.3,side:THREE.DoubleSide}));
      pore.position.set((Math.random()-0.5)*4,(Math.random()-0.5)*2.5,0);pore.userData.org='membrane';mainGroup.add(pore);
    }
  }
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul*temp;
  if(structures.molecules){
    const pos=structures.molecules.geometry.attributes.position.array;
    const vel=structures.molecules.userData.vel;
    const n=structures.molecules.userData.n;
    for(let i=0;i<n;i++){
      pos[i*3]+=vel[i].x*spd;pos[i*3+1]+=vel[i].y*spd;pos[i*3+2]+=vel[i].z*spd;
      if(pos[i*3]>3.2||pos[i*3]<-3.2)vel[i].x*=-1;
      if(pos[i*3+1]>2.2||pos[i*3+1]<-2.2)vel[i].y*=-1;
      if(pos[i*3+2]>1.7||pos[i*3+2]<-1.7)vel[i].z*=-1;
      // Osmose: allow crossing through membrane
      if(mode==='osmose'&&Math.abs(pos[i*3])<0.15&&Math.random()<0.02)vel[i].x*=-1;
    }
    structures.molecules.geometry.attributes.position.needsUpdate=true;
  }
}
document.getElementById('dif-mode').addEventListener('change',function(){mode=this.value;build()});
document.getElementById('temp-slider').addEventListener('input',function(){temp=parseFloat(this.value)});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    if(s.id==='membrane'&&mode!=='osmose')continue;
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.5,1,3,10]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#44aaff':'var(--border-color)'};background:${s===speedMul?'rgba(68,170,255,0.15)':'transparent'};color:${s===speedMul?'#44aaff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#44aaff';sb.style.background='rgba(68,170,255,0.15)';sb.style.color='#44aaff'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={molecules:'Moléculas em movimento aleatório (movimento browniano).',membrane:'Membrana semipermeável que permite osmose.',gradient:'Gradiente de concentração entre regiões.',medium:'Meio líquido ou gasoso onde ocorre a difusão.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Físico-Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&(v.isMesh||v.isPoints))meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('💨 Difusão carregado!');
