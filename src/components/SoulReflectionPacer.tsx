import React, { useState, useEffect, useRef } from 'react';
import PageHeader from './PageHeader';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  CloudRain, 
  Waves, 
  Activity, 
  Bell, 
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { webAudioAmbient, AmbientSoundType } from '../lib/webAudioAmbient';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SoulReflectionPacerProps {
  onClose?: () => void;
  compact?: boolean;
}

export default function SoulReflectionPacer({ onClose, compact = false }: SoulReflectionPacerProps) {
  // Audio state
  const [selectedSound, setSelectedSound] = useState<AmbientSoundType>('SILENCE');
  const [volume, setVolume] = useState<number>(0.5);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Breathing state: 4-7-8 rhythm (4s Inhale, 7s Hold, 8s Exhale)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // minutes
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Handle ambient sound change
  const handleSelectSound = (type: AmbientSoundType) => {
    if (selectedSound === type && isAudioPlaying) {
      webAudioAmbient.stop();
      setIsAudioPlaying(false);
      setSelectedSound('SILENCE');
    } else {
      webAudioAmbient.setVolume(volume);
      webAudioAmbient.play(type);
      setSelectedSound(type);
      setIsAudioPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    webAudioAmbient.setVolume(newVol);
  };

  // Cleanup audio when unmounted
  useEffect(() => {
    return () => {
      webAudioAmbient.stop();
    };
  }, []);

  // 4-7-8 Breathing Timer Loop
  useEffect(() => {
    let interval: any;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        setPhaseSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Transition to next phase
          if (breathPhase === 'INHALE') {
            setBreathPhase('HOLD');
            return 7;
          } else if (breathPhase === 'HOLD') {
            setBreathPhase('EXHALE');
            return 8;
          } else {
            // Completed 1 cycle
            setCyclesCompleted((c) => c + 1);
            setBreathPhase('INHALE');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase('INHALE');
      setPhaseSecondsLeft(4);
      setIsBreathingActive(true);
      // If audio is silent, start gentle grounding tone automatically
      if (!isAudioPlaying) {
        handleSelectSound('GROUNDING_432');
      }
    } else {
      setIsBreathingActive(false);
    }
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('INHALE');
    setPhaseSecondsLeft(4);
    setCyclesCompleted(0);
    setElapsedSeconds(0);
  };

  const soundOptions: { type: AmbientSoundType; label: string; icon: any; desc: string }[] = [
    { type: 'RAIN', label: 'Monsoon Rain', icon: CloudRain, desc: 'Calming pink noise rain' },
    { type: 'STREAM', label: 'Mountain Stream', icon: Waves, desc: 'Bubbling water flow' },
    { type: 'GROUNDING_432', label: '432Hz Grounding', icon: Activity, desc: 'Restorative harmonic tone' },
    { type: 'CHIMES', label: 'Wind Chimes', icon: Bell, desc: 'Procedural pentatonic bell' },
  ];

  return (
    <div className={`bg-gray-50 text-gray-900 min-h-screen ${compact ? 'max-w-xl mx-auto' : 'w-full'}`}>
      <PageHeader
        icon={<Heart size={18} />}
        title="Soul Reflection Pacer"
        subtitle="Guided Introspective Pacing, Cognitive Rest, and Reflective Sync."
        badge="Pacer"
        breadcrumb="Personal Growth"
      />
      <div className="py-6 px-4 sm:px-6">
      <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Soul Breathing & Calming Soundscape</span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700 bg-emerald-950/40">
                100% Offline Procedural
              </Badge>
            </h3>
            <p className="text-xs text-gray-500">4-7-8 Rhythmic Breathing with Web Audio ambient synthesis</p>
          </div>
        </div>

        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xs">
            Close
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-center">
        {/* Left: Interactive 4-7-8 Breathing Ring */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-gray-200/80 relative min-h-[280px]">
          {/* Animated Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Ambient pulse background */}
            <motion.div
              animate={{
                scale: breathPhase === 'INHALE' ? 1.35 : breathPhase === 'HOLD' ? 1.35 : 0.85,
                opacity: isBreathingActive ? 0.35 : 0.15,
              }}
              transition={{
                duration: breathPhase === 'INHALE' ? 4 : breathPhase === 'HOLD' ? 0.4 : 8,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 blur-xl"
            />

            {/* Inner Ring */}
            <motion.div
              animate={{
                scale: breathPhase === 'INHALE' ? 1.25 : breathPhase === 'HOLD' ? 1.25 : 0.9,
              }}
              transition={{
                duration: breathPhase === 'INHALE' ? 4 : breathPhase === 'HOLD' ? 0.4 : 8,
                ease: 'easeInOut',
              }}
              className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center shadow-md transition-colors duration-500 ${
                breathPhase === 'INHALE'
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                  : breathPhase === 'HOLD'
                  ? 'border-amber-400 bg-amber-950/60 text-amber-200'
                  : 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
              }`}
            >
              <span className="text-2xl font-mono font-bold">{phaseSecondsLeft}s</span>
              <span className="text-xs font-semibold tracking-wider uppercase mt-1">
                {isBreathingActive ? breathPhase : 'READY'}
              </span>
            </motion.div>
          </div>

          {/* Phase Guidance Text */}
          <div className="text-center mt-4 h-10">
            <p className="text-xs font-medium text-gray-700">
              {!isBreathingActive
                ? 'Press Start to begin a guided 4-7-8 restorative breathing cycle.'
                : breathPhase === 'INHALE'
                ? 'Inhale gently through your nose (4 seconds)...'
                : breathPhase === 'HOLD'
                ? 'Hold your breath gently in stillness (7 seconds)...'
                : 'Exhale slowly and completely through your mouth (8 seconds)...'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={toggleBreathing}
              className={`rounded-2xl px-5 h-9 font-semibold text-xs shadow-lg ${
                isBreathingActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isBreathingActive ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {isBreathingActive ? 'Pause Breath' : 'Start 4-7-8 Breath'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetBreathing}
              className="rounded-2xl border-gray-300 text-gray-500 hover:text-gray-900 text-xs h-9"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            {cyclesCompleted > 0 && (
              <span className="text-xs font-mono text-emerald-600">
                {cyclesCompleted} {cyclesCompleted === 1 ? 'cycle' : 'cycles'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Procedural Calming Sound Generator */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-700 font-bold tracking-wider">
              Procedural Ambient Sound
            </span>
            <span className="text-[10px] font-mono text-gray-500">Web Audio API</span>
          </div>

          {/* Sound Choices */}
          <div className="grid grid-cols-2 gap-2.5">
            {soundOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedSound === opt.type && isAudioPlaying;
              return (
                <button
                  key={opt.type}
                  onClick={() => handleSelectSound(opt.type)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50 text-emerald-950'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-gray-500'}`} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight text-gray-900">{opt.label}</div>
                    <div className="text-[10px] text-gray-500 truncate">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1.5">
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                Sound Volume
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Privacy & Zero-Data Guarantee */}
          <div className="p-3 rounded-xl bg-white border border-gray-200/60 flex items-start gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Synthesized mathematically inside your browser. No files are downloaded, no external network calls are made, and zero bandwidth is consumed.
            </p>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
