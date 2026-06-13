const STRUCTS=[
  {id:'pendulo',name:'Pêndulo',color:'#44ccff'},
  {id:'trail',name:'Trajetória',color:'#88ddff'},
  {id:'support',name:'Suporte',color:'#6688aa'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000a0f);
const camera=new THREE.PerspectiveCamera(55,W(),H());camera.position.set(3,4,6);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=1;controls.maxDistance=20;controls.target.set(0,1,0);controls.update();
const DEF_CAM=new THREE.Vector3(3,4,6);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,1,0);controls.update()}
scene.add(new THREE.AmbientLight(0x222244,.2));
scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},pendData=[],trailPts=[],speedMul=1,mode='simple';

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};pendData=[];trailPts=[];

  const counts=mode==='simple'?1:mode==='double'?2:3;
  // Support bar
  const bar=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.08,0.08),new THREE.MeshStandardMaterial({color:0x6688aa,metalness:0.3,roughness:0.4}));
  bar.position.y=2.8;bar.userData.org='support';mainGroup.add(bar);structures.support=bar;

  for(let i=0;i<counts;i++){
    const ox=i*(mode==='simple'?0:-1.5+3*i/(counts-1||1));
    const len=1.5+Math.random()*0.3;
    const mass=new THREE.Mesh(new THREE.SphereGeometry(0.15+i*0.03,12,8),
      new THREE.MeshStandardMaterial({color:0x44ccff,metalness:0.1,roughness:0.2,emissive:0x44ccff,emissiveIntensity:0.1}));
    mass.position.set(ox,2.8-len,0);
    mass.userData={ox,startY:2.8,len:len,angle:Math.PI/3+Math.random()*0.5,vel:0,idx:i};
    mainGroup.add(mass);structures['pendulo'+(i+1)]=mass;pendData.push(mass);

    // String
    const pts=[];
    for(let j=0;j<=10;j++){const t=j/10;pts.push(ox*t,2.8*(1-t)+mass.position.y*t,0)}
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    const sm=new THREE.LineBasicMaterial({color:0x88ccff,transparent:true,opacity:0.5});
    const line=new THREE.Line(sg,sm);line.userData.org='support';mainGroup.add(line);
  }

  // Trail
  const tg=new THREE.BufferGeometry();
  tg.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(150*3),3));
  const tm=new THREE.LineBasicMaterial({color:0x88ddff,transparent:true,opacity:0.3});
  const trail=new THREE.Line(tg,tm);trail.frustumCulled=false;trail.userData.org='trail';
  mainGroup.add(trail);structures.trail=trail;
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul*2;
  for(const p of pendData){
    const d=p.userData;
    let a=d.angle,g=9.8;
    if(mode==='simple'){
      const alpha=-(g/d.len)*Math.sin(a);
      d.vel+=alpha*spd;d.vel*=0.998;
      d.angle+=d.vel*spd;
    } else {
      // Double/triple: coupled pendulums with interaction
      const alpha=-(g/d.len)*Math.sin(a)+0.1*Math.sin(time*0.5+d.idx*1.5);
      d.vel+=alpha*spd;d.vel*=0.997;
      d.angle+=d.vel*spd;
    }
    const x=d.ox+d.len*Math.sin(d.angle);
    const y=d.startY-d.len*Math.cos(d.angle);
    p.position.set(x,y,0);
  }

  // Trail (track first pendulum)
  if(pendData.length&&structures.trail){
    const tp=structures.trail.geometry.attributes.position.array;
    const p=pendData[0].position;
    trailPts.push(new THREE.Vector3(p.x,p.y,0));
    if(trailPts.length>150)trailPts.shift();
    for(let i=0;i<trailPts.length;i++){tp[i*3]=trailPts[i].x;tp[i*3+1]=trailPts[i].y;tp[i*3+2]=trailPts[i].z}
    for(let i=trailPts.length;i<150;i++){tp[i*3]=0;tp[i*3+1]=-999;tp[i*3+2]=0}
    structures.trail.geometry.attributes.position.needsUpdate=true;
  }
}

document.getElementById('pd-mode').addEventListener('change',function(){mode=this.value;build()});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{
      for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id)||(s.id==='pendulo'&&k.startsWith('pendulo')))v.visible=cb.checked;
    });
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};
  mk('Mostrar Tudo','btn-primary',()=>{
    for(const g of Object.values(structures))if(g.isObject3D)g.visible=true;
    document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true);
  });
  mk('Ocultar Tudo','btn-danger',()=>{
    for(const g of Object.values(structures))if(g.isObject3D)g.visible=false;
    document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false);
  });
  mk('Resetar Câmera','',resetCamera);
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.5,1,3,10]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#44ccff':'var(--border-color)'};background:${s===speedMul?'rgba(68,204,255,0.15)':'transparent'};color:${s===speedMul?'#44ccff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{
      speedMul=s;
      sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});
      sb.style.borderColor='#44ccff';sb.style.background='rgba(68,204,255,0.15)';sb.style.color='#44ccff';
    });
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}

const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={pendulo:'Massa presa a um fio que oscila sob ação da gravidade.',trail:'Registro do caminho percorrido pelo pêndulo.',support:'Ponto de fixação e suporte do pêndulo.'};
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
console.log('⏱️ Pêndulos carregado!');
