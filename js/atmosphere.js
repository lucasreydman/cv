/**
 * atmosphere.js — WebGL ink/smoke background (Ink & Ember)
 *
 * One fullscreen domain-warped FBM shader on an OGL triangle.
 * Interface:
 *   const atmo = await initAtmosphere(canvas);
 *   atmo.setScrollProgress(p);   // 0..1 page progress
 *   atmo.setPointer(x, y, v);    // client px + velocity px/frame
 *   atmo.destroy();
 * Returns null when WebGL or the OGL CDN is unavailable.
 */

const OGL_URL = 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js';

const VERTEX = /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const FRAGMENT = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec2  uRes;
    uniform float uScroll;
    uniform vec2  uPointer;
    uniform float uPointerStrength;

    varying vec2 vUv;

    float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.55;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 5; i++) {
            v += amp * noise(p);
            p = rot * p * 2.02;
            amp *= 0.5;
        }
        return v;
    }

    void main() {
        float aspect = uRes.x / uRes.y;
        vec2 uv = vUv;
        vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;

        float t = uTime * 0.032;

        // Pointer influence: local warp + glow
        vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);
        float pd = distance(vec2(uv.x * aspect, uv.y), pointer);
        float influence = exp(-pd * pd * 9.0) * uPointerStrength;

        // Domain warp (iq style)
        vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.9),
                      fbm(p + vec2(5.2, 1.3) - t * 0.6));
        vec2 r = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 0.5),
                      fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.4));
        r += influence * 0.7;

        float f = fbm(p + 2.2 * r);
        f = pow(smoothstep(0.18, 0.98, f), 1.55);

        // Scroll-linked palette: steel blue -> ember
        vec3 cold  = vec3(0.27, 0.35, 0.47);
        vec3 ember = vec3(1.00, 0.30, 0.00);
        vec3 tint  = mix(cold, ember, smoothstep(0.3, 0.95, uScroll));

        float intensity = mix(0.55, 0.34, smoothstep(0.0, 0.45, uScroll));
        intensity = mix(intensity, 0.48, smoothstep(0.55, 1.0, uScroll));

        // Late in the page, gather the glow toward the bottom of the viewport
        float gather = mix(1.0, 0.45 + smoothstep(1.0, 0.15, uv.y) * 0.6,
                           smoothstep(0.6, 1.0, uScroll));

        vec3 base = vec3(0.023, 0.023, 0.031);
        vec3 color = base + tint * f * intensity * gather;

        // Pointer glow
        color += tint * influence * 0.35;

        // Vignette
        float vig = 1.0 - 0.4 * length(uv - vec2(0.5, 0.45));
        color *= vig;

        // Dither to kill banding
        color += (hash(gl_FragCoord.xy) - 0.5) / 160.0;

        gl_FragColor = vec4(color, 1.0);
    }
`;

export async function initAtmosphere(canvas) {
    if (!canvas) return null;

    let ogl;
    try {
        ogl = await import(OGL_URL);
    } catch {
        return null;
    }

    const { Renderer, Program, Mesh, Triangle, Vec2 } = ogl;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const renderScale = isMobile ? 0.7 : 1;

    let renderer;
    try {
        renderer = new Renderer({
            canvas,
            dpr: Math.min(window.devicePixelRatio || 1, 1.5) * renderScale,
            alpha: false,
            antialias: false,
            powerPreference: 'low-power',
        });
    } catch {
        return null;
    }

    const gl = renderer.gl;
    if (!gl) return null;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
            uTime:            { value: 0 },
            uRes:             { value: new Vec2(1, 1) },
            uScroll:          { value: 0 },
            uPointer:         { value: new Vec2(0.5, 0.5) },
            uPointerStrength: { value: 0 },
        },
    });
    const mesh = new Mesh(gl, { geometry, program });

    // Smoothed state
    let scrollTarget = 0, scroll = 0;
    let px = 0.5, py = 0.5, ptx = 0.5, pty = 0.5;
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

        scroll += (scrollTarget - scroll) * 0.045;
        px += (ptx - px) * 0.06;
        py += (pty - py) * 0.06;
        strengthTarget *= 0.94;
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
        // Render a single still frame; no animation loop.
        program.uniforms.uTime.value = 40;
        program.uniforms.uScroll.value = 0.3;
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
            ptx = clientX / window.innerWidth;
            pty = 1 - clientY / window.innerHeight;
            strengthTarget = Math.min(strengthTarget + velocity * 0.012, 1);
        },
        destroy() {
            destroyed = true;
            stop();
            window.removeEventListener('resize', resize);
        },
    };
}
