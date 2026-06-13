const STRUCTS=[
  {id:'sources',name:'Fontes',color:'#00ccff'},
  {id:'waves',name:'Cristas de Onda',color:'#44ddff'},
  {id:'interference',name:'Interferência',color:'#ff6644'},
  {id:'medium',name:'Meio',color:'#004466'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000610);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,8,10);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=30;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,8,10);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112244,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(0,10,5));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},waveParticles=[],speedMul=1,freq=1,wavelength=0.8,mode='duas';

class WaveSource{
  constructor(x,z,phase=0){this.x=x;this.z=z;this.phase=phase}
}

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};waveParticles=[];

  const sources=[];
  if(mode==='unica'){sources.push(new WaveSource(0,0))}
  else if(mode==='duas'){sources.push(new WaveSource(-2,0),new WaveSource(2,0,Math.PI))}
  else if(mode==='fenda'){sources.push(new WaveSource(-0.8,0),new WaveSource(0.8,0))}
  else{sources.push(new WaveSource(-3,0),new WaveSource(-1,0),new WaveSource(1,0),new WaveSource(3,0))}

  // Source spheres
  const sg=new THREE.Group();sg.userData.org='sources';
  for(const s of sources){
    const sp=new THREE.Mesh(new THREE.SphereGeometry(0.2,12,8),new THREE.MeshBasicMaterial({color:0x00ccff}));
    sp.position.set(s.x,0,s.z);sg.add(sp);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,8),new THREE.MeshBasicMaterial({color:0x00ccff,transparent:true,opacity:0.2}));
    glow.position.set(s.x,0,s.z);sg.add(glow);
  }
  mainGroup.add(sg);structures.sources=sg;

  // Wave particles grid
  const n=80;const total=n*n;
  const pos=new Float32Array(total*3),col=new Float32Array(total*3);
  for(let ix=0;ix<n;ix++)for(let iz=0;iz<n;iz++){
    const x=(ix/n-0.5)*14,z=(iz/n-0.5)*14;
    const i=ix*n+iz;
    pos[i*3]=x;pos[i*3+1]=0;pos[i*3+2]=z;
    col[i*3]=0.2;col[i*3+1]=0.5;col[i*3+2]=0.8;
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:0.04,vertexColors:true,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false});
  const pts=new THREE.Points(geo,mat);pts.userData.org='medium';pts.userData.sources=sources;
  pts.frustumCulled=false;
  mainGroup.add(pts);structures.medium=pts;waveParticles.push(pts);
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul*0.5;
  if(structures.medium){
    const pos=structures.medium.geometry.attributes.position;
    const col=structures.medium.geometry.attributes.color;
    const arr=pos.array,carr=col.array;
    const sources=structures.medium.userData.sources;
    const n=arr.length/3;
    for(let i=0;i<n;i++){
      let sum=0;
      for(const s of sources){
        const dx=arr[i*3]-s.x,dz=arr[i*3+2]-s.z;
        const d=Math.sqrt(dx*dx+dz*dz)+0.01;
        sum+=Math.sin(d/wavelength-freq*time*2+s.phase)/d;
      }
      const h=sum*0.3;
      arr[i*3+1]=h;
      const intensity=Math.min(1,(h+0.5)*0.8);
      const hue=0.55+h*0.15;
      const c=new THREE.Color().setHSL(0.55-h*0.1,0.8,0.3+intensity*0.5);
      carr[i*3]=c.r;carr[i*3+1]=c.g;carr[i*3+2]=c.b;
    }
    pos.needsUpdate=true;col.needsUpdate=true;
  }
  // Source glow pulse
  if(structures.sources){
    structures.sources.children.forEach((ch,i)=>{
      if(i%2===1){const s=1+0.2*Math.sin(time*3+i);ch.scale.set(s,s,s);ch.material.opacity=0.1+0.15*Math.sin(time*3+i)}
    });
  }
}

document.getElementById('ond-mode').addEventListener('change',function(){mode=this.value;build()});
document.getElementById('freq-slider').addEventListener('input',function(){freq=parseFloat(this.value)});
document.getElementById('wl-slider').addEventListener('input',function(){wavelength=parseFloat(this.value)});

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
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#00ccff':'var(--border-color)'};background:${s===speedMul?'rgba(0,204,255,0.15)':'transparent'};color:${s===speedMul?'#00ccff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#00ccff';sb.style.background='rgba(0,204,255,0.15)';sb.style.color='#00ccff'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}

const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={sources:'Pontos de emissão de ondas coerentes.',waves:'Cristas e vales das ondas se propagando.',interference:'Padrão de interferência construtiva e destrutiva.',medium:'Meio de propagação das ondas.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Ondulatória.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{
  const r=renderer.domElement.getBoundingClientRect();
  const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);
  const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);if(v&&v.isGroup)v.children.forEach(c=>{if(c.isMesh)meshes.push(c)});
  const h=rc.intersectObjects(meshes,false);
  if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null);
});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🌊 Ondas carregado!');
