import * as THREE from "three";

// An architect's working model on a table (docs/DESIGN.md → Construction Story): white card, raw timber,
// a warm tungsten spot light. Progress 0..1 spans four stages: survey → foundation → frame → handover.

export interface StorySceneOptions {
  mobile: boolean;
  reducedMotion: boolean;
}

export interface StoryScene {
  setTarget(progress: number): void;
  setActive(active: boolean): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

// sRGB equivalents of the docs/DESIGN.md OKLCH tokens (three.js has no OKLCH parser)
const PALETTE = {
  card: 0xfbfbfa,
  board: 0xf3f5f3,
  street: 0xd9dfda,
  pavement: 0xe6ebe7,
  raft: 0xd3d8d4,
  timber: 0xdcc6a2,
  glass: 0x26332b,
  lamp: 0xfca953,
  cypress: 0x1b3e21,
  ink: 0x161e17,
  muted: 0x535e55,
  foliage: 0x87a07a,
  trunk: 0x8c7a62,
};

const STAGES = 4;
const FLOORS = 6;
const FLOOR_H = 0.36;
const W = 3.0; // building width (front facade, along x)
const D = 2.2; // building depth (side facade, along z)
const RAFT_H = 0.14;
const WALL_T = 0.03;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeInOut = (x: number) => (x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2);

// Local 0..1 inside [start, end] of a given stage, both expressed as fractions of that stage
function span(progress: number, stage: number, start: number, end: number) {
  const from = (stage + start) / STAGES;
  const to = (stage + end) / STAGES;
  return clamp01((progress - from) / (to - from));
}

type Mode = "drop" | "rise" | "growX" | "growZ";

interface Piece {
  object: THREE.Object3D;
  mode: Mode;
  enter: [stage: number, start: number, end: number];
  exit?: [stage: number, start: number, end: number];
  base: THREE.Vector3;
  baseScale: THREE.Vector3;
}

export function createStoryScene(canvas: HTMLCanvasElement, options: StorySceneOptions): StoryScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.mobile ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  // Light: a soft room fill plus one warm spot, like a desk lamp over the model
  // Fill is neutral so white card stays white; the warmth lives in the spot only, and only slightly (never sand)
  const fill = new THREE.HemisphereLight(0xffffff, 0xe4e9e5, 1.6);
  scene.add(fill);
  const spot = new THREE.SpotLight(0xfff0dc, 2.1, 0, 0.62, 0.85, 0);
  spot.position.set(4.5, 8, 5.5);
  spot.target.position.set(-0.4, 0.6, -0.3);
  spot.castShadow = true;
  spot.shadow.mapSize.set(options.mobile ? 1024 : 2048, options.mobile ? 1024 : 2048);
  spot.shadow.bias = -0.0002;
  // normalBias removes the striping (shadow acne) on the board's grazing side faces
  spot.shadow.normalBias = 0.02;
  spot.shadow.radius = 4;
  // Tight near/far keeps shadow precision on a model this small
  spot.shadow.camera.near = 5;
  spot.shadow.camera.far = 18;
  scene.add(spot, spot.target);

  const material = (color: number, roughness = 0.88) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
  const mats = {
    card: material(PALETTE.card),
    board: material(PALETTE.board, 0.95),
    street: material(PALETTE.street, 0.95),
    pavement: material(PALETTE.pavement, 0.95),
    raft: material(PALETTE.raft),
    timber: material(PALETTE.timber, 0.8),
    cypress: material(PALETTE.cypress),
    ink: material(PALETTE.ink),
    muted: material(PALETTE.muted),
    foliage: material(PALETTE.foliage, 1),
    trunk: material(PALETTE.trunk),
    // Windows ignore scene light so a lit one reads as a light source, not a painted patch
    glass: new THREE.MeshBasicMaterial({ color: PALETTE.glass, toneMapped: false }),
    lit: new THREE.MeshBasicMaterial({ color: PALETTE.lamp, toneMapped: false }),
  };

  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 16);
  const canopyGeometry = new THREE.IcosahedronGeometry(1, 1);

  function box(mat: THREE.Material, size: [number, number, number], position: [number, number, number], parent: THREE.Object3D) {
    const mesh = new THREE.Mesh(unitBox, mat);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(mat: THREE.Material, radius: number, height: number, position: [number, number, number], parent: THREE.Object3D) {
    const mesh = new THREE.Mesh(unitCylinder, mat);
    mesh.scale.set(radius, height, radius);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  const pieces: Piece[] = [];
  function piece(object: THREE.Object3D, mode: Mode, enter: Piece["enter"], exit?: Piece["exit"]) {
    pieces.push({ object, mode, enter, exit, base: object.position.clone(), baseScale: object.scale.clone() });
    return object;
  }

  // ── The table: board, street corner, pavement, plane trees ─────────────────
  const world = new THREE.Group();
  scene.add(world);
  box(mats.board, [7.2, 0.12, 5.6], [0, -0.06, 0], world);
  box(mats.street, [7.2, 0.005, 0.9], [0, 0.003, 2.35], world);
  box(mats.street, [1.0, 0.005, 5.6], [3.1, 0.003, 0], world);
  box(mats.pavement, [5.6, 0.03, 0.62], [-0.8, 0.015, 1.59], world);
  box(mats.pavement, [0.62, 0.03, 4.1], [2.29, 0.015, -0.49], world);

  function tree(x: number, z: number, scale: number) {
    const group = new THREE.Group();
    cylinder(mats.trunk, 0.035 * scale, 0.5 * scale, [0, 0.25 * scale, 0], group);
    const canopy = new THREE.Mesh(canopyGeometry, mats.foliage);
    canopy.scale.set(0.34 * scale, 0.3 * scale, 0.34 * scale);
    canopy.position.set(0, 0.68 * scale, 0);
    canopy.castShadow = true;
    canopy.receiveShadow = true;
    group.add(canopy);
    group.position.set(x, 0.03, z);
    world.add(group);
  }
  tree(-3.0, 1.6, 1.05);
  tree(-1.6, 1.62, 0.95);
  tree(-0.2, 1.58, 1.1);
  tree(2.3, -2.3, 1.0);
  tree(2.28, -0.9, 0.92);

  // ── The building, on the corner parcel ─────────────────────────────────────
  const building = new THREE.Group();
  building.position.set(-0.55, 0, -0.45);
  world.add(building);
  const front = D / 2 + WALL_T;
  const side = W / 2 + WALL_T;
  const floorBase = (floor: number) => RAFT_H + floor * FLOOR_H;

  // Stage 1 · Zemin: parcel pegs, string lines, borehole markers
  const px = W / 2 + 0.28;
  const pz = D / 2 + 0.28;
  const pegs: [number, number][] = [[-px, -pz], [px, -pz], [px, pz], [-px, pz]];
  pegs.forEach(([x, z], i) => {
    piece(cylinder(mats.cypress, 0.022, 0.2, [x, 0.1, z], building), "drop", [0, i * 0.06, 0.25 + i * 0.06], [1, 0, 0.3]);
  });
  piece(box(mats.ink, [px * 2, 0.008, 0.008], [0, 0.15, -pz], building), "growX", [0, 0.25, 0.5], [1, 0, 0.3]);
  piece(box(mats.ink, [px * 2, 0.008, 0.008], [0, 0.15, pz], building), "growX", [0, 0.3, 0.55], [1, 0, 0.3]);
  piece(box(mats.ink, [0.008, 0.008, pz * 2], [-px, 0.15, 0], building), "growZ", [0, 0.35, 0.6], [1, 0, 0.3]);
  piece(box(mats.ink, [0.008, 0.008, pz * 2], [px, 0.15, 0], building), "growZ", [0, 0.4, 0.65], [1, 0, 0.3]);
  let hole = 0;
  for (const bx of [-0.95, 0, 0.95]) {
    for (const bz of [-0.65, 0, 0.65]) {
      const start = 0.45 + hole * 0.05;
      piece(cylinder(mats.muted, 0.06, 0.02, [bx, 0.012, bz], building), "drop", [0, start, start + 0.15], [1, 0.1, 0.35]);
      hole++;
    }
  }

  // Stage 2 · Temel: the raft rises out of the board
  piece(box(mats.raft, [W + 0.24, RAFT_H, D + 0.24], [0, RAFT_H / 2, 0], building), "rise", [1, 0.05, 0.7]);

  // Stage 3 · Karkas: floor by floor, columns then the slab above; a small crane works the site
  const columnXs = [-W / 2 + 0.05, -W / 6, W / 6, W / 2 - 0.05];
  const columnZs = [-D / 2 + 0.05, 0, D / 2 - 0.05];
  for (let floor = 0; floor < FLOORS; floor++) {
    const level = new THREE.Group();
    for (const cx of columnXs) {
      for (const cz of columnZs) {
        box(mats.card, [0.055, FLOOR_H - 0.04, 0.055], [cx, floorBase(floor) + (FLOOR_H - 0.04) / 2, cz], level);
      }
    }
    // Floor plates are timber; the roof plate is white card, as on a real working model
    box(floor === FLOORS - 1 ? mats.card : mats.timber, [W, 0.04, D], [0, floorBase(floor + 1) - 0.02, 0], level);
    building.add(level);
    const start = 0.05 + floor * 0.13;
    piece(level, "drop", [2, start, start + 0.2]);
  }

  const crane = new THREE.Group();
  const craneX = side + 0.55;
  const craneZ = -D / 2 - 0.15;
  const mastH = floorBase(FLOORS) + 0.9;
  box(mats.card, [0.09, mastH, 0.09], [0, mastH / 2, 0], crane);
  const jib = new THREE.Group();
  jib.position.set(0, mastH, 0);
  box(mats.timber, [2.4, 0.06, 0.07], [-0.75, 0, 0], jib);
  box(mats.card, [0.28, 0.14, 0.14], [0.55, -0.02, 0], jib);
  box(mats.ink, [0.006, 0.8, 0.006], [-1.35, -0.4, 0], jib);
  crane.add(jib);
  crane.position.set(craneX, 0, craneZ);
  building.add(crane);
  piece(crane, "rise", [2, 0, 0.15], [3, 0, 0.2]);

  // Stage 4 · Teslim: card facades with windows, cumbas, balconies, parapet, the nameplate at the door
  const windows: THREE.Mesh[] = [];
  function windowPane(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number]) {
    const mesh = new THREE.Mesh(unitBox, mats.glass);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    parent.add(mesh);
    windows.push(mesh);
    return mesh;
  }

  const facadeH = FLOORS * FLOOR_H;
  const facadeY = RAFT_H + facadeH / 2;
  const cumbaXs = [-0.82, 0.82];
  const CUMBA_W = 0.72;
  const CUMBA_D = 0.3;

  const frontWall = new THREE.Group();
  box(mats.card, [W + WALL_T * 2, facadeH, WALL_T], [0, facadeY, D / 2 + WALL_T / 2], frontWall);
  // Ground floor: entrance with its nameplate, two wide windows
  windowPane(frontWall, [0.3, 0.26, 0.006], [0, floorBase(0) + 0.14, front + 0.003]);
  box(mats.cypress, [0.2, 0.045, 0.01], [0, floorBase(0) + 0.31, front + 0.005], frontWall);
  windowPane(frontWall, [0.62, 0.2, 0.006], [-0.95, floorBase(0) + 0.15, front + 0.003]);
  windowPane(frontWall, [0.62, 0.2, 0.006], [0.95, floorBase(0) + 0.15, front + 0.003]);
  for (let floor = 1; floor < FLOORS; floor++) {
    windowPane(frontWall, [0.3, 0.2, 0.006], [0, floorBase(floor) + 0.16, front + 0.003]);
  }
  building.add(frontWall);
  piece(frontWall, "drop", [3, 0, 0.22]);

  const sideWall = new THREE.Group();
  box(mats.card, [WALL_T, facadeH, D], [W / 2 + WALL_T / 2, facadeY, 0], sideWall);
  for (let floor = 0; floor < FLOORS; floor++) {
    for (const z of [-0.78, -0.26, 0.26, 0.78]) {
      windowPane(sideWall, [0.006, 0.2, 0.3], [side + 0.003, floorBase(floor) + 0.16, z]);
    }
  }
  building.add(sideWall);
  piece(sideWall, "drop", [3, 0.04, 0.26]);

  const backWalls = new THREE.Group();
  box(mats.card, [W + WALL_T * 2, facadeH, WALL_T], [0, facadeY, -D / 2 - WALL_T / 2], backWalls);
  box(mats.card, [WALL_T, facadeH, D], [-W / 2 - WALL_T / 2, facadeY, 0], backWalls);
  building.add(backWalls);
  piece(backWalls, "drop", [3, 0.08, 0.3]);

  cumbaXs.forEach((x, i) => {
    const cumba = new THREE.Group();
    const h = (FLOORS - 1) * FLOOR_H - 0.04;
    const y = floorBase(1) + h / 2 + 0.02;
    box(mats.card, [CUMBA_W, h, CUMBA_D], [x, y, front + CUMBA_D / 2], cumba);
    for (let floor = 1; floor < FLOORS; floor++) {
      for (const dx of [-0.17, 0.17]) {
        windowPane(cumba, [0.24, 0.2, 0.006], [x + dx, floorBase(floor) + 0.16, front + CUMBA_D + 0.003]);
      }
    }
    building.add(cumba);
    piece(cumba, "drop", [3, 0.14 + i * 0.05, 0.36 + i * 0.05]);
  });

  for (let floor = 1; floor < FLOORS; floor++) {
    const balcony = new THREE.Group();
    box(mats.timber, [0.3, 0.03, 0.95], [side + 0.15, floorBase(floor) + 0.015, 0], balcony);
    box(mats.timber, [0.012, 0.11, 0.95], [side + 0.295, floorBase(floor) + 0.085, 0], balcony);
    building.add(balcony);
    const start = 0.2 + floor * 0.025;
    piece(balcony, "drop", [3, start, start + 0.16]);
  }

  const parapet = new THREE.Group();
  const roofY = floorBase(FLOORS) + 0.05;
  box(mats.card, [W + WALL_T * 2, 0.1, WALL_T], [0, roofY, front - WALL_T / 2], parapet);
  box(mats.card, [W + WALL_T * 2, 0.1, WALL_T], [0, roofY, -front + WALL_T / 2], parapet);
  box(mats.card, [WALL_T, 0.1, D], [side - WALL_T / 2, roofY, 0], parapet);
  box(mats.card, [WALL_T, 0.1, D], [-side + WALL_T / 2, roofY, 0], parapet);
  box(mats.card, [0.5, 0.24, 0.42], [-0.9, floorBase(FLOORS) + 0.12, -0.5], parapet);
  building.add(parapet);
  piece(parapet, "drop", [3, 0.3, 0.45]);

  // Windows light one by one at dusk, in a fixed pseudo-random order so scrolling back and forth is stable
  const litOrder = windows.map((_, i) => i).sort((a, b) => Math.sin(a * 12.9898) * 43758.5453 % 1 - Math.sin(b * 12.9898) * 43758.5453 % 1);

  // ── Timeline ───────────────────────────────────────────────────────────────
  function apply(progress: number) {
    for (const p of pieces) {
      const enter = easeOutQuart(span(progress, ...p.enter));
      const exit = p.exit ? easeOutQuart(span(progress, ...p.exit)) : 0;
      const amount = enter * (1 - exit);
      p.object.visible = amount > 0.002;
      if (!p.object.visible) continue;
      p.object.position.copy(p.base);
      p.object.scale.copy(p.baseScale);
      switch (p.mode) {
        case "drop":
          p.object.position.y = p.base.y + (1 - amount) * 0.9;
          break;
        case "rise":
          p.object.position.y = p.base.y - (1 - amount) * (p.object === crane ? mastH : RAFT_H);
          break;
        case "growX":
          p.object.scale.x = p.baseScale.x * amount;
          break;
        case "growZ":
          p.object.scale.z = p.baseScale.z * amount;
          break;
      }
    }

    jib.rotation.y = 0.9 + progress * 2.4;

    // Dusk: the room fill fades, the lamp stays; windows come on through the handover stage
    const dusk = easeInOut(span(progress, 3, 0.25, 0.6));
    fill.intensity = THREE.MathUtils.lerp(1.6, 0.85, dusk);
    spot.intensity = THREE.MathUtils.lerp(2.1, 2.2, dusk);
    // Not every home is lit at dusk; a few dark windows keep it a lived-in building, not a lit grid
    const litCount = Math.round(span(progress, 3, 0.35, 0.92) * windows.length * 0.8);
    litOrder.forEach((windowIndex, order) => {
      windows[windowIndex].material = order < litCount ? mats.lit : mats.glass;
    });

    // The camera starts close on the ground survey and pulls back as the building rises
    const reveal = easeInOut(clamp01(progress * 1.15));
    const azimuth = 0.78 - 0.2 * reveal;
    const elevation = 0.66 - 0.2 * reveal;
    const radius = 2.5 + 1.15 * reveal;
    const lookAt = new THREE.Vector3(-0.35, 0.1 + 0.85 * reveal, -0.25);
    const fovV = THREE.MathUtils.degToRad(camera.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(fovV, fovH) / 2);
    camera.position.set(
      lookAt.x + distance * Math.sin(azimuth) * Math.cos(elevation),
      lookAt.y + distance * Math.sin(elevation),
      lookAt.z + distance * Math.cos(azimuth) * Math.cos(elevation)
    );
    camera.lookAt(lookAt);
  }

  // ── Render on demand: only while easing toward the target, and only when in view ──
  let target = options.reducedMotion ? 1 : 0;
  let shown = target;
  let active = false;
  let frame = 0;
  let last = 0;

  function draw() {
    apply(shown);
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    frame = 0;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    const diff = target - shown;
    shown = Math.abs(diff) < 0.0005 ? target : shown + diff * (1 - Math.exp(-dt * 6));
    draw();
    if (shown !== target && active) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function wake() {
    if (!frame && active) frame = requestAnimationFrame(tick);
  }

  return {
    setTarget(progress) {
      // Reduced motion shows the final lit model as a still (docs/DESIGN.md)
      if (options.reducedMotion) return;
      target = clamp01(progress);
      wake();
    },
    setActive(next) {
      active = next;
      if (active) wake();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    },
    resize(width, height) {
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      draw();
    },
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      unitBox.dispose();
      unitCylinder.dispose();
      canopyGeometry.dispose();
      Object.values(mats).forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
