const STRUCTS=[{id:'atom',name:'Átomo',color:'#ff44ff'},{id:'levels',name:'Níveis de Energia',color:'#44ddff'},{id:'spectrum',name:'Espectro',color:'#ffdd44'},{id:'electrons',name:'Elétrons',color:'#ffff44'}];
const SPECTRA={H:{name:'Hidrogênio',lines:[[410,410,'#8a2be2'],[434,434,'#0000ff'],[486,486,'#00ff88'],[656,656,'#ff0000']],desc:'Espectro de emissão do hidrogênio. Série de Balmer.'},
  He:{name:'Hélio',lines:[[447,447,'#8844ff'],[501,501,'#44ff44'],[587,587,'#ffff00'],[667,667,'#ff4444'],[706,706,'#ff44ff']],desc:'Espectro do hélio com linhas características.'},
  Na:{name:'Sódio',lines:[[589,589,'#ffaa00'],[589.6,590,'#ff8800']],desc:'Linha D do sódio (dupleto amarelo). Usado em lâmpadas de vapor.'},
  Fe:{name:'Ferro',lines:[[372,372,'#8844ff'],[382,382,'#4444ff'],[404,404,'#6644cc'],[438,438,'#4488ff'],[527,527,'#44ff88'],[561,561,'#88ff44'],[649,649,'#ff4444']],desc:'Espectro complexo do ferro com muitas linhas de absorção.'},
  Ne:{name:'Neônio',lines:[[540,540,'#44ff44'],[585,585,'#ffaa00'],[614,614,'#ff4400'],[638,638,'#ff0000'],[650,650,'#ff0044'],[671,671,'#ff4488'],[692,692,'#ff4488'],[703,703,'#ff88aa']],desc:'Gás nobre usado em lâmpadas neon. Espectro rico na região visível.'}};
const container=document.getElementById('canvas-container');const scene=new THREE.Scene();scene.background=new THREE.Color(0x040208);
const camera=new THREE.PerspectiveCamera(50,W(),H());camera.position.set(0,5,10);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,2));
container.appendChild(renderer.domElement);
function W(){return container.clientWidth}function H(){return container.clientHeight}
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=3;controls.maxDistance=15;controls.target.set(0,0,0);controls.update();
const DEF_CAM=new THREE.Vector3(0,5,10);function resetCamera(){camera.position.copy(DEF_CAM);controls.target.set(0,0,0);controls.update()}
scene.add(new THREE.AmbientLight(0x221133,.2));scene.add(new THREE.DirectionalLight(0xffffff,.3).position.set(2,5,3));
const mainGroup=new THREE.Group();scene.add(mainGroup);let structures={},speedMul=1,currentElem='H';

function build(elem){
  while(mainGroup.children.length){const c=mainGroup.children[0];mainGroup.remove(c);if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()}
  structures={};
  const sp=SPECTRA[elem]||SPECTRA.H;
  // Atom nucleus
  const nucleus=new THREE.Mesh(new THREE.SphereGeometry(0.3,16,12),new THREE.MeshStandardMaterial({color:0xff44ff,emissive:0xff44ff,emissiveIntensity:0.1}));
  nucleus.userData.org='atom';mainGroup.add(nucleus);structures.atom=nucleus;
  // Energy levels (orbits)
  const levelsG=new THREE.Group();levelsG.userData.org='levels';
  for(let i=1;i<=4;i++){const pts=[];for(let a=0;a<=32;a++){const ang=a/32*Math.PI*2;pts.push(i*0.8*Math.cos(ang),0,i*0.8*Math.sin(ang))}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x44ddff,transparent:true,opacity:0.15}));levelsG.add(line)}
  mainGroup.add(levelsG);structures.levels=levelsG;
  // Electrons on orbits
  const eG=new THREE.Group();eG.userData.org='electrons';
  for(let i=1;i<=4;i++){const e=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,4),new THREE.MeshBasicMaterial({color:0xffff44}));e.userData={orbit:i,angle:Math.random()*Math.PI*2,speed:1.5-i*0.2};eG.add(e)}
  mainGroup.add(eG);structures.electrons=eG;
  // Spectrum lines (bars in 3D space)
  const sG=new THREE.Group();sG.userData.org='spectrum';
  const barW=6;const barH=0.4;const waveRange=800-350;
  for(const line of sp.lines){const nm=line[0];const x=(nm-350)/waveRange*barW-barW/2;const bar=new THREE.Mesh(new THREE.BoxGeometry(0.08,barH,0.08),new THREE.MeshBasicMaterial({color:new THREE.Color(line[2])}));bar.position.set(x,0,0);bar.userData.nm=nm;sG.add(bar)}
  sG.position.y=2;mainGroup.add(sG);structures.spectrum=sG;
  // Background rainbow bar
  const nStripes=100;for(let i=0;i<nStripes;i++){const x=(i/nStripes)*barW-barW/2;const hue=i/nStripes*0.8;const c=new THREE.Color().setHSL(hue,0.9,0.5);const strip=new THREE.Mesh(new THREE.BoxGeometry(barW/nStripes,0.02,0.3),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.15}));strip.position.set(x,-0.2,0);sG.add(strip)}
  updateUI();
}
function update(time,delta){const spd=delta*speedMul;if(structures.electrons){structures.electrons.children.forEach((e,i)=>{const d=e.userData;if(d){d.angle+=spd*d.speed*0.5;e.position.set(d.orbit*0.8*Math.cos(d.angle),0.1*Math.sin(time+i),d.orbit*0.8*Math.sin(d.angle))}})}}
document.getElementById('elem-select').addEventListener('change',function(){currentElem=this.value;build(currentElem)});
function updateUI(){const list=document.getElementById('structure-list');list.innerHTML='';for(const s of STRUCTS){const item=document.createElement('label');item.className='structure-item';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;const dot=document.createElement('span');dot.className='color-dot';dot.style.background=s.color;const lbl=document.createElement('span');lbl.className='structure-label';lbl.textContent=s.name;item.append(cb,dot,lbl);cb.addEventListener('change',()=>{for(const[k,v]of Object.entries(structures))if(k.startsWith(s.id))v.visible=cb.checked});list.appendChild(item)}const bg=document.getElementById('btn-group');bg.innerHTML='';const mk=(t,c,fn)=>{const b=document.createElement('button');b.className='btn '+c;b.textContent=t;b.addEventListener('click',fn);bg.appendChild(b)};mk('Mostrar Tudo','btn-primary',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=true;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=true)});mk('Ocultar Tudo','btn-danger',()=>{for(const g of Object.values(structures))if(g.isObject3D||g.isPoints)g.visible=false;document.querySelectorAll('#structure-list input').forEach(c=>c.checked=false)});mk('Resetar Câmera','',resetCamera);const sr=document.createElement('div');sr.style.cssText='display:flex;gap:4px;width:100%';for(const s of[0.5,1,3,10]){const sb=document.createElement('button');sb.className='btn';sb.textContent=s+'\u00d7';sb.style.cssText=`flex:1;padding:6px 2px;font-size:9px;border-color:${s===speedMul?'#ff44ff':'var(--border-color)'};background:${s===speedMul?'rgba(255,68,255,0.15)':'transparent'};color:${s===speedMul?'#ff44ff':'var(--text-primary)'}`;sb.addEventListener('click',()=>{speedMul=s;sr.querySelectorAll('button').forEach(b=>{b.style.borderColor='var(--border-color)';b.style.background='transparent';b.style.color='var(--text-primary)'});sb.style.borderColor='#ff44ff';sb.style.background='rgba(255,68,255,0.15)';sb.style.color='#ff44ff'});sr.appendChild(sb)};bg.appendChild(sr)}
const ip=document.getElementById('info-panel'),iN=document.getElementById('info-name'),iD=document.getElementById('info-description'),iF=document.getElementById('info-function');
const INFO={atom:'Núcleo atômico com prótons e nêutrons.',levels:'Níveis de energia quantizados ao redor do núcleo.',spectrum:'Espectro de emissão/absorção característico.',electrons:'Elétrons orbitando em níveis discretos de energia.'};
function highlight(id){if(!id){ip.classList.remove('visible');return}const s=STRUCTS.find(x=>x.id===id);if(!s)return;iN.textContent=s.name;iD.textContent=INFO[id]||'';iF.textContent='Física Atômica.';ip.classList.add('visible')}
renderer.domElement.addEventListener('pointerdown',(e)=>{const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(p,camera);const meshes=[];for(const v of Object.values(structures))if(v&&v.isMesh)meshes.push(v);const h=rc.intersectObjects(meshes,false);if(h.length){let o=h[0].object;while(o){if(o.userData.org){highlight(o.userData.org);return}o=o.parent}}highlight(null)});
window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H())});const sc=new THREE.Clock();
function animate(){requestAnimationFrame(animate);controls.update();update(sc.getElapsedTime(),sc.getDelta());renderer.render(scene,camera)}
build('H');animate();
console.log('🌈 Espectros carregado!');
