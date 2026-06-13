const STRUCTS=[
  {id:'atoms',name:'Átomos',color:'#88ddff'},
  {id:'electrons',name:'Elétrons',color:'#ffdd44'},
  {id:'bonds',name:'Ligações',color:'#44aaff'},
  {id:'orbitals',name:'Orbitais',color:'#ff88aa'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x040608);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,3,6);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2;controls.maxDistance=15;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,3,6);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112244,.2));scene.add(new THREE.DirectionalLight(0xffffff,.4).position.set(2,4,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1,mode='ionica';

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  const g=new THREE.Group();mainGroup.add(g);
  if(mode==='ionica'){
    const count=5;const spacing=0.8;
    for(let ix=0;ix<count;ix++)for(let iy=0;iy<count;iy++)for(let iz=0;iz<count;iz++){
      const isNa=(ix+iy+iz)%2===0;
      const m=new THREE.Mesh(new THREE.SphereGeometry(isNa?0.3:0.25,12,8),new THREE.MeshStandardMaterial({color:isNa?0x4488ff:0x44ff88,roughness:0.3,metalness:0.2}));
      m.position.set((ix-count/2)*spacing,(iy-count/2)*spacing,(iz-count/2)*spacing);
      m.userData.org='atoms';g.add(m);
    }
    // Electron transfer visualization
    const n=200;const ep=new Float32Array(n*3);
    for(let i=0;i<n;i++){ep[i*3]=(Math.random()-0.5)*2;ep[i*3+1]=(Math.random()-0.5)*2;ep[i*3+2]=(Math.random()-0.5)*2}
    const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.BufferAttribute(ep,3));
    const em=new THREE.PointsMaterial({color:0xffdd44,size:0.03,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending});
    const epts=new THREE.Points(eg,em);epts.userData.org='electrons';g.add(epts);
  } else if(mode==='covalente'){
    const atoms=[{x:0,y:0,z:0,e:'O'},{x:0.7,y:0.5,z:0,e:'H'},{x:-0.7,y:0.5,z:0,e:'H'}];
    for(const a of atoms){
      const m=new THREE.Mesh(new THREE.SphereGeometry(a.e==='O'?0.5:0.35,16,12),new THREE.MeshStandardMaterial({color:a.e==='O'?0xff4444:0xffffff,roughness:0.3}));
      m.position.set(a.x,a.y,a.z);m.userData.org='atoms';g.add(m);
    }
    // Orbitals overlapping
    for(const s of[-1,1]){
      const o=new THREE.Mesh(new THREE.SphereGeometry(0.6,12,8),new THREE.MeshBasicMaterial({color:0x44aaff,transparent:true,opacity:0.1}));
      o.position.set(0.35*s,0.25*s,0);o.userData.org='orbitals';g.add(o);
    }
    // Shared electrons
    for(let i=0;i<5;i++){
      const e=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,4),new THREE.MeshBasicMaterial({color:0xffdd44}));
      e.position.set(0.1+i*0.05,0.1+i*0.02,0);e.userData.org='electrons';g.add(e);
      const e2=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,4),new THREE.MeshBasicMaterial({color:0xffdd44}));
      e2.position.set(-0.1-i*0.05,0.1+i*0.02,0);e2.userData.org='electrons';g.add(e2);
    }
  } else if(mode==='metalica'){
    const n=400;const pos=new Float32Array(n*3),col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      pos[i*3]=(Math.random()-0.5)*3;pos[i*3+1]=(Math.random()-0.5)*3;pos[i*3+2]=(Math.random()-0.5)*3;
      col[i*3]=0.6+Math.random()*0.3;col[i*3+1]=0.7+Math.random()*0.3;col[i*3+2]=0.8+Math.random()*0.2;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:0.06,vertexColors:true,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending}));
    pts.userData.org='atoms';g.add(pts);
    // Mobile electrons
    const ne=200;const ep2=new Float32Array(ne*3);
    for(let i=0;i<ne;i++){ep2[i*3]=(Math.random()-0.5)*3.2;ep2[i*3+1]=(Math.random()-0.5)*3.2;ep2[i*3+2]=(Math.random()-0.5)*3.2}
    const eg2=new THREE.BufferGeometry();eg2.setAttribute('position',new THREE.BufferAttribute(ep2,3));
    const epts2=new THREE.Points(eg2,new THREE.PointsMaterial({color:0xffdd44,size:0.02,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending}));
    epts2.userData.vel=[];epts2.userData.org='electrons';
    for(let i=0;i<ne;i++)epts2.userData.vel.push({x:(Math.random()-0.5)*0.3,y:(Math.random()-0.5)*0.3,z:(Math.random()-0.5)*0.3});
    g.add(epts2);
  } else {
    // Hydrogen bonds (H2O molecules)
    for(let m=0;m<6;m++){
      const angle=m*Math.PI/3;
      const r=1.8;
      const ox=r*Math.cos(angle),oz=r*Math.sin(angle);
      const o=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,8),new THREE.MeshStandardMaterial({color:0xff4444}));
      o.position.set(ox,0,oz);o.userData.org='atoms';g.add(o);
      const h1=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));
      h1.position.set(ox+0.4*Math.cos(angle+0.4),0.35,oz+0.4*Math.sin(angle+0.4));h1.userData.org='atoms';g.add(h1);
      const h2=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));
      h2.position.set(ox+0.4*Math.cos(angle-0.4),-0.35,oz+0.4*Math.sin(angle-0.4));h2.userData.org='atoms';g.add(h2);
      // H-bonds to next molecule (dashed)
      if(m<5){
        const pts=[];for(let t=0;t<=1;t+=0.1){const a2=(m+t)*Math.PI/3;pts.push(r*Math.cos(a2),0,r*Math.sin(a2))}
        const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
        const bl=new THREE.Line(bg,new THREE.LineDashedMaterial({color:0x8888ff,dashSize:0.05,gapSize:0.05,transparent:true,opacity:0.4}));
        bl.computeLineDistances();bl.userData.org='bonds';g.add(bl);
      }
    }
  }
  updateUI();
}
function update(time,delta){
  const spd=delta*speedMul;
  if(mode==='metalica'){
    for(const[k,v]of Object.entries(structures)){
      if(v&&v.isPoints&&v.userData.vel){
        const pos=v.geometry.attributes.position.array;const vel=v.userData.vel;
        for(let i=0;i<pos.length/3;i++){pos[i*3]+=vel[i].x*spd;pos[i*3+1]+=vel[i].y*spd;pos[i*3+2]+=vel[i].z*spd;if(Math.abs(pos[i*3])>1.6)vel[i].x*=-1;if(Math.abs(pos[i*3+1])>1.6)vel[i].y*=-1;if(Math.abs(pos[i*3+2])>1.6)vel[i].z*=-1}
        v.geometry.attributes.position.needsUpdate=true;
      }
    }
  }
}
document.getElementById('lig-mode').addEventListener('change',function(){mode=this.value;build()});
// [updateUI, info panel, selection, animation - standard pattern]
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked;mainGroup.children.forEach(g=>g.children.forEach(c=>{if(c.userData.org===s.id)c.visible=cb.checked}))});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const[k,v]of Object.entries(structures))if(v.isObject3D||v.isPoints)v.visible=true;mainGroup.children.forEach(g=>g.children.forEach(c=>c.visible=true));document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const[k,v]of Object.entries(structures))if(v.isObject3D||v.isPoints)v.visible=false;mainGroup.children.forEach(g=>g.children.forEach(c=>c.visible=false));document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#88ddff':'var(--border-color)'};background:${s===speedMul?'rgba(136,221,255,0.15)':'transparent'};color:${s===speedMul?'#88ddff':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#88ddff';sb.style.background='rgba(136,221,255,0.15)';sb.style.color='#88ddff'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={atoms:'Átomos dos elementos participantes da ligação.',electrons:'Elétrons de valência compartilhados ou transferidos.',bonds:'Forças que mantêm os átomos unidos na molécula.',orbitals:'Regiões de probabilidade eletrônica ao redor dos átomos.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Química.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);mainGroup.children.forEach(g=>g.children.forEach(c=>{if(c.isMesh)meshes.push(c)}));const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('⚗️ Ligações carregado!');
