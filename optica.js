const STRUCTS=[
  {id:'lens',name:'Lente/Espelho',color:'#00ddff'},
  {id:'rays',name:'Raios de Luz',color:'#ffdd00'},
  {id:'focus',name:'Foco',color:'#ff4444'},
  {id:'object',name:'Objeto',color:'#ffffff'},
  {id:'image',name:'Imagem',color:'#ff88aa'},
];
const container=document.getElementById('canvas-container');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x000a0a);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,3,10);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=20;
controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,3,10);
function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x111122,.15));
scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(0,5,2));

const mainGroup=new THREE.Group();scene.add(mainGroup);
let structures={},rayLines=[],speedMul=1,mode='lente',focal=2.5;

function build(){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};rayLines=[];

  if(mode==='prisma'){
    // Triangular prism
    const shape=new THREE.Shape();
    shape.moveTo(0,1.5);shape.lineTo(-1.5,-1.5);shape.lineTo(1.5,-1.5);shape.closePath();
    const geo=new THREE.ShapeGeometry(shape);
    const mat=new THREE.MeshStandardMaterial({color:0x00ddff,transparent:true,opacity:0.3,side:THREE.DoubleSide});
    const prism=new THREE.Mesh(geo,mat);prism.userData.org='lens';mainGroup.add(prism);structures.lens=prism;

    // Light rays entering and exiting with refraction
    const colors=[0xff4444,0x44ff44,0x4444ff];
    for(let c=0;c<3;c++){
      const pts=[];const yOff=(c-1)*0.8;
      for(let i=0;i<60;i++){
        const t=i/60;const x=-5+9*t;
        let y=(yOff+0.3*Math.sin(t*3));
        if(x>-1.5&&x<1.5)y=yOff+0.3*Math.sin(t*3)+0.2*(x+1.5)*c;
        pts.push(x,y,0);
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
      const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:colors[c],transparent:true,opacity:0.6}));
      line.userData.org='rays';mainGroup.add(line);rayLines.push(line);
    }
  } else {
    const isLens=mode.startsWith('lente');
    const isConvex=mode==='lente';
    // Lens/ Mirror
    const lensGeo=new THREE.CylinderGeometry(2.5,2.5,0.15,24,1,true);
    const lensMat=new THREE.MeshStandardMaterial({
      color:0x00ddff,transparent:true,opacity:0.2,side:THREE.DoubleSide,
      metalness:isLens?0:0.5,roughness:isLens?0:0.3
    });
    const lens=new THREE.Mesh(lensGeo,lensMat);
    if(isLens)lens.rotation.z=Math.PI/2;
    lens.position.set(0,0,0);lens.userData.org='lens';mainGroup.add(lens);structures.lens=lens;

    // Focal points
    for(const s of[-1,1]){
      const f=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),new THREE.MeshBasicMaterial({color:0xff4444}));
      f.position.set(s*focal,0,0);f.userData.org='focus';mainGroup.add(f);
    }
    const centerF=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),new THREE.MeshBasicMaterial({color:0xff8888}));
    centerF.position.set(0,0,0);centerF.userData.org='focus';mainGroup.add(centerF);

    // Object (arrow)
    const objGroup=new THREE.Group();objGroup.userData.org='object';
    const stem=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.2,0.05),new THREE.MeshBasicMaterial({color:0xffffff}));
    stem.position.set(-4,0.6,0);objGroup.add(stem);
    const head=new THREE.Mesh(new THREE.ConeGeometry(0.15,0.3,6),new THREE.MeshBasicMaterial({color:0xffffff}));
    head.position.set(-4,1.3,0);head.rotation.z=0;objGroup.add(head);
    mainGroup.add(objGroup);structures.object=objGroup;

    // Light rays
    const nRays=7;const rayData=[];
    for(let i=0;i<nRays;i++){
      const y=-1.2+i*2.4/(nRays-1);
      const pts=[];const segs=80;
      for(let j=0;j<=segs;j++){
        const t=j/segs;const x=-5+10*t;
        pts.push(x,y,0);
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
      const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xffdd00,transparent:true,opacity:0.4}));
      line.frustumCulled=false;line.userData={origY:y,idx:i};
      line.userData.org='rays';mainGroup.add(line);rayLines.push(line);rayData.push(line);
    }

    // Image
    const imgGroup=new THREE.Group();imgGroup.userData.org='image';
    const iStem=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.01,0.05),new THREE.MeshBasicMaterial({color:0xff88aa}));
    iStem.position.set(3,0,0);imgGroup.add(iStem);
    const iHead=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.2,6),new THREE.MeshBasicMaterial({color:0xff88aa}));
    iHead.position.set(3,0.1,0);imgGroup.add(iHead);
    mainGroup.add(imgGroup);structures.image=imgGroup;
  }
  updateUI();
}

function update(time,delta){
  const spd=delta*speedMul;
  if(!mode.startsWith('prisma')){
    for(const line of rayLines){
      if(!line||!line.userData)continue;
      const y=line.userData.origY||0;
      const pos=line.geometry.attributes.position.array;
      const n=pos.length/3;
      for(let i=0;i<n;i++){
        const t=i/(n-1);const x=-5+10*t;
        pos[i*3]=x;pos[i*3+2]=0;
        if(x<0){
          // Before lens: straight line
          pos[i*3+1]=y+(x+5)/5*1.2;
        } else {
          // After lens: converge/diverge
          const f=mode==='lente'?focal:-focal;
          const h=y+1.2;
          const imgY=h*(1-x/(f*0.5));
          pos[i*3+1]=Math.abs(imgY)<0.05?0.05:imgY;
        }
      }
      line.geometry.attributes.position.needsUpdate=true;
    }
  }
}
document.getElementById('opt-mode').addEventListener('change',function(){mode=this.value;build()});
document.getElementById('focal-slider').addEventListener('input',function(){focal=parseFloat(this.value);build()});

function updateUI(){
  const list=document.getElementById('structure-list');list.innerHTML='';
  for(const s of STRUCTS){
    const item=document.createElement('label');item.className='structure-item';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
    const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;
    const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;
    item.append(cb,dot,lbl);
    cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id)){if(v instanceof THREE.Group)v.visible=cb.checked;else v.visible=cb.checked}});
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
    sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#00ddff':'var(--border-color)'};background:${s===speedMul?'rgba(0,221,255,0.15)':'transparent'};color:${s===speedMul?'#00ddff':'var(--text-primary)'}`;
    sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#00ddff';sb.style.background='rgba(0,221,255,0.15)';sb.style.color='#00ddff'});
    sr.appendChild(sb);
  }
  bg.appendChild(sr);
}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={lens:'Lente ou espelho que refrata/reflete a luz alterando sua trajetória.',rays:'Raios de luz paralelos que incidem no elemento óptico.',focus:'Ponto onde os raios convergem ou de onde divergem.',object:'Objeto posicionado diante do elemento óptico.',image:'Imagem formada pela refração/reflexão da luz.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Óptica.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});
const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build();animate();
console.log('🔦 Óptica carregado!');
