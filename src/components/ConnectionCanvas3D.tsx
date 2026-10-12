/**
 * ConnectionCanvas3D — The Living Visual Network of meUus
 * Represents: me → U → us
 * - me: The individual seeking dignity & clarity
 * - U: Intelligence, knowledge & assisted tools
 * - us: Collective community, responsibility & Bangladesh
 *
 * Lightweight, GPU-conscious Canvas with 60fps physics,
 * off-screen pause, and reduced-motion accessibility.
 */

import React, { useRef, useEffect, useState } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  label?: string;
  color: string;
  pulsePhase: number;
  isCore?: boolean;
}

export default function ConnectionCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(media.matches);
    const listener = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    // Intersection observer to pause rendering when off-screen (saves GPU/battery)
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible || motionReduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Three Core Pillars (me, U, us)
    const coreNodes: Node3D[] = [
      {
        x: -160,
        y: -40,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 14,
        label: 'me (Individual)',
        color: '#10B981', // Emerald
        pulsePhase: 0,
        isCore: true,
      },
      {
        x: 0,
        y: -90,
        z: 30,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 18,
        label: 'U (Intelligence)',
        color: '#38BDF8', // Sky / Gemini Blue
        pulsePhase: Math.PI / 2,
        isCore: true,
      },
      {
        x: 160,
        y: -40,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 16,
        label: 'us (Civilization)',
        color: '#F59E0B', // Muted Gold / Amber
        pulsePhase: Math.PI,
        isCore: true,
      },
    ];

    // Constellation Satellite Nodes
    const satelliteNodes: Node3D[] = [];
    const NUM_SATELLITES = window.innerWidth < 768 ? 24 : 48;
    for (let i = 0; i < NUM_SATELLITES; i++) {
      const angle = (i / NUM_SATELLITES) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 100 + Math.random() * 260;
      satelliteNodes.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * (dist * 0.55),
        z: (Math.random() - 0.5) * 160,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        radius: 2 + Math.random() * 3,
        color: i % 3 === 0 ? '#34D399' : i % 3 === 1 ? '#7DD3FC' : '#FCD34D',
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let angleY = 0;
    let angleX = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Mouse influence
      const targetAngleY = mouseRef.current.active
        ? ((mouseRef.current.x - cx) / width) * 0.7
        : Math.sin(Date.now() * 0.0006) * 0.25;
      const targetAngleX = mouseRef.current.active
        ? -((mouseRef.current.y - cy) / height) * 0.4
        : Math.cos(Date.now() * 0.0005) * 0.15;

      angleY += (targetAngleY - angleY) * 0.05;
      angleX += (targetAngleX - angleX) * 0.05;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project 3D coordinate to 2D
      const project = (node: Node3D) => {
        // Rotate Y
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;
        // Rotate X
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        const fov = 420;
        const scale = fov / (fov + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z2,
        };
      };

      // Update satellites
      satelliteNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        if (Math.abs(node.x) > 340) node.vx *= -1;
        if (Math.abs(node.y) > 180) node.vy *= -1;
        if (Math.abs(node.z) > 120) node.vz *= -1;
        node.pulsePhase += 0.03;
      });

      // Combine and sort nodes by Z for proper occlusion
      const allProjected = [...coreNodes, ...satelliteNodes].map((node) => ({
        node,
        ...project(node),
      }));
      allProjected.sort((a, b) => b.z2 - a.z2);

      // Draw Connection Lines between core nodes
      const projectedCores = coreNodes.map((c) => ({ node: c, ...project(c) }));
      for (let i = 0; i < projectedCores.length; i++) {
        for (let j = i + 1; j < projectedCores.length; j++) {
          const a = projectedCores[i];
          const b = projectedCores[j];
          const grad = ctx.createLinearGradient(a.px, a.py, b.px, b.py);
          grad.addColorStop(0, a.node.color + '88');
          grad.addColorStop(0.5, '#FFFFFF66');
          grad.addColorStop(1, b.node.color + '88');

          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.5 * Math.min(a.scale, b.scale);
          ctx.stroke();

          // Flowing particle pulses along the line
          const progress = (Date.now() * 0.001 + (i + j) * 0.3) % 1;
          const pulseX = a.px + (b.px - a.px) * progress;
          const pulseY = a.py + (b.py - a.py) * progress;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw subtle connecting webs to satellites
      allProjected.forEach((p1, idx) => {
        if (!p1.node.isCore) return;
        allProjected.forEach((p2, jdx) => {
          if (idx === jdx) return;
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Draw Nodes
      allProjected.forEach(({ node, px, py, scale }) => {
        const pulse = Math.sin(node.pulsePhase) * 0.25 + 1;
        const currentRadius = node.radius * scale * pulse;

        // Glowing outer halo
        const haloGrad = ctx.createRadialGradient(px, py, currentRadius * 0.3, px, py, currentRadius * 2.8);
        haloGrad.addColorStop(0, node.color + '99');
        haloGrad.addColorStop(0.6, node.color + '22');
        haloGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, currentRadius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // Core Solid Circle
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Inner Bright Core
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, currentRadius * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Labels for Core Nodes
        if (node.isCore && node.label) {
          ctx.font = `600 ${Math.round(12 * scale)}px Geist, Inter, sans-serif`;
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 6;
          ctx.fillText(node.label, px, py + currentRadius + 16 * scale);
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, motionReduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      className="relative w-full h-full min-h-[340px] md:min-h-[460px] pointer-events-auto select-none"
      aria-label="Interactive 3D network visual of me to U to us connection"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {motionReduced && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
          (Reduced motion active — static connection visual)
        </div>
      )}
    </div>
  );
}
