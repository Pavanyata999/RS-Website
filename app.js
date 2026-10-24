/**
 * R.S. CONSTRUCTIONS — 3D PROCEDURAL ARCHITECTURAL ENGINE
 * True WebGL / Three.js KAGE-style spatial experience
 * Featuring Independent Houses, Luxury Duplex Villas & Residential Apartments
 * Spearheaded by Yata Ramchander (9440865895) & Ale Sudeesh (9550033661)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Set current year in footer
  const footYear = document.getElementById('footYear');
  if (footYear) footYear.textContent = new Date().getFullYear();

  // -------------------------------------------------------------
  // 1. THREE.JS INITIALIZATION & SCENE SETUP
  // -------------------------------------------------------------
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js or Canvas missing');
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06080b);
  scene.fog = new THREE.FogExp2(0x06080b, 0.014);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.3, 300);
  
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

  // -------------------------------------------------------------
  // 2. PROCEDURAL 3D ARCHITECTURE: VILLA, APARTMENTS & X-RAY
  // -------------------------------------------------------------
  const estateGroup = new THREE.Group();
  scene.add(estateGroup);

  // Materials & Shaders
  const concreteDark = new THREE.MeshStandardMaterial({ color: 0x181e29, roughness: 0.85, metalness: 0.1 });
  const concreteLight = new THREE.MeshStandardMaterial({ color: 0x242d3d, roughness: 0.7, metalness: 0.15 });
  const teakWood = new THREE.MeshStandardMaterial({ color: 0x6e4526, roughness: 0.6, metalness: 0.05 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.4, metalness: 0.8 });
  const glassBalcony = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.1,
    transmission: 0.6,
    thickness: 0.5
  });

  // Emissive warm interior window glass (Glowing rooms at night!)
  const warmWindowMat = new THREE.MeshStandardMaterial({
    color: 0xffeedd,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9,
    roughness: 0.3
  });

  const poolWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.3
  });

  // X-Ray Rebar & Structural Column materials
  const xrayGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.22,
    wireframe: false,
    roughness: 0.2
  });

  const rebarSteelMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true
  });

  const solidWallMeshes = [];
  const xrayMeshes = [];

  // --- A. GROUND & LANDSCAPE PASTE ---
  // Large terrain ground
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0d13, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  estateGroup.add(ground);

  // Driveway & Stone Paver Terrace
  const paverGeo = new THREE.BoxGeometry(28, 0.1, 24);
  const paverMat = new THREE.MeshStandardMaterial({ color: 0x121722, roughness: 0.8 });
  const paver = new THREE.Mesh(paverGeo, paverMat);
  paver.position.set(-2, 0, 0);
  paver.receiveShadow = true;
  estateGroup.add(paver);

  // Reflecting Water Pool (Villa garden)
  const poolGeo = new THREE.BoxGeometry(10, 0.4, 4);
  const pool = new THREE.Mesh(poolGeo, poolWaterMat);
  pool.position.set(-1, 0.1, 8.5);
  estateGroup.add(pool);

  // --- B. INDEPENDENT LUXURY DUPLEX VILLA (Left Side) ---
  const villaGroup = new THREE.Group();
  villaGroup.position.set(-6, 0, 0);
  estateGroup.add(villaGroup);

  // Ground Floor Main Living Volume
  const gndVolGeo = new THREE.BoxGeometry(10, 4.2, 9);
  const gndVol = new THREE.Mesh(gndVolGeo, concreteDark);
  gndVol.position.set(0, 2.1, 0);
  gndVol.castShadow = true;
  gndVol.receiveShadow = true;
  villaGroup.add(gndVol);
  solidWallMeshes.push(gndVol);

  // Ground Floor Large Panoramic Glowing Windows
  const gndWinGeo = new THREE.BoxGeometry(7, 2.8, 0.2);
  const gndWin = new THREE.Mesh(gndWinGeo, warmWindowMat);
  gndWin.position.set(0, 2.2, 4.52);
  villaGroup.add(gndWin);

  // Entrance Portico Canopy
  const canopyGeo = new THREE.BoxGeometry(5, 0.3, 4);
  const canopy = new THREE.Mesh(canopyGeo, darkMetal);
  canopy.position.set(0, 3.8, 6.2);
  canopy.castShadow = true;
  villaGroup.add(canopy);

  // Entrance Steps
  for (let s = 0; s < 3; s++) {
    const stepGeo = new THREE.BoxGeometry(4.5 - s * 0.4, 0.15, 0.8);
    const step = new THREE.Mesh(stepGeo, concreteLight);
    step.position.set(0, s * 0.15 + 0.08, 4.8 + s * 0.7);
    villaGroup.add(step);
  }

  // First Floor Cantilevered Master Suite Volume (protrudes forward)
  const fstVolGeo = new THREE.BoxGeometry(11, 4.0, 7.5);
  const fstVol = new THREE.Mesh(fstVolGeo, concreteLight);
  fstVol.position.set(-0.5, 6.2, 1.2);
  fstVol.castShadow = true;
  fstVol.receiveShadow = true;
  villaGroup.add(fstVol);
  solidWallMeshes.push(fstVol);

  // Architectural Teak Wood Louvers on master suite
  const louverPanelGeo = new THREE.BoxGeometry(3.5, 3.2, 0.3);
  const louverPanel = new THREE.Mesh(louverPanelGeo, teakWood);
  louverPanel.position.set(-3.2, 6.2, 5.0);
  villaGroup.add(louverPanel);

  // First Floor Panoramic Bedroom Window
  const fstWinGeo = new THREE.BoxGeometry(5.5, 2.6, 0.2);
  const fstWin = new THREE.Mesh(fstWinGeo, warmWindowMat);
  fstWin.position.set(1.5, 6.2, 5.0);
  villaGroup.add(fstWin);

  // Cantilevered Master Balcony with Glass Railing
  const balcSlabGeo = new THREE.BoxGeometry(6.2, 0.25, 2.2);
  const balcSlab = new THREE.Mesh(balcSlabGeo, darkMetal);
  balcSlab.position.set(1.5, 4.25, 5.8);
  balcSlab.castShadow = true;
  villaGroup.add(balcSlab);

  const balcGlassGeo = new THREE.BoxGeometry(6.1, 1.1, 0.1);
  const balcGlass = new THREE.Mesh(balcGlassGeo, glassBalcony);
  balcGlass.position.set(1.5, 4.9, 6.8);
  villaGroup.add(balcGlass);

  // Rooftop Terrace & Modern Sun Pergola
  const pergolaBeamsGroup = new THREE.Group();
  pergolaBeamsGroup.position.set(-1, 8.3, 0);
  for (let b = 0; b < 6; b++) {
    const beamGeo = new THREE.BoxGeometry(0.15, 0.2, 5.5);
    const beam = new THREE.Mesh(beamGeo, darkMetal);
    beam.position.set(-2.5 + b * 1.0, 1.4, 0);
    pergolaBeamsGroup.add(beam);
  }
  // Pergola vertical support posts
  const postGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
  const post1 = new THREE.Mesh(postGeo, darkMetal);
  post1.position.set(-2.5, 0.75, 2.5);
  const post2 = new THREE.Mesh(postGeo, darkMetal);
  post2.position.set(2.5, 0.75, 2.5);
  pergolaBeamsGroup.add(post1, post2);
  villaGroup.add(pergolaBeamsGroup);

  // Internal Warm PointLight radiating through the villa
  const villaInteriorLight = new THREE.PointLight(0xf59e0b, 1.8, 14);
  villaInteriorLight.position.set(0, 3.5, 2.5);
  villaGroup.add(villaInteriorLight);

  // Exterior Architectural Spotlight illuminating the cantilever
  const villaUplight = new THREE.SpotLight(0xfbbf24, 2.2, 18, Math.PI / 4, 0.4);
  villaUplight.position.set(-2, 0.2, 7);
  villaUplight.target = fstVol;
  villaGroup.add(villaUplight);

  // --- C. MULTI-STOREY RESIDENTIAL APARTMENTS (G+5 Right Side) ---
  const aptGroup = new THREE.Group();
  aptGroup.position.set(11, 0, -2);
  estateGroup.add(aptGroup);

  const totalFloors = 5;
  const floorH = 3.2;
  const aptWidth = 10;
  const aptDepth = 9;

  // Stilt Floor (Pilotis / Parking with visible reinforced columns)
  for (let cx = -1; cx <= 1; cx++) {
    for (let cz = -1; cz <= 1; cz++) {
      const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.2, 16);
      const col = new THREE.Mesh(colGeo, concreteDark);
      col.position.set(cx * 3.8, 1.6, cz * 3.4);
      col.castShadow = true;
      aptGroup.add(col);
    }
  }

  // Stilt ceiling / First floor podium slab
  const podSlabGeo = new THREE.BoxGeometry(aptWidth + 0.8, 0.4, aptDepth + 0.8);
  const podSlab = new THREE.Mesh(podSlabGeo, darkMetal);
  podSlab.position.set(0, 3.2, 0);
  aptGroup.add(podSlab);

  // Residential Floors 1 through 5
  for (let fl = 1; fl <= totalFloors; fl++) {
    const yBase = 3.2 + (fl - 1) * floorH;
    
    // Core living volume
    const flGeo = new THREE.BoxGeometry(aptWidth, floorH - 0.2, aptDepth);
    const flMesh = new THREE.Mesh(flGeo, fl % 2 === 0 ? concreteDark : concreteLight);
    flMesh.position.set(0, yBase + floorH / 2, 0);
    flMesh.castShadow = true;
    flMesh.receiveShadow = true;
    aptGroup.add(flMesh);
    solidWallMeshes.push(flMesh);

    // Cantilevered Private Balconies on front
    const bSlabGeo = new THREE.BoxGeometry(4.2, 0.2, 1.8);
    const bSlab = new THREE.Mesh(bSlabGeo, darkMetal);
    bSlab.position.set(-2, yBase + 0.1, aptDepth / 2 + 0.8);
    aptGroup.add(bSlab);

    const bGlassGeo = new THREE.BoxGeometry(4.1, 1.0, 0.08);
    const bGlass = new THREE.Mesh(bGlassGeo, glassBalcony);
    bGlass.position.set(-2, yBase + 0.65, aptDepth / 2 + 1.6);
    aptGroup.add(bGlass);

    // Glowing warm residential apartment windows (staggered for realism)
    const winGeo = new THREE.BoxGeometry(2.8, 1.8, 0.15);
    const win = new THREE.Mesh(winGeo, warmWindowMat);
    win.position.set(2.4, yBase + floorH / 2, aptDepth / 2 + 0.08);
    aptGroup.add(win);

    // Vertical Concrete Architectural Fins (Brise-Soleil)
    const finGeo = new THREE.BoxGeometry(0.15, floorH, 0.6);
    const fin = new THREE.Mesh(finGeo, teakWood);
    fin.position.set(0.6, yBase + floorH / 2, aptDepth / 2 + 0.3);
    aptGroup.add(fin);
  }

  // Apartment Rooftop Deck & Parapet
  const roofTopY = 3.2 + totalFloors * floorH;
  const roofPergolaGeo = new THREE.BoxGeometry(6, 0.2, 6);
  const roofPergola = new THREE.Mesh(roofPergolaGeo, darkMetal);
  roofPergola.position.set(0, roofTopY + 2.0, 0);
  aptGroup.add(roofPergola);

  // Apartment Interior Core Glow
  const aptLight = new THREE.PointLight(0xf59e0b, 2.2, 22);
  aptLight.position.set(11, 10, 2);
  estateGroup.add(aptLight);

  // --- D. STRUCTURAL X-RAY REBAR & COLUMN MESHES ---
  const xrayGroup = new THREE.Group();
  xrayGroup.position.copy(villaGroup.position);
  xrayGroup.visible = false;
  estateGroup.add(xrayGroup);

  // Foundation Bored Pile Footings (Below ground level)
  for (let fx = -4; fx <= 4; fx += 4) {
    for (let fz = -3; fz <= 3; fz += 3) {
      // Pile footing pad
      const padGeo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
      const pad = new THREE.Mesh(padGeo, xrayGlassMat);
      pad.position.set(fx, -0.3, fz);
      xrayGroup.add(pad);

      // Deep pile cylinder
      const pileGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 12);
      const pile = new THREE.Mesh(pileGeo, rebarSteelMat);
      pile.position.set(fx, -2.4, fz);
      xrayGroup.add(pile);

      // Vertical reinforced concrete column cage
      const colCageGeo = new THREE.BoxGeometry(0.6, 8.5, 0.6);
      const colCage = new THREE.Mesh(colCageGeo, rebarSteelMat);
      colCage.position.set(fx, 4.2, fz);
      xrayGroup.add(colCage);
    }
  }

  // Horizontal Tie-Beam Rebar Grid
  for (let y = 0.2; y <= 8.2; y += 4.0) {
    const beamGridGeo = new THREE.BoxGeometry(9.6, 0.35, 7.6);
    const beamGrid = new THREE.Mesh(beamGridGeo, rebarSteelMat);
    beamGrid.position.set(0, y, 0);
    xrayGroup.add(beamGrid);
  }

  // --- E. ATMOSPHERIC PARTICLES (DRIFTING GOLDEN EMBERS) ---
  const emberCount = 350;
  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(emberCount * 3);
  const emberSpeeds = [];

  for (let i = 0; i < emberCount; i++) {
    emberPositions[i * 3 + 0] = (Math.random() - 0.5) * 60;
    emberPositions[i * 3 + 1] = Math.random() * 24;
    emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    emberSpeeds.push({
      vy: 0.008 + Math.random() * 0.016,
      vx: (Math.random() - 0.5) * 0.006,
      vz: (Math.random() - 0.5) * 0.006
    });
  }

  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  const emberMat = new THREE.PointsMaterial({
    color: 0xf59e0b,
    size: 0.16,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const emberParticles = new THREE.Points(emberGeo, emberMat);
  scene.add(emberParticles);

  // -------------------------------------------------------------
  // 3. LIGHTING RIG & TWILIGHT / NIGHT MODES
  // -------------------------------------------------------------
  const hemiLight = new THREE.HemisphereLight(0x182030, 0x06080b, 0.6);
  scene.add(hemiLight);

  const dirSunLight = new THREE.DirectionalLight(0xffecd0, 1.2);
  dirSunLight.position.set(-18, 25, 20);
  dirSunLight.castShadow = true;
  dirSunLight.shadow.mapSize.width = 2048;
  dirSunLight.shadow.mapSize.height = 2048;
  dirSunLight.shadow.camera.near = 1;
  dirSunLight.shadow.camera.far = 80;
  dirSunLight.shadow.camera.left = -25;
  dirSunLight.shadow.camera.right = 25;
  dirSunLight.shadow.camera.top = 25;
  dirSunLight.shadow.camera.bottom = -25;
  scene.add(dirSunLight);

  let isNightMode = true;
  function updateLightingMode() {
    if (isNightMode) {
      scene.background.set(0x06080b);
      scene.fog.color.set(0x06080b);
      hemiLight.intensity = 0.45;
      dirSunLight.intensity = 0.5;
      dirSunLight.color.set(0x406085); // cool moonlight
      warmWindowMat.emissiveIntensity = 1.0;
      villaInteriorLight.intensity = 2.0;
      aptLight.intensity = 2.4;
      poolWaterMat.emissiveIntensity = 0.35;
    } else {
      // Twilight Golden Hour
      scene.background.set(0x1a1520);
      scene.fog.color.set(0x1a1520);
      hemiLight.intensity = 0.9;
      dirSunLight.intensity = 1.8;
      dirSunLight.color.set(0xfbbf24); // warm golden sunset
      warmWindowMat.emissiveIntensity = 0.4;
      villaInteriorLight.intensity = 0.8;
      aptLight.intensity = 1.0;
      poolWaterMat.emissiveIntensity = 0.15;
    }
  }
  updateLightingMode();

  // -------------------------------------------------------------
  // 4. KAGE-STYLE CONTINUOUS CAMERA SPLINE & WAYPOINTS
  // -------------------------------------------------------------
  // Waypoints for each chapter [0, 1, 2, 3, 4, 5]
  const CAM_WAYPOINTS = [
    // Chap 0: The Sanctuary (Hero panoramic establishing angle)
    { p: [3, 14, 30], t: [2, 6, 0], fov: 44 },
    // Chap 1: Independent Luxury Villa (Dolly close to the duplex entrance & cantilever)
    { p: [-5, 6, 16], t: [-6, 5, 0], fov: 38 },
    // Chap 2: Residential Apartments (Tilt up to modern apartment facade & balconies)
    { p: [15, 8, 18], t: [11, 10, -2], fov: 42 },
    // Chap 3: Structural Rigor (Low-angle architectural footing & column cross-section)
    { p: [-4, 3.5, 12], t: [-5, 2.5, 0], fov: 36 },
    // Chap 4: Executive Leadership (Illuminated courtyard architectural frame)
    { p: [0, 8, 22], t: [0, 4.5, 0], fov: 40 },
    // Chap 5: Estimator & Contact (Cinematic golden-hour residential estate overview)
    { p: [2, 12, 28], t: [1, 5, 0], fov: 42 }
  ];

  const posVecs = CAM_WAYPOINTS.map(w => new THREE.Vector3(w.p[0], w.p[1], w.p[2]));
  const targetVecs = CAM_WAYPOINTS.map(w => new THREE.Vector3(w.t[0], w.t[1], w.t[2]));

  const curvePos = new THREE.CatmullRomCurve3(posVecs, false, 'catmullrom', 0.4);
  const curveTarget = new THREE.CatmullRomCurve3(targetVecs, false, 'catmullrom', 0.4);

  // Camera interpolation state
  const RIG = {
    targetIndex: 0,
    currentIndex: 0,
    smoothVal: 0,
    // Mouse/Touch Parallax & Orbit
    mouseX: 0,
    mouseY: 0,
    orbitActive: false,
    orbitAngleX: 0,
    orbitAngleY: 0,
    targetOrbitX: 0,
    targetOrbitY: 0
  };

  const _camP = new THREE.Vector3();
  const _camT = new THREE.Vector3();

  // Aspect ratio adjustment for mobile phones (keeps buildings in frame)
  function applyAspectCorrection(p, t) {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 1.4) {
      // Mobile / Portrait: step camera back along view normal
      const diff = new THREE.Vector3().subVectors(p, t).normalize();
      const pull = Math.min((1.4 - aspect) * 12, 14);
      p.addScaledVector(diff, pull);
      p.y += (1.4 - aspect) * 1.5;
    }
  }

  function updateCameraRig() {
    const N = CAM_WAYPOINTS.length - 1;
    const progress = Math.max(0, Math.min(RIG.smoothVal / N, 1));

    curvePos.getPoint(progress, _camP);
    curveTarget.getPoint(progress, _camT);

    // Apply mobile portrait framing adjustments
    applyAspectCorrection(_camP, _camT);

    // Subtle pointer parallax
    _camP.x += RIG.mouseX * 1.2;
    _camP.y += RIG.mouseY * 0.7;

    // Apply interactive drag orbit
    if (Math.abs(RIG.orbitAngleX) > 0.001 || Math.abs(RIG.orbitAngleY) > 0.001) {
      const radius = _camP.distanceTo(_camT);
      _camP.x = _camT.x + radius * Math.sin(RIG.orbitAngleX) * Math.cos(RIG.orbitAngleY);
      _camP.y = _camT.y + radius * Math.sin(RIG.orbitAngleY);
      _camP.z = _camT.z + radius * Math.cos(RIG.orbitAngleX) * Math.cos(RIG.orbitAngleY);
    }

    camera.position.copy(_camP);
    camera.lookAt(_camT);
  }

  // -------------------------------------------------------------
  // 5. INTERACTIVE 3D ORBIT / DRAG LOGIC (DESKTOP & MOBILE)
  // -------------------------------------------------------------
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function onPointerDown(e) {
    // Only drag when clicking canvas or outside input forms
    if (e.target.closest('input, textarea, button, a, select')) return;
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    // Ambient mouse parallax
    RIG.mouseX = (clientX / window.innerWidth - 0.5) * 2;
    RIG.mouseY = -(clientY / window.innerHeight - 0.5) * 2;

    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;

    RIG.targetOrbitX += dx * 0.006;
    RIG.targetOrbitY = Math.max(-0.45, Math.min(0.65, RIG.targetOrbitY + dy * 0.005));

    startX = clientX;
    startY = clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  window.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // -------------------------------------------------------------
  // 6. SCROLL SYNCHRONIZATION WITH CHAPTERS
  // -------------------------------------------------------------
  const chapters = document.querySelectorAll('.chapter-sec');
  const railItems = document.querySelectorAll('.rail-item');
  const hudButtons = document.querySelectorAll('.hud-views .hud-btn');

  function calculateActiveChapter() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = docHeight > 0 ? scrollY / docHeight : 0;

    const N = CAM_WAYPOINTS.length - 1;
    RIG.targetIndex = scrollRatio * N;

    // Detect currently visible chapter
    let currentIdx = 0;
    chapters.forEach((chap, idx) => {
      const rect = chap.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
        currentIdx = idx;
      }
    });

    // Update side rail active state
    railItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentIdx);
    });

    // Update HUD view buttons
    hudButtons.forEach((btn) => {
      const viewId = parseInt(btn.getAttribute('data-view'), 10);
      btn.classList.toggle('active', viewId === Math.min(currentIdx, 3));
    });

    // Auto-toggle X-Ray mode if at chapter 3
    if (currentIdx === 3) {
      setXrayMode(true);
    } else {
      if (!isExplicitXray) setXrayMode(false);
    }
  }

  window.addEventListener('scroll', calculateActiveChapter, { passive: true });

  // -------------------------------------------------------------
  // 7. HUD VIEW PRESET SWITCHER & CONTROLS
  // -------------------------------------------------------------
  let isExplicitXray = false;

  window.setXrayMode = function (active) {
    xrayGroup.visible = active;
    solidWallMeshes.forEach(mesh => {
      if (active) {
        mesh.material = xrayGlassMat;
      } else {
        mesh.material = concreteLight;
      }
    });
    const xrayLabel = document.getElementById('xrayBtnLabel');
    if (xrayLabel) {
      xrayLabel.textContent = active ? 'Restore Solid Architecture' : 'Toggle X-Ray Transparency';
    }
  };

  window.toggleXrayMode = function () {
    isExplicitXray = !isExplicitXray;
    setXrayMode(isExplicitXray);
    showToast(isExplicitXray ? 'Structural Rebar & Columns Engaged' : 'Solid Architecture Restored', 'info');
  };

  hudButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = parseInt(btn.getAttribute('data-view'), 10);
      const targetChap = document.getElementById(`chap${viewId}`);
      if (targetChap) {
        targetChap.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.focusVillaView = function () {
    const c1 = document.getElementById('chap1');
    if (c1) c1.scrollIntoView({ behavior: 'smooth' });
  };

  window.focusApartmentView = function () {
    const c2 = document.getElementById('chap2');
    if (c2) c2.scrollIntoView({ behavior: 'smooth' });
  };

  window.trigger3DInspect = function () {
    RIG.targetOrbitX += 0.8;
    showToast('3D Orbit Active: Drag on screen with mouse or finger to rotate!', 'info');
  };

  // Light Mode Toggle
  const lightModeToggle = document.getElementById('lightModeToggle');
  const lightModeLabel = document.getElementById('lightModeLabel');
  const nightIcon = document.querySelector('.night-icon');
  const dayIcon = document.querySelector('.day-icon');

  if (lightModeToggle) {
    lightModeToggle.addEventListener('click', () => {
      isNightMode = !isNightMode;
      updateLightingMode();
      if (lightModeLabel) {
        lightModeLabel.textContent = isNightMode ? 'Night Mode' : 'Twilight Sun';
      }
      if (nightIcon && dayIcon) {
        nightIcon.style.display = isNightMode ? 'inline-block' : 'none';
        dayIcon.style.display = isNightMode ? 'none' : 'inline-block';
      }
      showToast(isNightMode ? 'Night Architectural Illumination Active' : 'Twilight Golden Hour Active', 'info');
    });
  }

  // -------------------------------------------------------------
  // 8. MOBILE MENU DRAWER
  // -------------------------------------------------------------
  const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mDrawerLinks = document.querySelectorAll('.m-link');

  if (mobileMenuTrigger && mobileMenuDrawer) {
    mobileMenuTrigger.addEventListener('click', () => {
      const open = mobileMenuDrawer.classList.toggle('open');
      mobileMenuTrigger.classList.toggle('active', open);
    });

    mDrawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.remove('open');
        mobileMenuTrigger.classList.remove('active');
      });
    });
  }

  // Header scroll appearance
  const header = document.getElementById('editorialHeader');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // -------------------------------------------------------------
  // 9. INTERACTIVE RESIDENTIAL COST & SCHEDULE ESTIMATOR
  // -------------------------------------------------------------
  const structureTypeButtons = document.querySelectorAll('#structureTypeGrid .t-btn');
  const resAreaSlider = document.getElementById('resAreaSlider');
  const sliderAreaVal = document.getElementById('sliderAreaVal');
  const gradeItems = document.querySelectorAll('#gradeRow .grade-item');

  const outBudget = document.getElementById('outBudget');
  const outDuration = document.getElementById('outDuration');
  const outSteel = document.getElementById('outSteel');

  let currentStructure = 'villa';
  let currentGrade = 'premium';
  let currentArea = 3500;

  // Rate matrices in INR per sq.ft
  const costConfig = {
    villa: {
      standard: { min: 2100, max: 2400, monthPer10k: 14, steelPerSqFt: 4.5 },
      premium: { min: 2650, max: 3100, monthPer10k: 16, steelPerSqFt: 5.2 },
      ultra: { min: 3400, max: 4200, monthPer10k: 20, steelPerSqFt: 6.2 }
    },
    apartment: {
      standard: { min: 1950, max: 2250, monthPer10k: 12, steelPerSqFt: 4.8 },
      premium: { min: 2450, max: 2850, monthPer10k: 15, steelPerSqFt: 5.8 },
      ultra: { min: 3100, max: 3800, monthPer10k: 18, steelPerSqFt: 6.8 }
    },
    duplex: {
      standard: { min: 2250, max: 2600, monthPer10k: 15, steelPerSqFt: 4.8 },
      premium: { min: 2850, max: 3350, monthPer10k: 18, steelPerSqFt: 5.6 },
      ultra: { min: 3600, max: 4500, monthPer10k: 22, steelPerSqFt: 6.8 }
    }
  };

  function formatIndianCurrency(amt) {
    if (amt >= 10000000) {
      return `₹${(amt / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amt / 100000).toFixed(2)} L`;
  }

  function recalculateEstimate() {
    if (!resAreaSlider || !outBudget) return;
    currentArea = parseInt(resAreaSlider.value, 10);
    if (sliderAreaVal) sliderAreaVal.textContent = currentArea.toLocaleString('en-IN');

    const rates = costConfig[currentStructure][currentGrade];
    const totalMin = currentArea * rates.min;
    const totalMax = currentArea * rates.max;

    outBudget.textContent = `${formatIndianCurrency(totalMin)} - ${formatIndianCurrency(totalMax)}`;

    const estMonths = Math.max(7, Math.round((currentArea / 10000) * rates.monthPer10k + 5));
    outDuration.textContent = `${estMonths} - ${estMonths + 3} Months`;

    const steelTons = ((currentArea * rates.steelPerSqFt) / 1000).toFixed(1);
    outSteel.textContent = `~${steelTons} Metric Tons`;
  }

  structureTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      structureTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStructure = btn.getAttribute('data-type');
      recalculateEstimate();
    });
  });

  if (resAreaSlider) {
    resAreaSlider.addEventListener('input', recalculateEstimate);
  }

  gradeItems.forEach(item => {
    item.addEventListener('click', () => {
      gradeItems.forEach(g => g.classList.remove('active'));
      item.classList.add('active');
      currentGrade = item.getAttribute('data-grade');
      recalculateEstimate();
    });
  });

  recalculateEstimate();

  // -------------------------------------------------------------
  // 10. CLIENT-SIDE VALIDATED RESIDENTIAL CONTACT FORM
  // -------------------------------------------------------------
  const resForm = document.getElementById('residentialContactForm');
  const cName = document.getElementById('cName');
  const cPhone = document.getElementById('cPhone');
  const cEmail = document.getElementById('cEmail');
  const cMessage = document.getElementById('cMessage');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const formSuccessBanner = document.getElementById('formSuccessBanner');

  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous error messages
      document.querySelectorAll('.f-error').forEach(el => el.textContent = '');
      document.querySelectorAll('.f-input').forEach(el => el.classList.remove('has-error'));

      // Validate Name
      if (!cName.value.trim() || cName.value.trim().length < 3) {
        document.getElementById('nameError').textContent = 'Please enter your full name (minimum 3 characters)';
        cName.classList.add('has-error');
        valid = false;
      }

      // Validate 10-digit phone
      const cleanPhone = cPhone.value.trim().replace(/[\s\-\(\)\+]/g, '').slice(-10);
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        document.getElementById('phoneError').textContent = 'Enter a valid 10-digit Indian mobile number';
        cPhone.classList.add('has-error');
        valid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cEmail.value.trim())) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        cEmail.classList.add('has-error');
        valid = false;
      }

      // Validate Message
      if (!cMessage.value.trim() || cMessage.value.trim().length < 8) {
        document.getElementById('messageError').textContent = 'Please provide details about your plot location or requirements';
        cMessage.classList.add('has-error');
        valid = false;
      }

      if (!valid) {
        showToast('Please correct the highlighted fields', 'error');
        return;
      }

      // Simulate sending to Yata Ramchander and Ale Sudeesh
      const btnText = formSubmitBtn.querySelector('.btn-text');
      const btnIco = formSubmitBtn.querySelector('.btn-ico');
      const spinner = formSubmitBtn.querySelector('.spinner');

      btnText.textContent = 'Transmitting to Directors...';
      if (btnIco) btnIco.style.display = 'none';
      if (spinner) spinner.style.display = 'inline-block';
      formSubmitBtn.disabled = true;

      setTimeout(() => {
        btnText.textContent = 'Blueprint Request Dispatched';
        if (spinner) spinner.style.display = 'none';

        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'flex';
          formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast('Proposal transmitted! Yata Ramchander or Ale Sudeesh will call you shortly.', 'success');
        resForm.reset();

        setTimeout(() => {
          btnText.textContent = 'Submit for Director Review';
          if (btnIco) btnIco.style.display = 'inline-block';
          formSubmitBtn.disabled = false;
        }, 4000);
      }, 1000);
    });
  }

  // -------------------------------------------------------------
  // 11. FLOATING SPEED DIAL QUICK CONTACT
  // -------------------------------------------------------------
  const quickDial = document.querySelector('.floating-quick-dial');
  const speedDialTrigger = document.getElementById('speedDialTrigger');

  if (speedDialTrigger && quickDial) {
    speedDialTrigger.addEventListener('click', () => {
      quickDial.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!quickDial.contains(e.target)) {
        quickDial.classList.remove('active');
      }
    });
  }

  // -------------------------------------------------------------
  // 12. TOAST NOTIFICATIONS
  // -------------------------------------------------------------
  window.showToast = function (msg, type = 'info') {
    const hub = document.getElementById('toastHub');
    if (!hub) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.textContent = msg;
    hub.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  };

  // -------------------------------------------------------------
  // 13. RESIZE HANDLER & ANIMATION RENDER LOOP (60FPS)
  // -------------------------------------------------------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Smoothly damp camera scroll position (KAGE lerp)
    RIG.smoothVal += (RIG.targetIndex - RIG.smoothVal) * 0.08;

    // Smoothly damp 3D orbit rotation
    RIG.orbitAngleX += (RIG.targetOrbitX - RIG.orbitAngleX) * 0.1;
    RIG.orbitAngleY += (RIG.targetOrbitY - RIG.orbitAngleY) * 0.1;

    updateCameraRig();

    // Animate pool water gentle oscillation
    if (pool) {
      pool.position.y = 0.1 + Math.sin(elapsedTime * 2.0) * 0.02;
    }

    // Animate atmospheric golden embers
    const posAttr = emberGeo.attributes.position;
    for (let i = 0; i < emberCount; i++) {
      let y = posAttr.getY(i) + emberSpeeds[i].vy;
      let x = posAttr.getX(i) + emberSpeeds[i].vx;
      let z = posAttr.getZ(i) + emberSpeeds[i].vz;

      if (y > 22) y = 0.2;
      posAttr.setY(i, y);
      posAttr.setX(i, x);
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
});
