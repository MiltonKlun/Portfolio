import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { floating, threads, pillar } from "./landingShaders";

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const rgb = (hex: string) =>
  [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
type Value = number | boolean | number[] | Float32Array;

function settings(chapter: number, light: boolean) {
  const paper = rgb("f5f3ec");
  const gradient = ["7C3AED", "A855F7", "d9b2ff"].flatMap(rgb);
  if (chapter === 0 || chapter === 4)
    return {
      fragment: floating,
      values: {
        iTime: 0,
        iResolution: [1, 1, 1],
        animationSpeed: chapter === 0 ? 0.5 : 0.3,
        enableTop: chapter === 4,
        enableMiddle: true,
        enableBottom: chapter === 0,
        topLineCount: 4,
        middleLineCount: chapter === 0 ? 6 : 4,
        bottomLineCount: 6,
        topLineDistance: 0.65,
        middleLineDistance: chapter === 0 ? 1 : 0.45,
        bottomLineDistance: 1,
        topWavePosition: [0.5, -0.6, -0.5],
        middleWavePosition:
          chapter === 0 ? [1.2, 0.1, 0.45] : [-0.8, -0.4, -0.75],
        bottomWavePosition: [2, 0.8, 0.6],
        iMouse: [0, 0],
        interactive: false,
        bendRadius: 5,
        bendStrength: 0,
        bendInfluence: 0,
        parallax: false,
        parallaxStrength: 0,
        parallaxOffset: [0, 0],
        lineGradient: [...gradient, ...Array(15).fill(0)],
        lineGradientCount: 3,
        backgroundColor: paper,
        lightMode: light,
      } as Record<string, Value>,
    };
  if (chapter === 1 || chapter === 3)
    return {
      fragment: threads,
      values: {
        iTime: 0,
        iResolution: [1, 1],
        uSpeed: chapter === 1 ? 0.12 : 0.18,
        uThreadCount: chapter === 1 ? 5 : 7,
        uFrequency: chapter === 1 ? 3 : 2.3,
        uSpread: chapter === 1 ? 0.23 : 0.48,
        uTaper: chapter === 1 ? 0.7 : 0.25,
        uPosition: chapter === 1 ? 0.48 : 0.5,
        uFanMode: chapter === 1 ? 2 : 0,
        uDisperse: chapter === 3 ? 1 : 0,
        uGlow: 0.012,
        uFalloff: 0.75,
        uThickness: 0.7,
        uBrightness: 0.85,
        uOpacity: 1,
        uMirror: 0,
        uShimmer: 0,
        uGrain: 0,
        uGrainIntensity: 0,
        uColor1: rgb(chapter === 1 ? "7c3aed" : "a855f7"),
        uColor2: rgb("cc96ff"),
        uColor3: rgb("f5edff"),
        uBackgroundColor: paper,
        uLightMode: light,
        uMouse: [0, 0],
        uMouseStrength: 0,
        uEnableMouse: 0,
        uMouseActive: 0,
      } as Record<string, Value>,
    };
  const angle = (128 * Math.PI) / 180;
  return {
    fragment: pillar,
    values: {
      uTime: 0,
      uResolution: [1, 1],
      uMouse: [0, 0],
      uTopColor: rgb("7c3aed"),
      uBottomColor: rgb("cc96ff"),
      uIntensity: 0.9,
      uInteractive: false,
      uGlowAmount: 0.0035,
      uPillarWidth: 2.5,
      uPillarHeight: 0.4,
      uNoiseIntensity: 0,
      uLightMode: light ? 1 : 0,
      uRotCos: 1,
      uRotSin: 0,
      uPillarRotCos: Math.cos(angle),
      uPillarRotSin: Math.sin(angle),
      uWaveSin: Math.sin(0.4),
      uWaveCos: Math.cos(0.4),
    } as Record<string, Value>,
  };
}

export default function ShaderBackground({
  chapter,
  paused,
}: {
  chapter: number;
  paused: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const pause = useRef(paused);
  const update = useRef<() => void>(() => {});
  useEffect(() => {
    pause.current = paused;
    update.current();
  }, [paused]);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl || !gl.createShader) return;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    let frame = 0,
      elapsed = 0,
      last = 0,
      lost = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let light = document.documentElement.dataset.theme !== "dark";
    const config = settings(chapter, light);
    const uniforms = Object.fromEntries(
      Object.entries(config.values).map(([key, value]) => [key, { value }]),
    );
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment: config.fragment,
      uniforms,
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry, program });
    node.appendChild(canvas);
    let slowFrames = 0;
    let frameRate = 24;
    let constrained = false;
    const render = () => {
      if (lost) return;
      const t = reduced.matches ? 0 : elapsed;
      if (uniforms.iTime) uniforms.iTime.value = t;
      if (uniforms.uTime) {
        uniforms.uTime.value = t * 0.12;
        uniforms.uRotCos.value = Math.cos(t * 0.036);
        uniforms.uRotSin.value = Math.sin(t * 0.036);
      }
      const started = performance.now();
      renderer.render({ scene: mesh });
      // Keep expensive software/low-power GPU rendering from blocking navigation.
      slowFrames = performance.now() - started > 8 ? slowFrames + 1 : 0;
      if (slowFrames >= 1 && !reduced.matches) {
        slowFrames = 0;
        // Preserve native-resolution lines; reduce cadence rather than pixel quality.
        if (frameRate > 12) frameRate = 12;
        else constrained = true;
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const tick = () => {
      const now = performance.now();
      if (
        lost ||
        constrained ||
        document.hidden ||
        pause.current ||
        reduced.matches
      ) {
        stop();
        return;
      }
      if (!last) last = now;
      // GPU work can block after render() returns. Detect missed frame deadlines
      // too, so software rendering keeps one crisp frame instead of freezing UI.
      if (now - last > 180) {
        constrained = true;
        stop();
        return;
      }
      if (now - last >= 1000 / frameRate) {
        elapsed += Math.min((now - last) / 1000, 0.1);
        last = now;
        render();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      render();
      if (
        !lost &&
        !constrained &&
        !document.hidden &&
        !pause.current &&
        !reduced.matches
      )
        frame = requestAnimationFrame(tick);
    };
    update.current = sync;
    let previousWidth = 0, previousHeight = 0;
    const resize = () => {
      if (node.clientWidth === previousWidth && node.clientHeight === previousHeight) return;
      previousWidth = node.clientWidth;
      previousHeight = node.clientHeight;
      renderer.setSize(
        Math.max(node.clientWidth, 1),
        Math.max(node.clientHeight, 1),
      );
      const size = uniforms.iResolution || uniforms.uResolution;
      size.value =
        chapter === 0 || chapter === 4
          ? [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
          : [gl.drawingBufferWidth, gl.drawingBufferHeight];
      render();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stop();
      canvas.style.opacity = "0";
    };
    canvas.addEventListener("webglcontextlost", onLost);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(node);
    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.dataset.theme !== "dark";
      if (next === light) return;
      light = next;
      if (uniforms.lightMode) uniforms.lightMode.value = light;
      if (uniforms.uLightMode)
        uniforms.uLightMode.value = chapter === 2 ? Number(light) : light;
      render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    last = performance.now();
    resize();
    if (!pause.current && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    return () => {
      stop();
      update.current = () => {};
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.remove();
      geometry.remove();
      gl.deleteProgram(program.program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [chapter]);
  return (
    <div ref={host} className="shader-background" data-composition={chapter} />
  );
}
