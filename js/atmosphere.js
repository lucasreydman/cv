/**
 * atmosphere.js — data-field background (Ink & Ember v2)
 *
 * 1,344 drifting points, one per game in the SHARPRFI backtest — a
 * background derived from Lucas's actual work instead of generic smoke.
 * Mostly faint steel; a small fraction burn ember. Points drift slowly,
 * shy away from the cursor, and warm slightly as the page scrolls.
 *
 * Interface (unchanged):
 *   const atmo = await initAtmosphere(canvas);
 *   atmo.setScrollProgress(p);   // 0..1 page progress
 *   atmo.setPointer(x, y, v);    // client px + velocity px/frame
 *   atmo.destroy();
 * Returns null when WebGL or the OGL CDN is unavailable.
 */

const OGL_URL = 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const POINT_COUNT = 1344; // the backtest

const VERTEX = /* glsl */ `
    attribute vec3 position;   // x, y in [-1,1] field space; z = depth 0..1
    attribute vec4 seed;       // per-point drift phases + ember flag in w

    uniform float uTime;
    uniform vec2  uRes;
    uniform float uScroll;
    uniform vec2  uPointer;    // clip-ish space (-1..1, y up)
    uniform float uPointerStrength;

    varying float vEmber;
    varying float vAlpha;

    void main() {
        float depth = position.z;              // 0 far .. 1 near
        vec2 p = position.xy;

        // Slow individual drift
        float t = uTime * 0.05;
        p.x += sin(t * seed.x + seed.y * 6.2831) * 0.035 * (0.4 + depth);
        p.y += cos(t * seed.y + seed.x * 6.2831) * 0.035 * (0.4 + depth);

        // The whole field rises very slowly with scroll (parallax by depth)
        p.y += uScroll * (0.22 + depth * 0.5);
        p.y = mod(p.y + 1.0, 2.0) - 1.0;

        // Cursor: points within reach ease away
        vec2 toPoint = p - uPointer;
        float d = length(toPoint * vec2(uRes.x / uRes.y, 1.0));
        float push = exp(-d * d * 14.0) * 0.09 * uPointerStrength;
        p += normalize(toPoint + 0.0001) * push;

        gl_Position = vec4(p, 0.0, 1.0);
        gl_PointSize = (0.8 + depth * 1.8) * (uRes.y / 900.0);

        vEmber = seed.w;
        // Whisper-quiet: near points faintly brighter, ember slightly warmer
        vAlpha = 0.03 + depth * 0.08 + seed.w * 0.12;
    }
`;

const FRAGMENT = /* glsl */ `
    precision highp float;

    uniform float uScroll;

    varying float vEmber;
    varying float vAlpha;

    void main() {
        // Round point with soft edge
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c);
        float disc = smoothstep(0.5, 0.28, r);
        if (disc < 0.01) discard;

        vec3 steel = vec3(0.545, 0.608, 0.706);
        vec3 ember = vec3(1.0, 0.36, 0.05);

        // Ember-flagged points are always warm; the rest warm slightly
        // as the page progresses.
        float warmth = max(vEmber, smoothstep(0.55, 1.0, uScroll) * 0.35);
        vec3 color = mix(steel, ember, warmth);

        // Canvas is premultiplied-alpha: multiply color by alpha or the
        // compositor renders every point at full brightness.
        float a = disc * vAlpha;
        gl_FragColor = vec4(color * a, a);
    }
`;

// Deterministic pseudo-random (no Math.random needed, stable field)
function mulberry(seed) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export async function initAtmosphere(canvas) {
    if (!canvas) return null;

    let ogl;
    try {
        ogl = await import(OGL_URL);
    } catch {
        return null;
    }

    const { Renderer, Program, Mesh, Geometry, Vec2 } = ogl;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
        renderer = new Renderer({
            canvas,
            dpr: Math.min(window.devicePixelRatio || 1, 1.5),
            alpha: true,
            antialias: false,
            premultipliedAlpha: true,
            powerPreference: 'low-power',
        });
    } catch {
        return null;
    }

    const gl = renderer.gl;
    if (!gl) return null;

    gl.clearColor(0, 0, 0, 0);

    // Build the field
    const rand = mulberry(1344);
    const positions = new Float32Array(POINT_COUNT * 3);
    const seeds = new Float32Array(POINT_COUNT * 4);
    for (let i = 0; i < POINT_COUNT; i++) {
        positions[i * 3 + 0] = rand() * 2 - 1;
        positions[i * 3 + 1] = rand() * 2 - 1;
        positions[i * 3 + 2] = rand();
        seeds[i * 4 + 0] = 0.5 + rand() * 1.5;
        seeds[i * 4 + 1] = 0.5 + rand() * 1.5;
        seeds[i * 4 + 2] = rand();
        seeds[i * 4 + 3] = rand() < 0.055 ? 1 : 0;   // ~74 ember points
    }

    const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        seed: { size: 4, data: seeds },
    });

    const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: {
            uTime:            { value: 0 },
            uRes:             { value: new Vec2(1, 1) },
            uScroll:          { value: 0 },
            uPointer:         { value: new Vec2(0, 0) },
            uPointerStrength: { value: 0 },
        },
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    // Smoothed state
    let scrollTarget = 0, scroll = 0;
    let px = 0, py = 0, ptx = 0, pty = 0;
    let strength = 0, strengthTarget = 0;
    let rafId = null;
    let running = false;
    let destroyed = false;

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.uRes.value.set(gl.canvas.width, gl.canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    function frame(now) {
        if (destroyed) return;
        rafId = requestAnimationFrame(frame);

        scroll += (scrollTarget - scroll) * 0.05;
        px += (ptx - px) * 0.08;
        py += (pty - py) * 0.08;
        strengthTarget *= 0.95;
        strength += (strengthTarget - strength) * 0.08;

        program.uniforms.uTime.value = now * 0.001;
        program.uniforms.uScroll.value = scroll;
        program.uniforms.uPointer.value.set(px, py);
        program.uniforms.uPointerStrength.value = strength;

        renderer.render({ scene: mesh });
    }

    function start() {
        if (running || destroyed) return;
        running = true;
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (reducedMotion) {
        program.uniforms.uTime.value = 120;
        renderer.render({ scene: mesh });
    } else {
        start();
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stop() : start();
        });
    }

    return {
        setScrollProgress(p) {
            scrollTarget = Math.min(Math.max(p, 0), 1);
        },
        setPointer(clientX, clientY, velocity) {
            ptx = (clientX / window.innerWidth) * 2 - 1;
            pty = -((clientY / window.innerHeight) * 2 - 1);
            strengthTarget = Math.min(strengthTarget + velocity * 0.02, 1);
        },
        destroy() {
            destroyed = true;
            stop();
            window.removeEventListener('resize', resize);
        },
    };
}
