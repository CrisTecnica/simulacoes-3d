const STRUCTS=[
  {id:'particles',name:'Partículas',color:'#ff6644'},
  {id:'trails',name:'Trajetórias',color:'#ffaa88'},
  {id:'plane',name:'Plano de Colisão',color:'#4466aa'},
  {id:'vectors',name:'Vetores',color:'#88ddff'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0608);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,5,10);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=3;controls.maxDistance=25;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,5,10);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221122,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},bodies=[],trailData=[],speedMul=1,mode='elastica';

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};bodies=[];trailData=[];

  if(mode==='multi'){
    const n=80;const pos=new Float32Array(n*3),col=new Float32Array(n*3);
    const vel=[];const rad=[];
    for(let i=0;i<n;i++){
      pos[i*3]=(Math.random()-.5)*6;pos[i*3+1]=(Math.random()-.5)*4;pos[i*3+2]=(Math.random()-.5)*6;
      vel.push({x:(Math.random()-.5)*0.5,y:(Math.random()-.5)*0.3,z:(Math.random()-.5)*0.5});
      rad.push(0.08+Math.random()*0.12);
      const c=new THREE.Color().setHSL(0.07+Math.random()*0.06,0.8,0.4+Math.random()*0.4);
      col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const mat=new THREE.PointsMaterial({size:0.12,vertexColors:true,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
    const pts=new THREE.Points(geo,mat);pts.userData.vel=vel;pts.userData.rad=rad;pts.userData.org='particles';
    mainGroup.add(pts);structures.particles=pts;
  } else {
    const size1=mode==='inelastic'?0.3:0.4;
    const p1=new THREE.Mesh(new THREE.SphereGeometry(size1,16,12),new THREE.MeshStandardMaterial({color:0xff6644,emissive:0xff6644,emissiveIntensity:0.05}));
    p1.position.set(-4,0,0);p1.userData={v:{x:0.6*(mode==='inelastic'?0.4:0.8),y:0,z:0},m:2,id:0};mainGroup.add(p1);structures.p1=p1;bodies.push(p1);

    const p2=new THREE.Mesh(new THREE.SphereGeometry(0.3,16,12),new THREE.MeshStandardMaterial({color:0x44aaff,emissive:0x44aaff,emissiveIntensity:0.05}));
    p2.position.set(4,0,0);p2.userData={v:{x:mode==='inelastic'?0:-0.3,y:0,z:0},m:1,id:1};mainGroup.add(p2);structures.p2=p2;bodies.push(p2);

    // Trails
    const tg=new THREE.BufferGeometry();
    tg.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(300*3),3));
    const tl=new THREE.Line(tg,new THREE.LineBasicMaterial({color:0xff8866,transparent:true,opacity:0.25}));
    tl.frustumCulled=false;tl.userData.org='trails';mainGroup.add(tl);structures.trails=tl;
    trailData=[[],[]];

    // Grid plane
    const grid=new THREE.GridHelper(10,10,0x4466aa,0x224488);grid.userData.org='plane';grid.position.y=-0.5;
    mainGroup.add(grid);structures.plane=grid;
  }
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul*0.5;
  if(mode==='multi'&&structures.particles){
    const pos=structures.particles.geometry.attributes.position.array;
    const vel=structures.particles.userData.vel;
    const rad=structures.particles.userData.rad;
    const n=pos.length/3;
    for(let i=0;i<n;i++){
      pos[i*3]+=vel[i].x*spd;pos[i*3+1]+=vel[i].y*spd;pos[i*3+2]+=vel[i].z*spd;
      if(pos[i*3]>4||pos[i*3]<-4)vel[i].x*=-1;
      if(pos[i*3+1]>3||pos[i*3+1]<-3)vel[i].y*=-1;
      if(pos[i*3+2]>4||pos[i*3+2]<-4)vel[i].z*=-1;
    }
    // Simple collision detection
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
      const dx=pos[j*3]-pos[i*3],dy=pos[j*3+1]-pos[i*3+1],dz=pos[j*3+2]-pos[i*3+2];
      const d=Math.sqrt(dx*dx+dy*dy+dz*dz);
      const minD=rad[i]+rad[j]+0.05;
      if(d<minD&&d>0.001){
        const overlap=(minD-d)/2;
        const nx=dx/d,ny=dy/d,nz=dz/d;
        pos[i*3]-=nx*overlap;pos[i*3+1]-=ny*overlap;pos[i*3+2]-=nz*overlap;
        pos[j*3]+=nx*overlap;pos[j*3+1]+=ny*overlap;pos[j*3+2]+=nz*overlap;
        const dvx=vel[i].x-vel[j].x,dvy=vel[i].y-vel[j].y,dvz=vel[i].z-vel[j].z;
        const dot=dvx*nx+dvy*ny+dvz*nz;
        if(dot<0){
          vel[i].x-=dot*nx;vel[i].y-=dot*ny;vel[i].z-=dot*nz;
          vel[j].x+=dot*nx;vel[j].y+=dot*ny;vel[j].z+=dot*nz;
        }
      }
    }
    structures.particles.geometry.attributes.position.needsUpdate=true;
  }

  if(mode!=='multi'&&bodies.length>=2){
    const p1=bodies[0],p2=bodies[1];
    if(!p1||!p2)return;
    const d1=p1.userData,d2=p2.userData;
    p1.position.x+=d1.v.x*spd;p1.position.y+=d1.v.y*spd;p1.position.z+=d1.v.z*spd;
    p2.position.x+=d2.v.x*spd;p2.position.y+=d2.v.y*spd;p2.position.z+=d2.v.z*spd;

    // Check collision
    const dx=p2.position.x-p1.position.x,dy=p2.position.y-p1.position.y,dz=p2.position.z-p1.position.z;
    const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
    const minDist=mode==='inelastic'?0.8:1.1;
    if(dist<minDist&&!p1.userData.collided){
      p1.userData.collided=true;
      const nx=dx/dist,ny=dy/dist,nz=dz/dist;
      if(mode==='elastica'){
        const m1=d1.m,m2=d2.m;
        const dvx=d1.v.x-d2.v.x,dvy=d1.v.y-d2.v.y,dvz=d1.v.z-d2.v.z;
        const dot=dvx*nx+dvy*ny+dvz*nz;
        const j=2*dot/(m1+m2);
        d1.v.x-=j*m2*nx;d1.v.y-=j*m2*ny;d1.v.z-=j*m2*nz;
        d2.v.x+=j*m1*nx;d2.v.y+=j*m1*ny;d2.v.z+=j*m1*nz;
      } else {
        const mt=d1.m+d2.m;
        const vx=(d1.v.x*d1.m+d2.v.x*d2.m)/mt;
        const vy=(d1.v.y*d1.m+d2.v.y*d2.m)/mt;
        const vz=(d1.v.z*d1.m+d2.v.z*d2.m)/mt;
        d1.v.x=vx;d1.v.y=vy;d1.v.z=vz;
        d2.v.x=vx;d2.v.y=vy;d2.v.z=vz;
      }
    }

    // Trails
    if(structures.trails){
      trailData[0].push(new THREE.Vector3(p1.position.x,p1.position.y,p1.position.z));
      trailData[1].push(new THREE.Vector3(p2.position.x,p2.position.y,p2.position.z));
      if(trailData[0].length>150){trailData[0].shift();trailData[1].shift()}
      const tp=structures.trails.geometry.attributes.position.array;
      for(let i=0;i<trailData[0].length&&i<150;i++){
        tp[i*6]=trailData[0][i].x;tp[i*6+1]=trailData[0][i].y;tp[i*6+2]=trailData[0][i].z;
        tp[i*6+3]=trailData[1][i].x;tp[i*6+4]=trailData[1][i].y;tp[i*6+5]=trailData[1][i].z;
      }
      structures.trails.geometry.attributes.position.needsUpdate=true;
    }
  }
}
document.getElementById('col-mode').addEventListener('change',function(){mode=this.value;build()});
function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
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
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.5,1,3,10]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff6644':'var(--border-color)'};background:${s===speedMul?'rgba(255,102,68,0.15)':'transparent'};color:${s===speedMul?'#ff6644':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff6644';sb.style.background='rgba(255,102,68,0.15)';sb.style.color='#ff6644'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={particles:'Partículas em movimento com conservação de momento.',trails:'Trajetórias registradas antes e depois da colisão.',plane:'Plano de referência para visualização da colisão.',vectors:'Vetores de velocidade e momento das partículas.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Mecânica.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);
  const h=rc.intersectObjects(meshes,false);
  if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null);
});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('💥 Colisões carregado!');
