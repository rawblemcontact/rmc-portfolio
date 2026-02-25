import { useEffect, useRef } from "react";

/**
 * Flat Surface Shader background — renders an animated low-poly triangulated
 * mesh on a <canvas>. Adapted from Matthew Wagerfield's FSS library (MIT).
 *
 * Drop this into any container with `position: relative; overflow: hidden` and
 * the canvas will fill it edge-to-edge at the given opacity.
 */

// ── FSS types (minimal, internal only) ──────────────────────────────────────

type Vec3 = Float32Array;
type Vec4 = Float32Array;

interface FSSColor {
  rgba: Vec4;
  hex: string;
  opacity: number;
  set(hex: string, opacity?: number): FSSColor;
  hexify(ch: number): string;
  format(): string;
}

interface FSSVertex {
  position: Vec3;
  anchor?: Vec3;
  step?: Vec3;
  time?: number;
}

interface FSSTriangle {
  a: FSSVertex;
  b: FSSVertex;
  c: FSSVertex;
  vertices: FSSVertex[];
  u: Vec3;
  v: Vec3;
  centroid: Vec3;
  normal: Vec3;
  color: FSSColor;
  computeCentroid(): void;
  computeNormal(): void;
}

interface FSSGeometry {
  vertices: FSSVertex[];
  triangles: FSSTriangle[];
  dirty: boolean;
  segmentWidth: number;
  sliceHeight: number;
  update(): void;
}

interface FSSMaterial {
  ambient: FSSColor;
  diffuse: FSSColor;
  slave: FSSColor;
}

interface FSSLight {
  position: Vec3;
  ambient: FSSColor;
  diffuse: FSSColor;
  ray: Vec3;
  ambientHex: string;
  diffuseHex: string;
  mass: number;
  velocity: Vec3;
  acceleration: Vec3;
  force: Vec3;
}

interface FSSMesh {
  geometry: FSSGeometry;
  material: FSSMaterial;
  side: number;
  visible: boolean;
  update(lights: FSSLight[], calc: boolean): void;
}

interface FSSScene {
  meshes: FSSMesh[];
  lights: FSSLight[];
  add(obj: FSSMesh | FSSLight): void;
  remove(obj: FSSMesh | FSSLight): void;
}

// ── Vector helpers ──────────────────────────────────────────────────────────

const Arr = Float32Array;

function v3(x = 0, y = 0, z = 0): Vec3 {
  const v = new Arr(3);
  v[0] = x;
  v[1] = y;
  v[2] = z;
  return v;
}

function v4(x = 0, y = 0, z = 0, w = 0): Vec4 {
  const v = new Arr(4);
  v[0] = x;
  v[1] = y;
  v[2] = z;
  v[3] = w;
  return v;
}

const V3 = {
  set(t: Vec3, x = 0, y = 0, z = 0) { t[0] = x; t[1] = y; t[2] = z; },
  copy(t: Vec3, a: Vec3) { t[0] = a[0]; t[1] = a[1]; t[2] = a[2]; },
  clone(a: Vec3) { const c = v3(); V3.copy(c, a); return c; },
  add(t: Vec3, a: Vec3) { t[0] += a[0]; t[1] += a[1]; t[2] += a[2]; },
  sub(t: Vec3, a: Vec3, b: Vec3) { t[0] = a[0] - b[0]; t[1] = a[1] - b[1]; t[2] = a[2] - b[2]; },
  cross(t: Vec3, a: Vec3, b: Vec3) { t[0] = a[1] * b[2] - a[2] * b[1]; t[1] = a[2] * b[0] - a[0] * b[2]; t[2] = a[0] * b[1] - a[1] * b[0]; },
  dot(a: Vec3, b: Vec3) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; },
  len(a: Vec3) { return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); },
  norm(t: Vec3) { const l = V3.len(t); if (l) { t[0] /= l; t[1] /= l; t[2] /= l; } },
  mulS(t: Vec3, s: number) { t[0] *= s; t[1] *= s; t[2] *= s; },
  distSq(a: Vec3, b: Vec3) { const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2]; return dx * dx + dy * dy + dz * dz; },
  limit(t: Vec3, min: number | null, max: number | null) {
    const l = V3.len(t);
    if (min !== null && l < min) { V3.setLen(t, min); }
    else if (max !== null && l > max) { V3.setLen(t, max); }
  },
  setLen(t: Vec3, l: number) { const cl = V3.len(t); if (cl && l !== cl) V3.mulS(t, l / cl); },
};

const V4 = {
  set(t: Vec4, x = 0, y = 0, z = 0, w = 0) { t[0] = x; t[1] = y; t[2] = z; t[3] = w; },
  add(t: Vec4, a: Vec4) { t[0] += a[0]; t[1] += a[1]; t[2] += a[2]; t[3] += a[3]; },
  mulV(t: Vec4, a: Vec4, b: Vec4) { t[0] = a[0] * b[0]; t[1] = a[1] * b[1]; t[2] = a[2] * b[2]; t[3] = a[3] * b[3]; },
  mulS(t: Vec4, s: number) { t[0] *= s; t[1] *= s; t[2] *= s; t[3] *= s; },
  clamp(t: Vec4, lo: number, hi: number) {
    for (let i = 0; i < 4; i++) t[i] = Math.max(lo, Math.min(hi, t[i]));
  },
};

// ── Color helper ────────────────────────────────────────────────────────────

function makeColor(hex = "#000000", opacity = 1): FSSColor {
  const c: FSSColor = {
    rgba: v4(),
    hex,
    opacity,
    set(h, op) {
      h = h.replace("#", "");
      const sz = h.length / 3;
      c.rgba[0] = parseInt(h.substring(0, sz), 16) / 255;
      c.rgba[1] = parseInt(h.substring(sz, sz * 2), 16) / 255;
      c.rgba[2] = parseInt(h.substring(sz * 2, sz * 3), 16) / 255;
      if (op !== undefined) c.rgba[3] = op;
      return c;
    },
    hexify(ch) {
      const h = Math.ceil(ch * 255).toString(16);
      return h.length === 1 ? "0" + h : h;
    },
    format() {
      c.hex = "#" + c.hexify(c.rgba[0]) + c.hexify(c.rgba[1]) + c.hexify(c.rgba[2]);
      return c.hex;
    },
  };
  c.set(hex, opacity);
  return c;
}

// ── Geometry builders ───────────────────────────────────────────────────────

function makeVertex(x = 0, y = 0, z = 0): FSSVertex {
  return { position: v3(x, y, z) };
}

function makeTriangle(a: FSSVertex, b: FSSVertex, c: FSSVertex): FSSTriangle {
  const tri: FSSTriangle = {
    a, b, c,
    vertices: [a, b, c],
    u: v3(), v: v3(),
    centroid: v3(), normal: v3(),
    color: makeColor(),
    computeCentroid() {
      tri.centroid[0] = (a.position[0] + b.position[0] + c.position[0]) / 3;
      tri.centroid[1] = (a.position[1] + b.position[1] + c.position[1]) / 3;
      tri.centroid[2] = (a.position[2] + b.position[2] + c.position[2]) / 3;
    },
    computeNormal() {
      V3.sub(tri.u, b.position, a.position);
      V3.sub(tri.v, c.position, a.position);
      V3.cross(tri.normal, tri.u, tri.v);
      V3.norm(tri.normal);
    },
  };
  tri.computeCentroid();
  tri.computeNormal();
  return tri;
}

function makePlane(w: number, h: number, segs: number, slices: number): FSSGeometry {
  const segW = w / segs;
  const slcH = h / slices;
  const verts: FSSVertex[] = [];
  const tris: FSSTriangle[] = [];
  const grid: FSSVertex[][] = [];
  const ox = w * -0.5;
  const oy = h * 0.5;

  for (let x = 0; x <= segs; x++) {
    grid.push([]);
    for (let y = 0; y <= slices; y++) {
      const vtx = makeVertex(ox + x * segW, oy - y * slcH);
      grid[x].push(vtx);
      verts.push(vtx);
    }
  }
  for (let x = 0; x < segs; x++) {
    for (let y = 0; y < slices; y++) {
      tris.push(makeTriangle(grid[x][y], grid[x][y + 1], grid[x + 1][y]));
      tris.push(makeTriangle(grid[x + 1][y], grid[x][y + 1], grid[x + 1][y + 1]));
    }
  }

  return {
    vertices: verts,
    triangles: tris,
    dirty: false,
    segmentWidth: segW,
    sliceHeight: slcH,
    update() {
      if (this.dirty) {
        for (const t of this.triangles) { t.computeCentroid(); t.computeNormal(); }
        this.dirty = false;
      }
    },
  };
}

function makeMaterial(ambient: string, diffuse: string): FSSMaterial {
  return { ambient: makeColor(ambient), diffuse: makeColor(diffuse), slave: makeColor() };
}

function makeMesh(geo: FSSGeometry, mat: FSSMaterial): FSSMesh {
  return {
    geometry: geo,
    material: mat,
    side: 0,
    visible: true,
    update(lights, calc) {
      this.geometry.update();
      if (!calc) return;
      for (const tri of this.geometry.triangles) {
        V4.set(tri.color.rgba);
        for (const light of lights) {
          V3.sub(light.ray, light.position, tri.centroid);
          V3.norm(light.ray);
          let ill = V3.dot(tri.normal, light.ray);
          ill = Math.max(ill, 0);
          V4.mulV(this.material.slave.rgba, this.material.ambient.rgba, light.ambient.rgba);
          V4.add(tri.color.rgba, this.material.slave.rgba);
          V4.mulV(this.material.slave.rgba, this.material.diffuse.rgba, light.diffuse.rgba);
          V4.mulS(this.material.slave.rgba, ill);
          V4.add(tri.color.rgba, this.material.slave.rgba);
        }
        V4.clamp(tri.color.rgba, 0, 1);
      }
    },
  };
}

function makeLight(ambient: string, diffuse: string): FSSLight {
  return {
    position: v3(),
    ambient: makeColor(ambient),
    diffuse: makeColor(diffuse),
    ray: v3(),
    ambientHex: "",
    diffuseHex: "",
    mass: 0.5 + Math.random() * 0.5,
    velocity: v3(),
    acceleration: v3(),
    force: v3(),
  };
}

function makeScene(): FSSScene {
  const s: FSSScene = {
    meshes: [],
    lights: [],
    add(o: any) {
      if ("geometry" in o && !s.meshes.includes(o)) s.meshes.push(o);
      else if ("ray" in o && !s.lights.includes(o)) s.lights.push(o as FSSLight);
    },
    remove(o: any) {
      if ("geometry" in o) { const i = s.meshes.indexOf(o); if (i >= 0) s.meshes.splice(i, 1); }
      else if ("ray" in o) { const i = s.lights.indexOf(o as FSSLight); if (i >= 0) s.lights.splice(i, 1); }
    },
  };
  return s;
}

// ── Configuration ───────────────────────────────────────────────────────────

interface FSSConfig {
  meshAmbient?: string;
  meshDiffuse?: string;
  lightAmbient?: string;
  lightDiffuse?: string;
  lightCount?: number;
  segments?: number;
  slices?: number;
  meshSpeed?: number;
  xRange?: number;
  yRange?: number;
  zRange?: number;
  depth?: number;
}

const DEFAULTS: Required<FSSConfig> = {
  // Mesh base color: pure black base with slightly lifted diffuse so facets can catch light
  meshAmbient: "#000000",
  meshDiffuse: "#111111",
  // Lights: neutral greys, stronger than default but not flashing; fewer lights for calmer shimmer
  lightAmbient: "#848490",
  lightDiffuse: "#848490",
  lightCount: 1.5,
  segments: 16,
  slices: 8,
  meshSpeed: 0.0000,
  xRange: 0.8,
  yRange: 0.1,
  zRange: .5,
  depth: 10,
};

// ── React component ─────────────────────────────────────────────────────────

interface FSSBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  config?: FSSConfig;
}

export default function FSSBackground({ className = "", style, config }: FSSBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg = { ...DEFAULTS, ...config };
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement!;
    let W = parent.offsetWidth;
    let H = parent.offsetHeight;

    canvas.width = W;
    canvas.height = H;

    const halfW = W * 0.5;
    const halfH = H * 0.5;
    ctx.setTransform(1, 0, 0, -1, halfW, halfH);

    const scene = makeScene();
    const geo = makePlane(W * 1.8, H * 1.8, cfg.segments, cfg.slices);
    const mat = makeMaterial(cfg.meshAmbient, cfg.meshDiffuse);
    const mesh = makeMesh(geo, mat);
    scene.add(mesh);

    for (const vtx of geo.vertices) {
      vtx.anchor = V3.clone(vtx.position);
      vtx.step = v3(
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
      );
      vtx.time = Math.random() * Math.PI * 2;
    }

    const lights: FSSLight[] = [];
    for (let i = 0; i < cfg.lightCount; i++) {
      const l = makeLight(cfg.lightAmbient, cfg.lightDiffuse);
      lights.push(l);
      scene.add(l);
    }

    const center = v3(halfW, halfH);
    const attractor = v3();
    const bounds = v3();
    const lightStep = v3(
      0.2 + Math.random() * 0.8,
      0.2 + Math.random() * 0.8,
      0.2 + Math.random() * 0.8,
    );
    // Lower speed so shimmer feels slower and less "flashy"
    const LIGHT_SPEED = 0.00000001;
    const LIGHT_Z = 50;
    const LIGHT_GRAVITY = 350;
    const LIGHT_DAMP = 0.95;
    const LIGHT_MIN_DIST = 20;
    const LIGHT_MAX_DIST = 300;
    const LIGHT_MIN_LIMIT = 10;

    const start = Date.now();

    function animate() {
      const now = Date.now() - start;

      // Keep lights fixed in place (no orbital motion), only their intensity changes with the mesh
      V3.copy(bounds, center);
      V3.set(attractor, bounds[0], bounds[1], LIGHT_Z);
      for (const light of lights) {
        light.position[2] = LIGHT_Z;
      }

      const offset = cfg.depth / 2;
      for (const vtx of geo.vertices) {
        const ox = Math.sin(vtx.time! + vtx.step![0] * now * cfg.meshSpeed);
        const oy = Math.cos(vtx.time! + vtx.step![1] * now * cfg.meshSpeed);
        const oz = Math.sin(vtx.time! + vtx.step![2] * now * cfg.meshSpeed);
        V3.set(vtx.position,
          cfg.xRange * geo.segmentWidth * ox,
          cfg.yRange * geo.sliceHeight * oy,
          cfg.zRange * offset * oz - offset,
        );
        V3.add(vtx.position, vtx.anchor!);
      }
      geo.dirty = true;

      // render
      ctx.clearRect(-halfW, -halfH, W, H);
      ctx.lineJoin = "round";
      ctx.lineWidth = 1;
      for (const m of scene.meshes) {
        if (!m.visible) continue;
        m.update(scene.lights, true);
        for (const tri of m.geometry.triangles) {
          const c = tri.color.format();
          ctx.beginPath();
          ctx.moveTo(tri.a.position[0], tri.a.position[1]);
          ctx.lineTo(tri.b.position[0], tri.b.position[1]);
          ctx.lineTo(tri.c.position[0], tri.c.position[1]);
          ctx.closePath();
          ctx.strokeStyle = c;
          ctx.fillStyle = c;
          ctx.stroke();
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
