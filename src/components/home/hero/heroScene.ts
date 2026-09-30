import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// The home hero (docs/DESIGN.md → Hero): a finished architectural presentation model at night, photographed like a
// museum maquette. White card and basswood, recessed windows, a context of plain massing blocks dissolving into
// Deep Cypress fog, a tilt-shift lens, windows lighting one by one and then switching like a lived-in building.
//
// Performance: all static geometry is merged into one mesh per material and the windows are two instanced meshes,
// so the scene is ~15 draw calls; the shadow map is rendered once; frames are drawn only during the intro, while the
// pointer moves, and when a window switches.

export interface HeroSceneOptions {
  mobile: boolean;
  reducedMotion: boolean;
  // The intro already played this session: open on the lit building
  introSeen: boolean;
}

export interface HeroScene {
  setActive(active: boolean): void;
  setPointer(x: number, y: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

// sRGB equivalents of the docs/DESIGN.md OKLCH tokens; night is Deep Cypress, the page background behind the canvas
const COLOR = {
  night: 0x102914,
  board: 0x163519,
  street: 0x0c200f,
  pavement: 0x1b3c20,
  card: 0xf2f3f1,
  context: 0x8e9a92,
  tree: 0xdfe5e1,
  timber: 0xcdb48c,
  glass: 0x0d1813,
  lamp: 0xfca953,
  // Warmer and paler than Lamp: a tungsten-lit room seen through glass, not a painted patch
  interior: 0xffc98a,
  cypress: 0x1b3e21,
};

const FLOORS = 6;
const FLOOR_H = 0.36;
const W = 3.0; // front facade, along x
const D = 2.2; // side facade, along z
const BASE = 0.06; // plinth under the building
const SLAB = 0.045; // projecting floor band
const WALL = 0.04; // facade depth; glass sits RECESS behind the face
const RECESS = 0.034;
const TOP = BASE + FLOORS * FLOOR_H;
const BAY_XS = [-0.82, 0.82];
const BAY_W = 0.72;
const BAY_D = 0.26;
const LIT_SHARE = 0.78;
const LIFE_INTERVAL = 2400; // ms between one window switching on or off
const INTRO_END = 5.6; // s: camera settled, every window that will light is lit

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeInOut = (x: number) => (x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2);

type Vec3 = [number, number, number];

interface WindowSpec {
  c: number; // centre along the facade
  w: number;
  door?: boolean; // reaches the floor band (balcony doors, the entrance)
}

// Tilt-shift: a separable 5-tap blur that grows above and below a sharp horizontal band, as with a shifted lens.
// Screen-space only, so it costs two cheap fullscreen passes instead of re-rendering the scene for depth.
const TiltShiftShader = {
  uniforms: {
    tDiffuse: { value: null },
    direction: { value: new THREE.Vector2() },
    focus: { value: 0.5 },
    band: { value: 0.22 },
    spread: { value: 0.3 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 direction;
    uniform float focus;
    uniform float band;
    uniform float spread;
    varying vec2 vUv;
    void main() {
      float amount = smoothstep(band, band + spread, abs(vUv.y - focus));
      vec2 off1 = direction * 1.3846153846 * amount;
      vec2 off2 = direction * 3.2307692308 * amount;
      vec4 sum = texture2D(tDiffuse, vUv) * 0.2270270270;
      sum += (texture2D(tDiffuse, vUv + off1) + texture2D(tDiffuse, vUv - off1)) * 0.3162162162;
      sum += (texture2D(tDiffuse, vUv + off2) + texture2D(tDiffuse, vUv - off2)) * 0.0702702703;
      gl_FragColor = sum;
    }`,
};

// A soft darkening under the model where it meets the board (stands in for screen-space AO)
function contactShadowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.28, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(0,0,0,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

export async function createHeroScene(canvas: HTMLCanvasElement, options: HeroSceneOptions): Promise<HeroScene> {
  const { mobile, reducedMotion } = options;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Nothing in the scene moves, so the shadow map is drawn once
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  // No tone mapping: every tone mapper shifts the Deep Cypress night off the page background around the canvas
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLOR.night, 10, 20);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 120);

  // A fogged dome instead of a clear colour: the composer's clear path encodes the colour twice, the shader path doesn't
  const dome = new THREE.Mesh(new THREE.SphereGeometry(80, 16, 8), new THREE.MeshBasicMaterial({ color: COLOR.night, side: THREE.BackSide }));
  scene.add(dome);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.1;

  // ── Light: cool sky, a moon that casts soft shadows, a dim warm lobby ─────────────────────────────────
  scene.add(new THREE.HemisphereLight(0xaebfd0, COLOR.street, 0.32));
  const moon = new THREE.DirectionalLight(0xdbe5f2, 0.8);
  moon.position.set(-3.2, 7.5, 6.5);
  moon.castShadow = true;
  moon.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  moon.shadow.camera.left = -5;
  moon.shadow.camera.right = 5;
  moon.shadow.camera.top = 5;
  moon.shadow.camera.bottom = -5;
  moon.shadow.camera.near = 2;
  moon.shadow.camera.far = 20;
  moon.shadow.bias = -0.0003;
  moon.shadow.normalBias = 0.015;
  moon.shadow.radius = 3;
  scene.add(moon);

  const lobbyLight = new THREE.PointLight(0xffb46b, 0.25, 1.6, 2);
  lobbyLight.position.set(0, 0.25, D / 2 + 0.35);
  scene.add(lobbyLight);

  // ── Materials ─────────────────────────────────────────────────────────────────────────────────────────
  const standard = (color: number, roughness: number, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const mats = {
    card: standard(COLOR.card, 0.82),
    context: standard(COLOR.context, 0.9),
    tree: standard(COLOR.tree, 0.95),
    timber: standard(COLOR.timber, 0.7),
    board: standard(COLOR.board, 0.95),
    street: standard(COLOR.street, 0.95),
    pavement: standard(COLOR.pavement, 0.95),
    cypress: standard(COLOR.cypress, 0.6),
    // Dark acrylic: reflects the room environment a little instead of reading as a black hole
    glass: new THREE.MeshStandardMaterial({ color: COLOR.glass, roughness: 0.1, metalness: 0.3, envMapIntensity: 6 }),
    // Brighter than white so only lit windows cross the bloom threshold
    lit: new THREE.MeshBasicMaterial({ color: new THREE.Color(COLOR.interior).multiplyScalar(1.35) }),
    // Lobby and street-lamp bulbs stay under the threshold: warm, but no glare at the centre of the frame
    lobby: new THREE.MeshBasicMaterial({ color: new THREE.Color(COLOR.lamp).multiplyScalar(0.55) }),
    bulb: new THREE.MeshBasicMaterial({ color: new THREE.Color(COLOR.lamp).multiplyScalar(1.3) }),
    contact: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, depthWrite: false, map: contactShadowTexture() }),
  };

  // ── Static geometry is collected per material and merged at the end ───────────────────────────────────
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  function add(mat: THREE.Material, geometry: THREE.BufferGeometry) {
    const list = buckets.get(mat);
    if (list) list.push(geometry);
    else buckets.set(mat, [geometry]);
  }
  function box(mat: THREE.Material, size: Vec3, position: Vec3) {
    const geometry = new THREE.BoxGeometry(...size);
    geometry.translate(...position);
    add(mat, geometry);
  }

  // ── The table: board, streets, pavements reach past the fog so no edge ever shows ─────────────────────
  box(mats.board, [80, 0.1, 80], [0, -0.05, 0]);
  box(mats.street, [80, 0.004, 1.0], [0, 0.002, D / 2 + 1.55]);
  box(mats.street, [1.0, 0.004, 80], [W / 2 + 1.55, 0.002, 0]);
  box(mats.pavement, [80, 0.025, 0.95], [0, 0.0125, D / 2 + 0.58]);
  box(mats.pavement, [0.95, 0.025, 80], [W / 2 + 0.58, 0.0125, 0]);
  box(mats.card, [W + 0.4, BASE, D + 0.4], [0, BASE / 2, 0]);

  const contact = new THREE.Mesh(new THREE.PlaneGeometry(W + 1.8, D + 1.8), mats.contact);
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.027;
  scene.add(contact);

  // ── The building ──────────────────────────────────────────────────────────────────────────────────────
  const windowMatrices: THREE.Matrix4[] = [];

  // Solid core behind the facades; the facades are built from real piers, sills and lintels so the glass is recessed
  box(mats.card, [W - 0.1, TOP - BASE, D - 0.1], [0, (TOP + BASE) / 2, 0]);

  const floorY = (floor: number) => BASE + floor * FLOOR_H;

  // Size and centre of a box on a facade plane. u runs along the facade, depth is measured inward from its face.
  function onFacade(plane: "front" | "side", face: number, u: [number, number], y: [number, number], depth: [number, number]): [Vec3, Vec3] {
    const du = u[1] - u[0];
    const dy = y[1] - y[0];
    const dd = depth[1] - depth[0];
    const uc = (u[0] + u[1]) / 2;
    const yc = (y[0] + y[1]) / 2;
    const dc = face - (depth[0] + depth[1]) / 2;
    return plane === "front" ? [[du, dy, dd], [uc, yc, dc]] : [[dd, dy, du], [dc, yc, uc]];
  }

  function facade(plane: "front" | "side", face: number, from: number, to: number, floor: number, specs: WindowSpec[], lobby = false) {
    const y0 = floorY(floor) + SLAB / 2;
    const y1 = floorY(floor + 1) - SLAB / 2;
    const sill = 0.075;
    const lintel = 0.05;
    const openings = [...specs].sort((a, b) => a.c - b.c);

    box(mats.card, ...onFacade(plane, face, [from, to], [y1 - lintel, y1], [0, WALL]));
    let cursor = from;
    for (const spec of openings) {
      const left = spec.c - spec.w / 2;
      const right = spec.c + spec.w / 2;
      if (left > cursor) box(mats.card, ...onFacade(plane, face, [cursor, left], [y0, y1 - lintel], [0, WALL]));
      const bottom = spec.door ? y0 : y0 + sill;
      if (!spec.door) box(mats.card, ...onFacade(plane, face, [left, right], [y0, bottom], [0, WALL]));
      const [size, position] = onFacade(plane, face, [left, right], [bottom, y1 - lintel], [RECESS, RECESS + 0.01]);
      if (lobby) box(mats.lobby, size, position);
      else windowMatrices.push(new THREE.Matrix4().compose(new THREE.Vector3(...position), new THREE.Quaternion(), new THREE.Vector3(...size)));
      // A single slender mullion, like a laser-cut frame
      box(mats.card, ...onFacade(plane, face, [spec.c - 0.006, spec.c + 0.006], [bottom, y1 - lintel], [RECESS - 0.008, RECESS]));
      cursor = right;
    }
    if (to > cursor) box(mats.card, ...onFacade(plane, face, [cursor, to], [y0, y1 - lintel], [0, WALL]));
  }

  const front = D / 2;
  const side = W / 2;

  // Ground floor: a warm, fully glazed lobby with the entrance at its centre
  facade("front", front, -side, side, 0, [
    { c: -0.95, w: 0.7 },
    { c: 0, w: 0.34, door: true },
    { c: 0.95, w: 0.7 },
  ], true);
  facade("side", side, -front, front, 0, [
    { c: -0.55, w: 0.5 },
    { c: 0.55, w: 0.5 },
  ], true);

  for (let floor = 1; floor < FLOORS; floor++) {
    // Front: the stair window between the two bays; the bays carry the homes
    facade("front", front, -side, side, floor, [{ c: 0, w: 0.26 }]);
    for (const bx of BAY_XS) {
      facade("front", front + BAY_D, bx - BAY_W / 2, bx + BAY_W / 2, floor, [
        { c: bx - 0.17, w: 0.24 },
        { c: bx + 0.17, w: 0.24 },
      ]);
    }
    // Side: balcony doors in the middle, windows either side
    facade("side", side, -front, front, floor, [
      { c: -0.8, w: 0.28 },
      { c: -0.22, w: 0.3, door: true },
      { c: 0.22, w: 0.3, door: true },
      { c: 0.8, w: 0.28 },
    ]);
  }

  // Bays: side cheeks and their own projecting bands
  for (const bx of BAY_XS) {
    for (const edge of [bx - BAY_W / 2, bx + BAY_W / 2]) {
      box(mats.card, [WALL, TOP - floorY(1), BAY_D], [edge + (edge < bx ? WALL / 2 : -WALL / 2), (TOP + floorY(1)) / 2, front + BAY_D / 2]);
    }
    for (let level = 1; level <= FLOORS; level++) {
      box(mats.card, [BAY_W + 0.06, SLAB, BAY_D + 0.03], [bx, floorY(level), front + BAY_D / 2 + 0.015]);
    }
  }

  // Floor bands wrap the whole building: the horizontal rhythm of a Bakırköy apartment block
  for (let level = 0; level <= FLOORS; level++) {
    box(mats.card, [W + 0.08, SLAB, D + 0.08], [0, floorY(level), 0]);
  }

  // Entrance canopy and the nameplate above it
  box(mats.card, [0.7, 0.022, 0.34], [0, floorY(1) - 0.075, front + 0.17]);
  box(mats.cypress, [0.26, 0.05, 0.012], [0, floorY(1) - 0.035, front + 0.012]);

  // Balconies: basswood decks with laser-thin rails
  for (let floor = 1; floor < FLOORS; floor++) {
    const y = floorY(floor);
    const deckX = side + 0.14;
    box(mats.timber, [0.28, 0.026, 1.0], [deckX, y + 0.013, 0]);
    box(mats.card, [0.01, 0.01, 1.0], [side + 0.275, y + 0.125, 0]);
    for (let i = 0; i <= 14; i++) {
      box(mats.card, [0.005, 0.11, 0.005], [side + 0.275, y + 0.07, -0.49 + i * 0.07]);
    }
    for (const z of [-0.5, 0.5]) {
      box(mats.card, [0.28, 0.01, 0.01], [deckX, y + 0.125, z]);
    }
  }

  // Roof: parapet, a set-back plant room, a basswood pergola over the terrace
  box(mats.card, [W + 0.08, 0.08, 0.03], [0, TOP + 0.04, front + 0.025]);
  box(mats.card, [W + 0.08, 0.08, 0.03], [0, TOP + 0.04, -front - 0.025]);
  box(mats.card, [0.03, 0.08, D + 0.08], [side + 0.025, TOP + 0.04, 0]);
  box(mats.card, [0.03, 0.08, D + 0.08], [-side - 0.025, TOP + 0.04, 0]);
  box(mats.card, [1.1, 0.26, 0.85], [-0.8, TOP + 0.13, -0.5]);
  for (const [px, pz] of [[0.3, -0.2], [1.3, -0.2], [0.3, 0.8], [1.3, 0.8]]) {
    box(mats.timber, [0.02, 0.22, 0.02], [px, TOP + 0.11, pz]);
  }
  for (let i = 0; i < 13; i++) {
    box(mats.timber, [0.018, 0.014, 1.06], [0.3 + i * 0.083, TOP + 0.228, 0.3]);
  }

  // ── Street furniture: maquette trees in white card, two street lamps away from the entrance ───────────
  function tree(x: number, z: number, s: number) {
    box(mats.card, [0.012 * s, 0.34 * s, 0.012 * s], [x, 0.17 * s + 0.025, z]);
    const canopy = new THREE.IcosahedronGeometry(0.2 * s, 2);
    canopy.translate(x, 0.46 * s, z);
    add(mats.tree, canopy);
  }
  tree(-0.95, front + 0.72, 0.95);
  tree(2.2, front + 0.7, 1);
  tree(side + 0.7, -1.3, 1.05);
  tree(side + 0.72, -3.0, 0.95);

  for (const [x, z] of [[side + 1.0, -2.1], [side + 1.0, 1.4]]) {
    box(mats.card, [0.012, 0.5, 0.012], [x, 0.275, z]);
    const bulb = new THREE.SphereGeometry(0.028, 12, 8);
    bulb.translate(x, 0.53, z);
    add(mats.bulb, bulb);
  }

  // ── Context: plain massing blocks, as on an architect's site model ────────────────────────────────────
  for (const [x, z, w, d, h] of [
    [-5.6, -2.4, 2.2, 2.2, 1.7],
    [-2.2, -4.3, 2.8, 2.0, 2.3],
    [1.4, -4.4, 2.2, 2.2, 1.5],
    [4.8, -2.6, 2.0, 2.6, 2.0],
    [-5.2, -4.8, 2.2, 2.2, 2.7],
    [5.6, 2.2, 1.8, 2.2, 1.2],
  ]) {
    box(mats.context, [w, h, d], [x, h / 2, z]);
  }

  // ── Merge: one mesh per material ──────────────────────────────────────────────────────────────────────
  const merged: THREE.Mesh[] = [];
  for (const [mat, list] of buckets) {
    const geometry = mergeGeometries(list);
    list.forEach((g) => g.dispose());
    const mesh = new THREE.Mesh(geometry, mat);
    const emitsLight = mat === mats.lobby || mat === mats.bulb;
    mesh.castShadow = !emitsLight && mat !== mats.board && mat !== mats.street && mat !== mats.pavement;
    mesh.receiveShadow = !emitsLight;
    scene.add(mesh);
    merged.push(mesh);
  }

  // ── Windows: two instanced meshes; a window is shown in exactly one of them ───────────────────────────
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const glassWindows = new THREE.InstancedMesh(unitBox, mats.glass, windowMatrices.length);
  const litWindows = new THREE.InstancedMesh(unitBox, mats.lit, windowMatrices.length);
  for (const mesh of [glassWindows, litWindows]) {
    mesh.frustumCulled = false;
    scene.add(mesh);
  }
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  const isLit = windowMatrices.map(() => false);

  // A fixed pseudo-random order, so the intro is the same building every time
  const litOrder = windowMatrices.map((_, i) => i).sort((a, b) => ((Math.sin(a * 12.9898) * 43758.5453) % 1) - ((Math.sin(b * 12.9898) * 43758.5453) % 1));
  const flipped = new Set<number>();
  let litCount = -1;
  let windowsDirty = true;

  function setLit(fraction: number) {
    const count = Math.round(fraction * windowMatrices.length * LIT_SHARE);
    if (count === litCount && !windowsDirty) return;
    litCount = count;
    windowsDirty = false;
    litOrder.forEach((index, order) => {
      isLit[index] = order < count !== flipped.has(index);
      glassWindows.setMatrixAt(index, isLit[index] ? hidden : windowMatrices[index]);
      litWindows.setMatrixAt(index, isLit[index] ? windowMatrices[index] : hidden);
    });
    glassWindows.instanceMatrix.needsUpdate = true;
    litWindows.instanceMatrix.needsUpdate = true;
  }

  // Keeps roughly 70–85% of homes lit: always lived-in, never a lit grid or a dark block
  function toggleWindow() {
    const litShare = isLit.filter(Boolean).length / isLit.length;
    const turnOn = litShare < 0.7 ? true : litShare > 0.85 ? false : Math.random() < 0.5;
    const candidates = isLit.flatMap((lit, i) => (lit !== turnOn ? [i] : []));
    if (candidates.length === 0) return;
    const index = candidates[Math.floor(Math.random() * candidates.length)];
    if (flipped.has(index)) flipped.delete(index);
    else flipped.add(index);
    windowsDirty = true;
  }

  // ── Post: tilt-shift lens, tight bloom on the lit windows ─────────────────────────────────────────────
  // 2× MSAA: the edges are mostly horizontal and vertical, and the resolve is one of the costliest steps on integrated GPUs
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const tiltH = new ShaderPass(TiltShiftShader);
  const tiltV = new ShaderPass(TiltShiftShader);
  composer.addPass(tiltH);
  composer.addPass(tiltV);
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.3, 0.75));
  composer.addPass(new OutputPass());

  // ── Camera: opens a little closer and pulls back while the windows light; follows the pointer ─────────
  const lookAt = new THREE.Vector3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  // A loose threshold ends the frames soon after the pointer stops; the last step is invisible at this parallax scale
  const pointerSettled = () => Math.abs(pointer.tx - pointer.x) < 0.004 && Math.abs(pointer.ty - pointer.y) < 0.004;

  function update(t: number, dt: number) {
    const intro = reducedMotion ? 1 : easeOutQuart(clamp01(t / 5.5));
    setLit(reducedMotion ? 1 : easeInOut(clamp01((t - 0.9) / 3.6)));

    const follow = 1 - Math.exp(-dt * 6);
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;

    const azimuth = 0.6 + pointer.x * 0.12;
    const elevation = THREE.MathUtils.lerp(0.3, 0.19, intro) + pointer.y * 0.05;
    const radius = 2.45 * THREE.MathUtils.lerp(0.88, 1, intro);
    lookAt.set(0.1, THREE.MathUtils.lerp(1.35, 1.15, intro), 0.1);

    const fovV = THREE.MathUtils.degToRad(camera.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(fovV, fovH) / 2);
    camera.position.set(
      lookAt.x + distance * Math.sin(azimuth) * Math.cos(elevation),
      lookAt.y + distance * Math.sin(elevation),
      lookAt.z + distance * Math.cos(azimuth) * Math.cos(elevation)
    );
    camera.lookAt(lookAt);

    const fog = scene.fog as THREE.Fog;
    fog.near = distance * 1.0;
    fog.far = distance * 1.55;
  }

  // ── Frames on demand ──────────────────────────────────────────────────────────────────────────────────
  // The intro clock starts on the first visible frame, not when the scene is built (compiling can take a moment)
  const skipIntro = options.introSeen || reducedMotion;
  let start = -1;
  const elapsed = (now: number) => (start < 0 ? (skipIntro ? INTRO_END : 0) : (now - start) / 1000);
  let last = 0;
  let frame = 0;
  let active = false;
  let skip = false;
  let lifeTimer = 0;

  const animating = (now: number) => !reducedMotion && (elapsed(now) < INTRO_END || !pointerSettled());

  // Adaptive resolution: if animated frames stay slow on this GPU, render fewer pixels (never below 0.7)
  const size = { width: 1, height: 1 };
  let pixelRatio = renderer.getPixelRatio();
  const slowFrame = mobile ? 1 / 24 : 1 / 45; // mobile renders every other frame on purpose
  let slowCount = 0;
  let frameCount = 0;

  function applySize() {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(size.width, size.height, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(size.width, size.height);
  }

  // Counts slow frames rather than averaging, so one-off stalls (shader compiles, a busy main thread) never trigger it
  function measure(dt: number) {
    frameCount++;
    if (dt > slowFrame) slowCount++;
    if (frameCount < 40) return;
    const mostlySlow = slowCount > frameCount / 2;
    slowCount = 0;
    frameCount = 0;
    if (mostlySlow && pixelRatio > 0.7) {
      pixelRatio = Math.max(0.7, pixelRatio - 0.2);
      applySize();
    }
  }

  function render(now: number) {
    if (last) measure(Math.min(0.1, (now - last) / 1000));
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    update(elapsed(now), dt);
    composer.render(dt);
  }

  function loop(now: number) {
    frame = 0;
    // Mobile draws the intro at 30fps
    skip = !skip;
    if (!(mobile && skip && animating(now))) render(now);
    if (active && animating(now)) frame = requestAnimationFrame(loop);
    else last = 0;
  }

  function requestRender() {
    if (active && !frame) frame = requestAnimationFrame(loop);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    window.clearInterval(lifeTimer);
    lifeTimer = 0;
  }

  // Compile every shader before the first visible frame, off the main thread where the browser supports it
  await renderer.compileAsync(scene, camera);

  return {
    setActive(next) {
      active = next;
      if (!active) return stop();
      if (start < 0) start = performance.now() - (skipIntro ? INTRO_END * 1000 : 0);
      requestRender();
      if (!reducedMotion && !lifeTimer) {
        lifeTimer = window.setInterval(() => {
          if (elapsed(performance.now()) < INTRO_END) return;
          toggleWindow();
          requestRender();
        }, LIFE_INTERVAL);
      }
    },
    setPointer(x, y) {
      if (reducedMotion) return;
      pointer.tx = x;
      pointer.ty = y;
      requestRender();
    },
    resize(width, height) {
      if (width === 0 || height === 0) return;
      size.width = width;
      size.height = height;
      applySize();
      // Blur radius in CSS pixels, so the lens looks the same at any pixel ratio
      tiltH.uniforms.direction.value.set(2.2 / width, 0);
      tiltV.uniforms.direction.value.set(0, 2.2 / height);
      camera.aspect = width / height;
      // Desktop: shift the frame so the building stands right of the headline
      if (!mobile) camera.setViewOffset(width, height, -width * 0.23, 0, width, height);
      camera.updateProjectionMatrix();
      if (!frame) render(performance.now());
    },
    dispose() {
      stop();
      merged.forEach((mesh) => mesh.geometry.dispose());
      unitBox.dispose();
      glassWindows.dispose();
      litWindows.dispose();
      contact.geometry.dispose();
      mats.contact.map?.dispose();
      Object.values(mats).forEach((m) => m.dispose());
      dome.geometry.dispose();
      (dome.material as THREE.Material).dispose();
      environment.dispose();
      pmrem.dispose();
      composer.passes.forEach((pass) => pass.dispose());
      composer.dispose();
      target.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
