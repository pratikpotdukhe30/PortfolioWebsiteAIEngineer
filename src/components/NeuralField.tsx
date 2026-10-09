import { useEffect, useRef } from "react";

// Ambient hero background: drifting nodes that connect like a sparse neural network,
// and brighten near the cursor. Reads its colors from the CSS theme tokens.
export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    type N = { x: number; y: number; vx: number; vy: number };
    let nodes: N[] = [];

    const color = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      const accent = color("--accent") || "#6E95FF";
      const muted = color("--muted") || "#8E9AB0";
      ctx.clearRect(0, 0, w, h);
      const LINK = 130;
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 160;
            ctx.strokeStyle = near ? accent : muted;
            ctx.globalAlpha = (1 - d / LINK) * (near ? 0.7 : 0.18);
            ctx.lineWidth = near ? 1.2 : 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 160;
        ctx.globalAlpha = near ? 0.95 : 0.45;
        ctx.fillStyle = near ? accent : muted;
        ctx.beginPath(); ctx.arc(n.x, n.y, near ? 2.4 : 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (reduce) draw();
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize(); draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
