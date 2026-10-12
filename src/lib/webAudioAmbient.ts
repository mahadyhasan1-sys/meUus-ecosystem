/**
 * meUus Procedural Ambient Sound Engine (Web Audio API)
 * 
 * 100% Offline, Zero external assets, Zero network latency.
 * Generates natural calming soundscapes procedurally in-browser:
 * - Gentle Monsoon Rain (filtered pink noise)
 * - Mountain Stream (band-passed water resonance with slow LFO)
 * - 432Hz Grounding Tone (binaural relaxation harmonic)
 * - Temple Wind Chimes (procedural pentatonic bell resonance)
 */

export type AmbientSoundType = 'RAIN' | 'STREAM' | 'GROUNDING_432' | 'CHIMES' | 'SILENCE';

class WebAudioAmbientEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentType: AmbientSoundType = 'SILENCE';
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private chimeTimer: any = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentType = 'SILENCE';
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Node already stopped
      }
    });
    this.activeNodes = [];
  }

  public play(type: AmbientSoundType) {
    this.stop();
    if (type === 'SILENCE') return;

    const ctx = this.initContext();
    this.isPlaying = true;
    this.currentType = type;

    switch (type) {
      case 'RAIN':
        this.startRain(ctx);
        break;
      case 'STREAM':
        this.startStream(ctx);
        break;
      case 'GROUNDING_432':
        this.startGrounding432(ctx);
        break;
      case 'CHIMES':
        this.startChimes(ctx);
        break;
    }
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // --- Rain Generator (Filtered Pink Noise with Slow Modulation) ---
  private startRain(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  // --- Mountain Stream (Band-passed bubbling noise with LFO resonance) ---
  private startStream(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(540, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.35, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, gain, lfo, lfoGain);
  }

  // --- 432Hz Grounding Harmonic Tone ---
  private startGrounding432(ctx: AudioContext) {
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(216, ctx.currentTime); // Sub-octave

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.12, ctx.currentTime);

    // Subtle binaural modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(2, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain!);
    gain2.connect(this.masterGain!);

    osc1.start();
    osc2.start();
    lfo.start();

    this.activeNodes.push(osc1, osc2, gain1, gain2, lfo, lfoGain);
  }

  // --- Wind Chimes (Pentatonic random bell synthesizer) ---
  private startChimes(ctx: AudioContext) {
    const pentatonicFrequencies = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
    
    // Play gentle chime at random intervals (every 2-4 seconds)
    const playChimeNote = () => {
      if (!this.isPlaying || this.currentType !== 'CHIMES') return;
      const freq = pentatonicFrequencies[Math.floor(Math.random() * pentatonicFrequencies.length)];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell overtone harmonic
      const harmonic = ctx.createOscillator();
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2.76, now);

      const chimeGain = ctx.createGain();
      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(chimeGain);
      harmonic.connect(harmGain);
      chimeGain.connect(this.masterGain!);
      harmGain.connect(this.masterGain!);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 3.3);
      harmonic.stop(now + 2.0);
    };

    playChimeNote();
    this.chimeTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        playChimeNote();
      }
    }, 2400);
  }
}

export const webAudioAmbient = new WebAudioAmbientEngine();
