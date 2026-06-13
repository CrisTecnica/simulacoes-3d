const STRUCTS=[
  {id:'object',name:'Objeto Relativístico',color:'#aa44ff'},
  {id:'grid',name:'Grade Espacial',color:'#6644aa'},
  {id:'light',name:'Cono de Luz',color:'#ffdd44'},
  {id:'reference',name:'Referencial',color:'#44aaff'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x04020a);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,6,12);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=20;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,6,12);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221144,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},speedMul=1,mode='lorentz';const speed=0.8;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};

  // Grid
  const grid=new THREE.GridHelper(12,12,0x6644aa,0x332266);grid.userData.org='grid';grid.position.y=-1;
  mainGroup.add(grid);structures.grid=grid;

  if(mode==='lorentz'){
    const gamma=1/Math.sqrt(1-speed*speed);
    // Rest frame cube
    const cubeR=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,1.5),new THREE.MeshStandardMaterial({color:0x44aaff,transparent:true,opacity:0.3,wireframe:true}));
    cubeR.position.set(-3,0,0);cubeR.userData.org='reference';mainGroup.add(cubeR);structures.reference=cubeR;

    // Moving cube (contracted)
    const cubeM=new THREE.Mesh(new THREE.BoxGeometry(1.5/gamma,1.5,1.5),new THREE.MeshStandardMaterial({color:0xaa44ff,transparent:true,opacity:0.6}));
    cubeM.position.set(4,0,0);cubeM.userData={gamma,baseX:4};cubeM.userData.org='object';
    mainGroup.add(cubeM);structures.object=cubeM;

    // Particles showing contraction
    const n=500;const pos=new Float32Array(n*3),col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const x=(Math.random()-0.5)*3,y=(Math.random()-0.5)*1.5,z=(Math.random()-0.5)*1.5;
      pos[i*3]=x+4;pos[i*3+1]=y;pos[i*3+2]=z;
      col[i*3]=0.7;col[i*3+1]=0.3;col[i*3+2]=1;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:0.03,vertexColors:true,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));
    pts.userData.org='object';mainGroup.add(pts);

  } else if(mode==='time'){
    // Light clock
    const mirror1=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),new THREE.MeshBasicMaterial({color:0x888888,side:THREE.DoubleSide}));
    mirror1.position.set(-3,1.5,0);mirror1.userData.org='object';mainGroup.add(mirror1);
    const mirror2=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),new THREE.MeshBasicMaterial({color:0x888888,side:THREE.DoubleSide}));
    mirror2.position.set(-3,-1.5,0);mirror2.userData.org='object';mainGroup.add(mirror2);

    // Moving clock
    const m1=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),new THREE.MeshBasicMaterial({color:0xaa44ff,side:THREE.DoubleSide}));
    m1.position.set(3,1.5,0);m1.userData={v:speed,baseX:3};m1.userData.org='object';mainGroup.add(m1);
    const m2=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),new THREE.MeshBasicMaterial({color:0xaa44ff,side:THREE.DoubleSide}));
    m2.position.set(3,-1.5,0);m2.userData={v:speed,baseX:3};m2.userData.org='object';mainGroup.add(m2);

    // Light pulse dots
    const pulseGeo=new THREE.BufferGeometry();
    pulseGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6*3),3));
    const pulseMat=new THREE.PointsMaterial({color:0xffdd44,size:0.1,transparent:true,opacity:0.8});
    const pulse=new THREE.Points(pulseGeo,pulseMat);pulse.frustumCulled=false;pulse.userData.org='light';
    mainGroup.add(pulse);structures.light=pulse;

  } else {
    // Light cone
    const nPts=2000;const pos=new Float32Array(nPts*3),col=new Float32Array(nPts*3);
    for(let i=0;i<nPts;i++){
      const t=Math.random()*3;const theta=Math.random()*Math.PI*2;const r=t;
      const x=r*Math.cos(theta),z=r*Math.sin(theta),y=t-1.5;
      pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;
      const c=new THREE.Color().setHSL(0.12,0.8,0.5-Math.random()*0.3);
      col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:0.04,vertexColors:true,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false}));
    pts.userData.org='light';mainGroup.add(pts);structures.light=pts;

    // World line
    const wlPts=[];for(let i=0;i<=50;i++){const t=i/50*3;wlPts.push(0,t-1.5,0)}
    const wlGeo=new THREE.BufferGeometry();wlGeo.setAttribute('position',new THREE.Float32BufferAttribute(wlPts.flat(),3));
    const wl=new THREE.Line(wlGeo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.5}));
    wl.userData.org='object';mainGroup.add(wl);structures.object=wl;
  }
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul;
  if(mode==='time'&&structures.light){
    const pos=structures.light.geometry.attributes.position.array;
    const phase=time*2*speed;
    // Rest clock
    pos[0]=-3;pos[1]=1.5-Math.abs(Math.sin(phase))*3;pos[2]=0;
    pos[3]=-3;pos[4]=-1.5+Math.abs(Math.sin(phase))*3;pos[5]=0;
    // Moving clock (dilated)
    const gamma=1/Math.sqrt(1-speed*speed);
    const phase2=time*2*speed/gamma;
    pos[6]=3;pos[7]=1.5-Math.abs(Math.sin(phase2))*3;pos[8]=0;
    pos[9]=3;pos[10]=-1.5+Math.abs(Math.sin(phase2))*3;pos[11]=0;
    structures.light.geometry.attributes.position.needsUpdate=true;
  }
  if(mode==='lorentz'&&structures.object){
    const gamma=1/Math.sqrt(1-speed*speed);
    const phase=0.5+0.5*Math.sin(time*0.5);
    const scale=1/gamma+(1-1/gamma)*phase;
    if(structures.object.isMesh)structures.object.scale.x=scale;
  }
}
document.getElementById('rel-mode').addEventListener('change',function(){mode=this.value;build()});

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
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#aa44ff':'var(--border-color)'};background:${s===speedMul?'rgba(170,68,255,0.15)':'transparent'};color:${s===speedMul?'#aa44ff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#aa44ff';sb.style.background='rgba(170,68,255,0.15)';sb.style.color='#aa44ff'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={object:'Corpo movendo-se a fração significativa da velocidade da luz.',grid:'Grade representando o espaço-tempo de referência.',light:'Frente de onda luminosa propagando-se à velocidade c.',reference:'Referencial inercial em repouso.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Relatividade.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('⚡ Relatividade carregado!');
