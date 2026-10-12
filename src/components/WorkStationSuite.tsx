import React, { useState, useRef, useEffect } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Sparkles,
  Code2,
  Terminal,
  Gamepad2,
  Layers,
  Zap,
  Play,
  Copy,
  Check,
  Download,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sliders,
  DollarSign,
  Activity,
  CheckCircle2,
  HelpCircle,
  FileCode2,
  ChevronRight,
  Bot,
  ExternalLink,
  RefreshCw,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEcosystem } from '../context/EcosystemContext';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  freeRoute: string;
  badge: string;
  accent: string;
  description: string;
  speed: string;
  rating: string;
}

const FREE_MODELS: ModelOption[] = [
  {
    id: 'omniroute-combo',
    name: 'OmniRoute Auto-Fallback Combo',
    provider: 'Universal Multi-Route',
    freeRoute: 'Automatic Failover (All 5 Providers)',
    badge: '1.4B Free Tokens/Mo',
    accent: 'emerald',
    description: 'Auto-switches to the next best free model if any provider rate limits or goes offline.',
    speed: '< 800ms',
    rating: '99.9% Uptime'
  },
  {
    id: 'openai-gpt4o-codex',
    name: 'OpenAI ChatGPT-4o & Codex',
    provider: 'OpenAI Ecosystem',
    freeRoute: 'Codex Free WorkStation / Web Proxy',
    badge: 'Best for Logic & Code',
    accent: 'teal',
    description: 'Specialized for architectural coding, unit tests, and production TypeScript systems.',
    speed: '~1.1s',
    rating: 'Top Coder'
  },
  {
    id: 'claude-opus-4.6',
    name: 'Claude Opus 4.6',
    provider: 'Antigravity Route',
    freeRoute: 'Antigravity / OmniRoute Native',
    badge: 'Deep Architecture',
    accent: 'purple',
    description: 'Deep chain-of-thought, zero-fluff structural design and comprehensive reasoning.',
    speed: '~1.4s',
    rating: 'S-Tier Reasoning'
  },
  {
    id: 'claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic via Free Bridge',
    freeRoute: 'Claude Code Bridge / OmniRoute',
    badge: 'Ultra-Fast Precision',
    accent: 'amber',
    description: 'High-speed code refactoring, frontend styling, and responsive UI layout generation.',
    speed: '< 650ms',
    rating: 'Fast & Precise'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 Reasoning',
    provider: 'OpenCode Route',
    freeRoute: 'OpenCode Free API Bridge',
    badge: 'Math & Logic Chain',
    accent: 'blue',
    description: 'Transparent step-by-step reasoning tokens with open-weights mathematical rigor.',
    speed: '~1.2s',
    rating: 'Math / Logic'
  },
  {
    id: 'nvidia-nim-llama3',
    name: 'NVIDIA NIM (Llama 3.3 70B)',
    provider: 'NVIDIA Cloud',
    freeRoute: 'NVIDIA NIM Free 1,000 Credits',
    badge: 'Enterprise Fast',
    accent: 'green',
    description: 'High-throughput enterprise inference hosted on NVIDIA accelerated hardware.',
    speed: '< 500ms',
    rating: 'Raw Speed'
  }
];

const PRESET_GAMES = [
  {
    title: 'Cyber Arcade Breakout',
    prompt: 'Build a complete, polished Cyberpunk Brick Breaker Arcade game with smooth neon canvas visuals, particle explosions on brick impact, powerups (laser beam, multi-ball, wide paddle), live score counter, audio synthesized sound effects via Web Audio API, and keyboard/touch mouse controls.',
    tag: 'Arcade Game',
    difficulty: 'Action'
  },
  {
    title: 'Zen Memory Matrix',
    prompt: 'Build an interactive Zen Memory Matrix game with relaxing gradient tiles, progressive level difficulties (4 to 16 tiles), calming sound synthesizer tones, streak multiplier, and a calm mindfulness breathing animation between rounds.',
    tag: 'Puzzle / Brain',
    difficulty: 'Mindfulness'
  },
  {
    title: 'Bangla Vocabulary & Quest',
    prompt: 'Build a gamified interactive Bangla & English Vocabulary Quest with interactive card matching, phonetic hints, score progression, timer sprint, and a celebration particle burst upon completing all 10 word pairs.',
    tag: 'Educational',
    difficulty: 'Learning'
  },
  {
    title: 'Gravitational Solar Orbit Sandbox',
    prompt: 'Build an interactive 2D orbital gravity simulation where clicking spawns celestial bodies with velocity vectors, realistic N-body gravitational attraction, particle trail paths, mass sliders, and speed controls.',
    tag: 'Physics Sandbox',
    difficulty: 'Simulation'
  }
];

export default function WorkStationSuite() {
  const { workstationIncomingGoal, clearWorkstationGoal } = useEcosystem();

  const [activeTab, setActiveTab] = useState<'builder' | 'codex' | 'pipeline' | 'setup'>('builder');
  const [selectedModel, setSelectedModel] = useState<string>('omniroute-combo');
  const [promptInput, setPromptInput] = useState<string>(PRESET_GAMES[0].prompt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputCode, setOutputCode] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [executionMeta, setExecutionMeta] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreenSandbox, setIsFullscreenSandbox] = useState<boolean>(false);

  // Automation Pipeline State
  const [pipelineGoal, setPipelineGoal] = useState<string>('Build a responsive real-time Pomodoro Productivity Timer with ambient noise generator');
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  // If an incoming goal arrives from Idea Lab or Start Door, switch to pipeline and execute
  useEffect(() => {
    if (workstationIncomingGoal) {
      setPipelineGoal(workstationIncomingGoal);
      setActiveTab('pipeline');
      clearWorkstationGoal();
    }
  }, [workstationIncomingGoal, clearWorkstationGoal]);

  // Telemetry stats
  const [totalTokensGenerated, setTotalTokensGenerated] = useState<number>(142500);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default Game Code on mount
  useEffect(() => {
    if (!outputCode) {
      setOutputCode(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>meUus Cyber Breakout</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #020617; color: #f8fafc; font-family: ui-monospace, monospace; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
    #header { position: absolute; top: 12px; display: flex; gap: 20px; font-size: 13px; z-index: 10; background: rgba(15,23,42,0.85); padding: 8px 16px; border-radius: 12px; border: 1px solid #1e293b; }
    .val { color: #10b981; font-weight: bold; }
    canvas { background: radial-gradient(circle at center, #0f172a 0%, #020617 100%); border: 1px solid #334155; border-radius: 16px; box-shadow: 0 10px 40px rgba(16,185,129,0.15); }
    #overlay { position: absolute; inset: 0; background: rgba(2,6,23,0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20; }
    button { background: #10b981; color: #020617; border: none; padding: 12px 28px; font-weight: bold; border-radius: 9999px; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(16,185,129,0.4); margin-top: 16px; }
    button:hover { transform: scale(1.05); background: #34d399; }
  </style>
</head>
<body>
  <div id="header">
    <div>SCORE: <span id="score" class="val">0</span></div>
    <div>LIVES: <span id="lives" class="val">3</span></div>
    <div>MODEL: <span class="val">OmniRoute Free</span></div>
  </div>

  <canvas id="gameCanvas" width="560" height="400"></canvas>

  <div id="overlay">
    <h2 style="font-size: 24px; color: #fff; margin-bottom: 8px;">meUus Cyber Breakout</h2>
    <p style="font-size: 12px; color: #94a3b8; max-width: 320px; text-align: center;">Generated fully with free model routing. Move mouse or touch to control paddle.</p>
    <button id="startBtn">START GAME</button>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('startBtn');

    let score = 0, lives = 3, isRunning = false;
    let paddle = { x: 230, y: 370, w: 100, h: 12, speed: 8 };
    let ball = { x: 280, y: 350, vx: 4, vy: -4, r: 6 };
    let bricks = [], particles = [];

    const rows = 4, cols = 8, bw = 58, bh = 16, bp = 8, ot = 50, ol = 18;
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    function initBricks() {
      bricks = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({ x: ol + c * (bw + bp), y: ot + r * (bh + bp), alive: true, color: colors[r] });
        }
      }
    }

    function createExplosion(x, y, color) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          r: Math.random() * 3 + 1,
          life: 20,
          color
        });
      }
    }

    function update() {
      if (!isRunning) return;
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.vx *= -1;
      if (ball.y - ball.r <= 0) ball.vy *= -1;

      // Paddle hit
      if (ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.vy > 0) {
        ball.vy = -Math.abs(ball.vy);
        const hitOffset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = hitOffset * 6;
      }

      // Bottom fall
      if (ball.y > canvas.height) {
        lives--;
        livesEl.innerText = lives;
        if (lives <= 0) {
          isRunning = false;
          overlay.style.display = 'flex';
          overlay.querySelector('h2').innerText = 'GAME OVER';
          startBtn.innerText = 'PLAY AGAIN';
        } else {
          ball.x = paddle.x + paddle.w / 2;
          ball.y = paddle.y - 10;
          ball.vy = -4;
        }
      }

      // Brick collisions
      let remaining = 0;
      bricks.forEach(b => {
        if (!b.alive) return;
        remaining++;
        if (ball.x >= b.x && ball.x <= b.x + bw && ball.y >= b.y && ball.y <= b.y + bh) {
          b.alive = false;
          ball.vy *= -1;
          score += 100;
          scoreEl.innerText = score;
          createExplosion(b.x + bw / 2, b.y + bh / 2, b.color);
        }
      });

      if (remaining === 0) {
        isRunning = false;
        overlay.style.display = 'flex';
        overlay.querySelector('h2').innerText = 'VICTORY! SPRINT CLEARED';
        startBtn.innerText = 'PLAY NEXT LEVEL';
      }

      // Update particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });
      particles = particles.filter(p => p.life > 0);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddle
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
      ctx.fill();

      // Draw ball
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw bricks
      bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, bw, bh, 4);
        ctx.fill();
      });

      // Draw particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mouseX - paddle.w / 2));
    });

    canvas.addEventListener('touchmove', e => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, touchX - paddle.w / 2));
    });

    startBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      score = 0;
      lives = 3;
      scoreEl.innerText = '0';
      livesEl.innerText = '3';
      initBricks();
      ball.x = 280;
      ball.y = 350;
      ball.vx = 4;
      ball.vy = -4;
      isRunning = true;
    });

    initBricks();
    loop();
  </script>
</body>
</html>`);
    }
  }, []);

  const handleExecute = async (overridePrompt?: string, modeOverride = 'game') => {
    const activePrompt = overridePrompt || promptInput;
    if (!activePrompt.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/workstation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          selectedModel,
          mode: modeOverride
        })
      });

      const data = await res.json();
      if (data.code) {
        setOutputCode(data.code);
      } else if (data.text) {
        setOutputText(data.text);
      }
      setExecutionMeta(data);
      setTotalTokensGenerated(prev => prev + (data.tokensUsed || 1200));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAutomation = async () => {
    if (!pipelineGoal.trim()) return;
    setIsPipelineRunning(true);
    try {
      const res = await fetch('/api/workstation/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: pipelineGoal })
      });
      const data = await res.json();
      setPipelineData(data.result);
      if (data.result?.stage2_Code?.fullExecutableCode) {
        setOutputCode(data.result.stage2_Code.fullExecutableCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPipelineRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(outputCode || outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([outputCode || outputText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meuus_workstation_build_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentModelData = FREE_MODELS.find(m => m.id === selectedModel) || FREE_MODELS[0];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Code2 size={18} />}
        title="WorkStation Suite"
        subtitle="Universal Developer & Creator Execution Environment — #AnyOneCanBuild#."
        badge="Available Now"
        breadcrumb="Intelligence"
      />
      <section id="workstation" className="py-8 px-6 sm:px-10 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with $500/mo Saved & 1.4B Free Tokens telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>meUus Universal AI WorkStation & Automation Router</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              Zero Subscription. <span className="text-emerald-600">Full AI WorkStation.</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Run Claude Opus & Sonnet, ChatGPT-4o Codex, DeepSeek R1, NVIDIA NIM, and Gemini concurrently with universal auto-fallback and full automated coding pipelines without paying for individual subscriptions.
            </p>
          </div>

          {/* Telemetry Counter Cards */}
          <div role="status" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Monthly Cost</span>
              <div className="text-xl font-bold font-mono text-emerald-600">$0.00 <span className="text-[10px] text-gray-400">/ mo</span></div>
              <span className="text-[10px] font-mono text-emerald-600 font-medium">Saved $500/mo</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Free Token Cap</span>
              <div className="text-xl font-bold font-mono text-gray-900">1.40B <span className="text-[10px] text-gray-400">tokens</span></div>
              <span className="text-[10px] font-mono text-blue-600">Universal Pool</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Auto-Failover</span>
              <div className="text-xl font-bold font-mono text-emerald-700">Active <span className="text-[10px] text-gray-400">5 models</span></div>
              <span className="text-[10px] font-mono text-gray-500">Zero downtime</span>
            </div>
          </div>
        </div>

        {/* 1. Multi-Model Provider Matrix Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select Active Free AI Engine / Router:</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              Active: {currentModelData.name} ({currentModelData.provider})
            </span>
          </div>

          <div role="tablist" aria-label="Model Selection" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {FREE_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-white border-emerald-500 text-gray-900 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 truncate block">{model.name.split('(')[0]}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 block truncate">{model.provider}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] font-mono">
                    <span className="text-emerald-700 font-semibold">{model.badge}</span>
                    <span className="text-gray-400">{model.speed}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. WorkStation Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {[
            { id: 'builder', label: '1-Click App & Game Generator (Live Sandbox)', icon: Gamepad2 },
            { id: 'codex', label: 'ChatGPT Codex & Architectural Suite', icon: Code2 },
            { id: 'pipeline', label: 'Autonomous 4-Stage Pipeline', icon: Workflow },
            { id: 'setup', label: 'Free Models Setup & settings.json Guide', icon: FileCode2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Live Interactive App & Game Builder Sandbox */}
        {activeTab === 'builder' && (
          <div className="space-y-6">
            {/* Quick Preset Prompts */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                Preset Complete Game & App Blueprints:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRESET_GAMES.map((game, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(game.prompt);
                      handleExecute(game.prompt, 'game');
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/20 text-left space-y-1 transition-all group shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {game.title}
                      </span>
                      <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-200 bg-emerald-50">
                        {game.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{game.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Input Bar */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Prompt the WorkStation (Free Multi-Model Routing):</span>
                </span>
                <span className="text-xs font-mono text-gray-500">Output: Self-Contained Executable HTML/JS</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <textarea
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  aria-label="Prompt the WorkStation"
                  placeholder="Describe any game, interactive dashboard, or tool you want to build and test live..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:border-emerald-500 outline-none resize-none font-mono"
                />
                <Button
                  onClick={() => handleExecute(promptInput, 'game')}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl px-6 sm:w-44 flex items-center justify-center gap-2 h-auto py-4 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Build & Run Live</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Two-Column Studio: Live Interactive Sandbox & Code Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Interactive Sandbox (7 Cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-gray-900 font-mono">Live Interactive Sandbox</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const current = outputCode;
                        setOutputCode('');
                        setTimeout(() => setOutputCode(current), 50);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1 font-mono shadow-xs"
                      title="Reset Sandbox"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => setIsFullscreenSandbox(!isFullscreenSandbox)}
                      aria-label="Toggle fullscreen interactive sandbox"
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1 font-mono shadow-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className={`relative rounded-2xl bg-white border border-gray-300 overflow-hidden shadow-xs ${isFullscreenSandbox ? 'fixed inset-4 z-50 bg-white' : 'h-[440px]'}`}>
                  {isFullscreenSandbox && (
                    <button
                      onClick={() => setIsFullscreenSandbox(false)}
                      aria-label="Exit fullscreen interactive sandbox"
                      className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-white text-gray-900 border border-gray-300 font-mono text-xs shadow-md"
                    >
                      Exit Fullscreen
                    </button>
                  )}
                  <iframe
                    ref={iframeRef}
                    title="meUus Live App Sandbox"
                    srcDoc={outputCode}
                    sandbox="allow-scripts allow-same-origin allow-modals"
                    className="w-full h-full border-0 bg-white"
                  />
                </div>
              </div>

              {/* Right Column: Code & Model Diagnostics (5 Cols) */}
              <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 font-mono flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-emerald-600" />
                    <span>Generated Source Code</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCode}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-mono flex items-center gap-1 shadow-xs"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={downloadFile}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export .html</span>
                    </button>
                  </div>
                </div>

                <div aria-live="polite" className="h-[380px] rounded-2xl bg-gray-50 border border-gray-200 p-4 font-mono text-xs text-gray-800 overflow-auto whitespace-pre leading-relaxed shadow-xs">
                  {outputCode || outputText || '// Waiting for execution... Click "Build & Run Live" to generate code with free model routing.'}
                </div>

                {/* Execution Telemetry pill */}
                {executionMeta && (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-600">Model: <strong className="text-emerald-700">{executionMeta.modelUsed}</strong></span>
                    <span className="text-gray-600">Latency: <strong className="text-gray-900">{executionMeta.latencyMs}ms</strong></span>
                    <span className="text-gray-600">Cost: <strong className="text-emerald-700">$0.00</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: OpenAI ChatGPT Codex & Architecture Suite */}
        {activeTab === 'codex' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">ChatGPT Codex WorkStation</h3>
                    <p className="text-xs text-gray-500">Specialized for TypeScript, Algorithms & System Architecture</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-600 block font-semibold">
                    Engineering Task / Code Requirement:
                  </label>
                  <textarea
                    rows={5}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    aria-label="Engineering Task or Code Requirement"
                    placeholder="Enter your algorithm, TypeScript interface requirement, or refactoring goal..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:border-emerald-500 outline-none font-mono resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleExecute(`Refactor and optimize this TypeScript architecture with complete types and error handling:\n\n${promptInput}`, 'code')}
                    disabled={isLoading}
                    className="bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-800 rounded-xl"
                  >
                    Refactor & Type
                  </Button>
                  <Button
                    onClick={() => handleExecute(`Generate a full Jest/Vitest unit test suite for this logic with 100% edge case coverage:\n\n${promptInput}`, 'code')}
                    disabled={isLoading}
                    className="bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-800 rounded-xl"
                  >
                    Generate Unit Tests
                  </Button>
                </div>

                <Button
                  onClick={() => handleExecute(promptInput, 'code')}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl py-3 shadow-xs"
                >
                  {isLoading ? 'Running Codex...' : 'Run Codex WorkStation (Free)'}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 font-mono">Codex Output & Architecture Response</h4>
                <div className="flex items-center gap-2">
                  <button onClick={copyCode} className="px-3 py-1 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-mono text-gray-700 shadow-xs">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div aria-live="polite" className="h-[460px] rounded-2xl bg-gray-50 border border-gray-200 p-5 font-mono text-xs text-gray-800 overflow-auto whitespace-pre-wrap leading-relaxed shadow-xs">
                {outputText || outputCode || 'Click "Run Codex WorkStation" to compile logic and architectural TypeScript structures.'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Autonomous 4-Stage Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Autonomous 4-Stage Multi-Model Pipeline</h3>
                    <p className="text-xs text-gray-500">Plans, codes, self-tests, and prepares deployment sandboxes automatically</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono text-emerald-700 border-emerald-200 bg-emerald-50">
                  Zero Human Intervention
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={pipelineGoal}
                  onChange={(e) => setPipelineGoal(e.target.value)}
                  placeholder="Enter high level goal (e.g. 'Build a real-time expense calculator with chart visualizer')..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:border-emerald-500 outline-none font-mono"
                />
                <Button
                  onClick={handleRunAutomation}
                  disabled={isPipelineRunning}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl px-6 shadow-xs"
                >
                  {isPipelineRunning ? 'Automating...' : 'Trigger Autonomous Pipeline'}
                </Button>
              </div>
            </div>

            {/* 4 Pipeline Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stage 1 */}
              <div className="p-5 rounded-2xl bg-white border border-blue-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 bg-blue-50 font-mono">
                    Stage 1
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-500">Claude Opus</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Architectural Blueprint</h4>
                <p className="text-xs text-gray-600">
                  {pipelineData?.stage1_Plan?.architecture || 'Defines modular boundaries, state schemas, and interaction models.'}
                </p>
                {pipelineData?.stage1_Plan?.components && (
                  <ul className="text-[11px] text-gray-500 font-mono space-y-1 pt-1">
                    {pipelineData.stage1_Plan.components.map((c: string, i: number) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Stage 2 */}
              <div className="p-5 rounded-2xl bg-white border border-teal-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-teal-700 border-teal-200 bg-teal-50 font-mono">
                    Stage 2
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-500">ChatGPT Codex</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Clean Implementation</h4>
                <p className="text-xs text-gray-600">
                  {pipelineData?.stage2_Code?.summary || 'Compiles complete executable single-file logic with zero placeholders.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="text-xs font-mono text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold"
                  >
                    <span>View in Sandbox →</span>
                  </button>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-5 rounded-2xl bg-white border border-purple-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-200 bg-purple-50 font-mono">
                    Stage 3
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-500">DeepSeek R1</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Quality & Edge-Case QA</h4>
                <p className="text-xs text-gray-600">
                  {pipelineData?.stage3_QualityCheck?.optimizationNotes || 'Validates responsive canvas scaling, memory leak prevention, and keyboard bindings.'}
                </p>
                {pipelineData?.stage3_QualityCheck?.testResults && (
                  <div className="space-y-1 text-[11px] font-mono text-emerald-700 pt-1">
                    {pipelineData.stage3_QualityCheck.testResults.map((t: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-500">{t.test}:</span>
                        <span>{t.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stage 4 */}
              <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50 font-mono">
                    Stage 4
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-500">OmniRoute Live</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Production Deployment</h4>
                <p className="text-xs text-gray-600">
                  Package bundled, tested, and mounted into the interactive sandbox engine.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setActiveTab('builder')}
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs rounded-xl shadow-xs"
                  >
                    Launch App Live
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Step-by-Step Setup Guide & settings.json Exporter */}
        {activeTab === 'setup' && (
          <div className="space-y-8">
            {/* YouTube Workflow Steps Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-600" />
                  <span>The 5 Free AI Models Architecture</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="font-bold text-purple-700">1. Claude Opus 4.6 via Antigravity</div>
                    <p className="text-gray-600">Zero cost deep reasoning tokens routed through Antigravity agent backend.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="font-bold text-amber-700">2. Claude Sonnet 4.6 & Gemini 3.7</div>
                    <p className="text-gray-600">High speed coding and multimodal perception via Google Cloud Free Tier & Claude Code bridge.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="font-bold text-blue-700">3. DeepSeek R1 via OpenCode</div>
                    <p className="text-gray-600">Chain-of-thought mathematical reasoning with free public bridge endpoints.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="font-bold text-green-700">4. NVIDIA NIM Free Key (1,000 Credits)</div>
                    <p className="text-gray-600">Fast Llama 3.3 70B inference directly on NVIDIA accelerated cloud clusters.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="font-bold text-teal-700">5. OpenAI ChatGPT & Codex WorkStation</div>
                    <p className="text-gray-600">Unified into the meUus workspace for complete automated pipelines.</p>
                  </div>
                </div>
              </div>

              {/* Ready-to-Copy settings.json File */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-gray-900 font-mono">Claude Code & Cursor `settings.json`</h4>
                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify({
                          "env": {
                            "ANTHROPIC_BASE_URL": "http://localhost:3000/api/workstation/execute",
                            "DEFAULT_MODEL": "omniroute-combo",
                            "FALLBACK_MODELS": ["claude-opus-4.6", "openai-gpt4o-codex", "deepseek-r1", "gemini-3.7-flash"],
                            "MAX_TOKENS": 8192
                          }
                        }, null, 2);
                        navigator.clipboard.writeText(jsonStr);
                        alert("settings.json copied to clipboard!");
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy settings.json</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use this configuration file to connect your local Claude Code, Cursor, or VS Code to meUus WorkStation:
                  </p>
                </div>

                <pre className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800 overflow-auto leading-relaxed shadow-xs">
{`{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:3000/api/workstation/execute",
    "OPENAI_BASE_URL": "http://localhost:3000/api/workstation/execute",
    "DEFAULT_MODEL": "omniroute-combo",
    "FALLBACK_CHAIN": [
      "claude-opus-4.6",
      "openai-gpt4o-codex",
      "deepseek-r1",
      "nvidia-nim-llama3",
      "gemini-3.7-flash"
    ],
    "AUTO_FAILOVER": true,
    "MAX_TOKENS": 8192
  }
}`}
                </pre>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 font-mono">
                  💡 Tip: When one model experiences a transient rate-limit or downtime, the OmniRoute combo automatically cascades to the next available free model with zero interruption.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
