const STRUCTS=[
  {id:'nuclei',name:'Núcleos',color:'#44ff88'},
  {id:'decayed',name:'Núcleos Decaídos',color:'#ff6644'},
  {id:'radiation',name:'Radiação',color:'#ffdd44'},
  {id:'chart',name:'Gráfico',color:'#4488ff'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000a04);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,6,10);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=20;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,6,10);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x112211,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},nuclei={},speedMul=1,mode='alfa',halfLife=5;
let remaining=0,decayed=0;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};nuclei={};

  const n=mode==='cadeia'?300:800;
  const pos=new Float32Array(n*3),col=new Float32Array(n*3);
  const states=new Float32Array(n);
  const types=new Uint8Array(n);

  for(let i=0;i<n;i++){
    const theta=Math.random()*Math.PI*2;const phi=Math.acos(2*Math.random()-1);
    const r=0.5+Math.pow(Math.random(),0.5)*4;
    pos[i*3]=r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1]=(Math.random()-0.5)*2;
    pos[i*3+2]=r*Math.sin(phi)*Math.sin(theta);
    col[i*3]=0.3;col[i*3+1]=1;col[i*3+2]=0.5;
    states[i]=0; // 0=stable, 1=decayed
    types[i]=Math.floor(Math.random()*3);
  }

  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({
    size:0.08,vertexColors:true,transparent:true,opacity:0.8,
    blending:THREE.AdditiveBlending,depthWrite:false
  });
  const pts=new THREE.Points(geo,mat);
  pts.userData={states,types,remaining:n,decayed:0};
  mainGroup.add(pts);structures.nuclei=pts;
  remaining=n;decayed=0;

  // Decay products (particles shot out)
  const dp=new THREE.BufferGeometry();
  dp.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(200*3),3));
  const dpMat=new THREE.PointsMaterial({
    color:0xffdd44,size:0.04,transparent:true,opacity:0.6,
    blending:THREE.AdditiveBlending,depthWrite:false
  });
  const decPts=new THREE.Points(dp,dpMat);
  decPts.frustumCulled=false;decPts.userData.pts=[];decPts.userData.org='radiation';
  mainGroup.add(decPts);structures.radiation=decPts;

  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul;
  if(structures.nuclei){
    const pos=structures.nuclei.geometry.attributes.position;
    const col=structures.nuclei.geometry.attributes.color;
    const arr=pos.array,carr=col.array;
    const states=structures.nuclei.userData.states;
    const types=structures.nuclei.userData.types;
    const n=arr.length/3;

    const decayProb=spd/(halfLife*2);
    let r=0,d=0;
    for(let i=0;i<n;i++){
      if(states[i]===0){
        r++;
        if(mode==='cadeia'){
          if(states[i]===0&&Math.random()<decayProb*0.5){states[i]=1;d++}
        } else {
          if(Math.random()<decayProb*0.3){states[i]=1;d++}
        }
      } else {
        d++;
        // Glow effect for decayed
        const pulse=0.3+0.7*(0.5+0.5*Math.sin(time*3+i));
        carr[i*3]=pulse;carr[i*3+1]=0.3*pulse;carr[i*3+2]=0.2*pulse;
        // Eject particle
        if(mode==='alfa'||mode==='cadeia'){
          arr[i*3]+=Math.sin(time+i)*spd*0.1;
          arr[i*3+1]+=Math.cos(time+i*2)*spd*0.1;
          arr[i*3+2]+=Math.sin(time*0.5+i*3)*spd*0.1;
        }
      }
    }
    remaining=r;decayed=d;
    document.getElementById('stats').textContent=`${r} estáveis | ${d} decaídos | ${(r/(r+d)*100).toFixed(1)}%`;
    pos.needsUpdate=true;col.needsUpdate=true;
  }
}
document.getElementById('dec-mode').addEventListener('change',function(){mode=this.value;build()});
document.getElementById('meia-vida').addEventListener('input',function(){halfLife=parseFloat(this.value)});

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
  mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});
  mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});
  mk('Resetar Câmera','',resetCamera);mk('Reiniciar','btn-warning',()=>{build()});
  const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';
  for(const s of[0.5,1,3,10]){
    const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#44ff88':'var(--border-color)'};background:${s===speedMul?'rgba(68,255,136,0.15)':'transparent'};color:${s===speedMul?'#44ff88':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#44ff88';sb.style.background='rgba(68,255,136,0.15)';sb.style.color='#44ff88'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={nuclei:'Núcleos atômicos instáveis que ainda não decaíram.',decayed:'Núcleos que já sofreram decaimento radioativo.',radiation:'Partículas alfa, beta ou raios gama emitidos no decaimento.',chart:'Curva exponencial de decaimento ao longo do tempo.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Física Nuclear.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('☢️ Decaimento carregado!');
