const STRUCTS=[
  {id:'charges',name:'Cargas',color:'#ff6644'},
  {id:'field',name:'Campo',color:'#ffcc00'},
  {id:'vectors',name:'Vetores',color:'#44ddff'},
  {id:'magnet',name:'Imã',color:'#ff4444'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000510);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(6,5,8);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2;controls.maxDistance=25;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(6,5,8);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112244,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(3,8,2));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},particles=[],speedMul=1,mode='eletrico';

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();}
  structures={};particles=[];

  if(mode==='eletrico'){
    // Two charges
    const cp=new THREE.Mesh(new THREE.SphereGeometry(0.4,16,12),new THREE.MeshBasicMaterial({color:0xff4444}));
    cp.position.set(-2,0,0);cp.userData.org='charges';mainGroup.add(cp);structures.chargeP=cp;
    const cn=new THREE.Mesh(new THREE.SphereGeometry(0.4,16,12),new THREE.MeshBasicMaterial({color:0x4444ff}));
    cn.position.set(2,0,0);cn.userData.org='charges';mainGroup.add(cn);structures.chargeN=cn;

    // Field arrows (arrows along field lines)
    const arrowGroup=new THREE.Group();arrowGroup.userData.org='field';
    const nArrows=200;
    for(let i=0;i<nArrows;i++){
      const theta=Math.random()*Math.PI*2;const phi=Math.acos(2*Math.random()-1);
      const r=0.5+Math.random()*4;
      const x=r*Math.sin(phi)*Math.cos(theta),z=r*Math.sin(phi)*Math.sin(theta),y=r*Math.cos(phi)*0.5;
      const dx1=x+2,dx2=x-2;
      const d1=Math.sqrt(dx1*dx1+y*y+z*z)+0.1,d2=Math.sqrt(dx2*dx2+y*y+z*z)+0.1;
      const fx=dx1/(d1*d1*d1)-dx2/(d2*d2*d2),fy=y/(d1*d1*d1)-y/(d2*d2*d2),fz=z/(d1*d1*d1)-z/(d2*d2*d2);
      const fl=Math.sqrt(fx*fx+fy*fy+fz*fz)+0.01;
      const len=Math.min(fl*2,0.8);
      const dir=new THREE.Vector3(fx/fl,fy/fl,fz/fl);
      const arrow=new THREE.ArrowHelper(dir,new THREE.Vector3(x,y,z),len,0xffcc00,0.15,0.1);
      arrow.userData.org='vectors';arrowGroup.add(arrow);
    }
    mainGroup.add(arrowGroup);structures.field=arrowGroup;
  } else if(mode==='magnetico'){
    // Bar magnet
    const bar=new THREE.Mesh(new THREE.BoxGeometry(2,0.4,0.4),new THREE.MeshStandardMaterial({color:0x888888,metalness:0.5,roughness:0.3}));
    bar.position.set(0,0,0);bar.userData.org='magnet';mainGroup.add(bar);structures.magnet=bar;

    const nPole=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),new THREE.MeshBasicMaterial({color:0xff4444}));
    nPole.position.set(1.1,0,0);mainGroup.add(nPole);
    const sPole=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),new THREE.MeshBasicMaterial({color:0x4444ff}));
    sPole.position.set(-1.1,0,0);mainGroup.add(sPole);

    // Field lines as particles flowing in loops
    const nPts=3000;const pos=new Float32Array(nPts*3),col=new Float32Array(nPts*3);
    for(let i=0;i<nPts;i++){
      const lineIdx=Math.floor(Math.random()*12);const t=Math.random()*Math.PI*2;
      const r=1.5+Math.random()*3;
      const x=r*Math.cos(t),z=r*Math.sin(t)*0.6;
      const y=(Math.random()-0.5)*0.3;
      pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;
      _c.setHSL(0.6-Math.random()*0.1,0.8,0.4+Math.random()*0.4);
      col[i*3]=_c.r;col[i*3+1]=_c.g;col[i*3+2]=_c.b;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const mat=new THREE.PointsMaterial({size:0.03,vertexColors:true,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false});
    const pts=new THREE.Points(geo,mat);pts.userData.org='field';mainGroup.add(pts);structures.field=pts;particles.push(pts);
  } else {
    // EM wave: oscillating E and B fields
    const nSegs=120;const len=8;
    const ePos=[],bPos=[];
    for(let i=0;i<=nSegs;i++){
      const x=-len/2+i/len*len;
      ePos.push(x,0,0);ePos.push(x,0,0);
      bPos.push(x,0,0);bPos.push(x,0,0);
    }
    const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.Float32BufferAttribute(ePos,3));
    const bg2=new THREE.BufferGeometry();bg2.setAttribute('position',new THREE.Float32BufferAttribute(bPos,3));
    const emat=new THREE.LineBasicMaterial({color:0xffcc00});const bmat=new THREE.LineBasicMaterial({color:0x44aaff});
    const eLine=new THREE.Line(eg,emat);eLine.userData.org='field';
    const bLine=new THREE.Line(bg2,bmat);bLine.userData.org='field';
    eLine.frustumCulled=false;bLine.frustumCulled=false;
    mainGroup.add(eLine);mainGroup.add(bLine);structures.eField=eLine;structures.bField=bLine;

    // Propagation arrow
    const arrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(-4.5,0,0),1,0xffffff);
    mainGroup.add(arrow);
    // E and B labels (as particles)
    const nf=4000;const fp=new Float32Array(nf*3),fc=new Float32Array(nf*3);
    for(let i=0;i<nf;i++){
      const x=(Math.random()-.5)*len;const y=(Math.random()-.5)*2.5;const z=(Math.random()-.5)*2.5;
      fp[i*3]=x;fp[i*3+1]=y;fp[i*3+2]=z;
      fc[i*3]=0.1;fc[i*3+1]=0.15;fc[i*3+2]=0.25;
    }
    const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fp,3));fg.setAttribute('color',new THREE.Float32BufferAttribute(fc,3));
    const fm=new THREE.PointsMaterial({size:0.03,vertexColors:true,transparent:true,opacity:0.3,depthWrite:false});
    const fpts=new THREE.Points(fg,fm);mainGroup.add(fpts);
  }
  updateUI();
}
const _c=new THREE.Color();

function update(time,delta){
  const spd=delta*speedMul;
  if(mode==='eletromagnetico'&&structures.eField&&structures.bField){
    const ePos=structures.eField.geometry.attributes.position.array;
    const bPos=structures.bField.geometry.attributes.position.array;
    const n=ePos.length/6;
    for(let i=0;i<=n;i++){
      const t=i/n;const x=-4+t*8;
      const ey=Math.sin(x*2-time*4)*0.8;const bz=Math.sin(x*2-time*4)*0.8;
      ePos[i*6]=x;ePos[i*6+1]=ey;ePos[i*6+2]=0;
      ePos[i*6+3]=x;ePos[i*6+4]=-ey;ePos[i*6+5]=0;
      bPos[i*6]=x;bPos[i*6+1]=0;bPos[i*6+2]=bz;
      bPos[i*6+3]=x;bPos[i*6+4]=0;bPos[i*6+5]=-bz;
    }
    structures.eField.geometry.attributes.position.needsUpdate=true;
    structures.bField.geometry.attributes.position.needsUpdate=true;
  }
  if(mode==='magnetico'&&structures.field){
    const pos=structures.field.geometry.attributes.position.array;
    for(let i=0;i<pos.length;i+=3){
      const x=pos[i],z=pos[i+2];
      const r=Math.sqrt(x*x+z*z);const a=Math.atan2(z,x);
      const na=a+spd*0.1;
      pos[i]=r*Math.cos(na);pos[i+2]=r*Math.sin(na);
    }
    structures.field.geometry.attributes.position.needsUpdate=true;
  }
}
document.getElementById('ce-mode').addEventListener('change',function(){mode=this.value;build()});
function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  const show=mode==='eletromagnetico'?STRUCTS.filter(s=>s.id!=='charges'&&s.id!=='magnet'):mode==='magnetico'?STRUCTS.filter(s=>s.id!=='charges'):STRUCTS.filter(s=>s.id!=='magnet');
  for(const s of show){
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
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ffcc00':'var(--border-color)'};background:${s===speedMul?'rgba(255,204,0,0.15)':'transparent'};color:${s===speedMul?'#ffcc00':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ffcc00';sb.style.background='rgba(255,204,0,0.15)';sb.style.color='#ffcc00'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={charges:'Cargas elétricas positivas e negativas gerando campo.',field:'Região onde forças elétricas/magnéticas atuam.',vectors:'Vetores de força do campo elétrico.',magnet:'Ímã com polos norte e sul e linhas de campo magnético.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Eletromagnetismo.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const meshes=[];for(const v of Object.values(structures)){if(v&&v.isMesh)meshes.push(v);if(v&&v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)})}
  const h=rc.intersectObjects(meshes,false);
  if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null);
});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('⚡ Campos Eletromagnéticos carregado!');
