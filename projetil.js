const STRUCTS=[
  {id:'projeteis',name:'Projéteis',color:'#ff8800'},
  {id:'trajetorias',name:'Trajetórias',color:'#ffcc44'},
  {id:'solo',name:'Solo',color:'#446644'},
  {id:'alvo',name:'Alvo',color:'#ff4444'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0806);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,8,15);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=5;controls.maxDistance=30;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,8,15);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x222211,.2));
scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(5,10,5));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},trails=[],projs=[],speedMul=1,mode='normal',angle=45,vel=20;
let fireFlag=true;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};trails=[];projs=[];fireFlag=true;

  // Ground
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(20,12),new THREE.MeshStandardMaterial({color:0x224422,roughness:0.8}));
  ground.rotation.x=-Math.PI/2;ground.position.z=-2;ground.userData.org='solo';
  mainGroup.add(ground);structures.solo=ground;

  // Grid
  const grid=new THREE.GridHelper(20,10,0x448844,0x224422);grid.position.z=-2;grid.userData.org='solo';
  mainGroup.add(grid);

  // Target
  const target=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.5,0.3),new THREE.MeshBasicMaterial({color:0xff4444}));
  target.position.set(8,0.25,-2);target.userData.org='alvo';
  mainGroup.add(target);structures.alvo=target;

  const count=mode==='comparar'?2:1;
  for(let i=0;i<count;i++){
    const c=i===0?0xff8800:0x44aaff;
    const proj=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.1}));
    proj.position.set(-8,0,-2);proj.userData={vx:vel*Math.cos(angle*Math.PI/180),vy:vel*Math.sin(angle*Math.PI/180),x:-8,y:0,z:-2,fired:false,withAir:i===1};
    mainGroup.add(proj);projs.push(proj);

    const tg=new THREE.BufferGeometry();
    tg.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(300*3),3));
    const tl=new THREE.Line(tg,new THREE.LineBasicMaterial({color:i===0?0xff8800:0x44aaff,transparent:true,opacity:0.3}));
    tl.frustumCulled=false;tl.userData.org='trajetorias';
    mainGroup.add(tl);trails.push({line:tl,pts:[]});
  }
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul;
  for(let i=0;i<projs.length;i++){
    const p=projs[i];const d=p.userData;
    if(!d.fired&&fireFlag){
      d.fired=true;d.vx=vel*Math.cos(angle*Math.PI/180);d.vy=vel*Math.sin(angle*Math.PI/180);
    }
    if(d.fired){
      const air=d.withAir?0.02:0;
      d.vx-=d.vx*air*spd;d.vy-=9.8*spd;
      d.x+=d.vx*spd;d.y+=d.vy*spd;
      p.position.set(d.x,d.y,d.z);
      if(d.y<0){d.y=0;d.vy*=-(d.withAir?0.3:0.8);if(Math.abs(d.vy)<0.5)d.fired=false}
      if(d.x>10)d.fired=false;

      if(trails[i]){
        trails[i].pts.push(new THREE.Vector3(d.x,d.y,d.z));
        if(trails[i].pts.length>300)trails[i].pts.shift();
        const tp=trails[i].line.geometry.attributes.position.array;
        for(let j=0;j<trails[i].pts.length;j++){tp[j*3]=trails[i].pts[j].x;tp[j*3+1]=trails[i].pts[j].y;tp[j*3+2]=trails[i].pts[j].z}
        for(let j=trails[i].pts.length;j<300;j++){tp[j*3]=0;tp[j*3+1]=-999;tp[j*3+2]=0}
        trails[i].line.geometry.attributes.position.needsUpdate=true;
      }
    }
  }
}
document.getElementById('proj-mode').addEventListener('change',function(){mode=this.value;build()});
document.getElementById('angle-slider').addEventListener('input',function(){angle=parseFloat(this.value);document.getElementById('angle-val').textContent=angle+'°';build()});
document.getElementById('vel-slider').addEventListener('input',function(){vel=parseFloat(this.value);document.getElementById('vel-val').textContent=vel+' m/s';build()});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id)){if(v instanceof THREE.Group)v.children.forEach(c=>c.visible=cb.checked);else v.visible=cb.checked}});
    list.appendChild(item);
  }
  const bg=document.getElementById('btn-group');bg.innerHTML='';
  const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);mk('Lançar','btn-success',()=>{fireFlag=true;trails.forEach(t=>{t.pts=[]})});
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.1,0.5,1,3]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff8800':'var(--border-color)'};background:${s===speedMul?'rgba(255,136,0,0.15)':'transparent'};color:${s===speedMul?'#ff8800':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff8800';sb.style.background='rgba(255,136,0,0.15)';sb.style.color='#ff8800'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={projeteis:'Projéteis lançados com velocidade inicial e ângulo ajustáveis.',trajetorias:'Parábola descrita pelo projétil no plano vertical.',solo:'Superfície de referência para o lançamento.',alvo:'Ponto de impacto desejado para o projétil.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Mecânica.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🎯 Projéteis carregado!');
