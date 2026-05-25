import { state, audioToggle, audioLabel } from './state.js';

export let audioCtx = null;
let masterGain = null;
let lowpassFilter = null;
let droneOsc1 = null;
let droneOsc2 = null;
let tensionOsc = null;
let tensionGain = null;
let noiseNode = null;
let noiseGain = null;
let cleanOsc1 = null;
let cleanOsc2 = null;
let cleanGain = null;

export function initAudio() {
  if (state.audioInitialized) return;
  
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  
  // Create nodes
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(state.isMuted ? 0 : 0.4, audioCtx.currentTime);
  
  lowpassFilter = audioCtx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.frequency.setValueAtTime(100, audioCtx.currentTime);
  lowpassFilter.Q.setValueAtTime(2.0, audioCtx.currentTime);
  
  // Drone Generator (Low C tone approx 65.41 Hz - C2)
  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(65.41, audioCtx.currentTime);
  
  droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'triangle';
  droneOsc2.frequency.setValueAtTime(65.91, audioCtx.currentTime); // slightly detuned
  
  // Tension Generator (High-pitched metallic ring - A3)
  tensionOsc = audioCtx.createOscillator();
  tensionOsc.type = 'sawtooth';
  tensionOsc.frequency.setValueAtTime(220, audioCtx.currentTime);
  
  tensionGain = audioCtx.createGain();
  tensionGain.gain.setValueAtTime(0, audioCtx.currentTime);
  
  // Ambient Wind Noise
  noiseNode = createNoiseBufferNode();
  noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  
  // ChatGPT clean tone chord generators
  cleanOsc1 = audioCtx.createOscillator();
  cleanOsc1.type = 'sine';
  cleanOsc1.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3
  
  cleanOsc2 = audioCtx.createOscillator();
  cleanOsc2.type = 'sine';
  cleanOsc2.frequency.setValueAtTime(196.00, audioCtx.currentTime); // G3
  
  cleanGain = audioCtx.createGain();
  cleanGain.gain.setValueAtTime(0, audioCtx.currentTime);
  
  // Connections
  droneOsc1.connect(lowpassFilter);
  droneOsc2.connect(lowpassFilter);
  
  tensionOsc.connect(tensionGain);
  tensionGain.connect(lowpassFilter);
  
  if (noiseNode) {
    noiseNode.connect(noiseGain);
    noiseGain.connect(masterGain);
  }
  
  cleanOsc1.connect(cleanGain);
  cleanOsc2.connect(cleanGain);
  cleanGain.connect(masterGain);
  
  lowpassFilter.connect(masterGain);
  masterGain.connect(audioCtx.destination);
  
  // Start oscillators
  droneOsc1.start(0);
  droneOsc2.start(0);
  tensionOsc.start(0);
  cleanOsc1.start(0);
  cleanOsc2.start(0);
  if (noiseNode) noiseNode.start(0);
  
  state.audioInitialized = true;
}

function createNoiseBufferNode() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  const ctxTemp = new (window.AudioContext || window.webkitAudioContext)();
  const bufferSize = ctxTemp.sampleRate * 2;
  const noiseBuffer = ctxTemp.createBuffer(1, bufferSize, ctxTemp.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  return whiteNoise;
}

export function toggleMute() {
  if (!state.audioInitialized) {
    initAudio();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  state.isMuted = !state.isMuted;
  
  if (state.isMuted) {
    audioToggle.classList.remove('playing');
    audioLabel.textContent = "Sound Off";
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
  } else {
    audioToggle.classList.add('playing');
    audioLabel.textContent = "Sound On";
    masterGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.3);
    updateAudioStateForPage(state.activePage);
  }
}

// Scheduler timers for arpeggiator
let arpeggioTimer = null;
let agenticBeatTimer = null;

export function stopArpeggiator() {
  if (arpeggioTimer) {
    clearInterval(arpeggioTimer);
    arpeggioTimer = null;
  }
  if (agenticBeatTimer) {
    clearInterval(agenticBeatTimer);
    agenticBeatTimer = null;
  }
}

export function startArpeggiator(chapterIndex) {
  stopArpeggiator();
  
  let scale = [261.63, 311.13, 392.00, 466.16]; // C minor (C4, Eb4, G4, Bb4)
  let tempo = 350;
  
  if (chapterIndex === 10) {
    scale = [261.63, 311.13, 392.00, 466.16];
    tempo = 350;
  } else if (chapterIndex === 11) {
    scale = [392.00, 466.16, 587.33, 698.46]; // 2023: G minor (G4, Bb4, D5, F5)
    tempo = 280;
  } else if (chapterIndex === 12) {
    scale = [293.66, 349.23, 440.00, 523.25, 587.33]; // 2024: D minor (D4, F4, A4, C5, D5)
    tempo = 200;
  } else if (chapterIndex === 13) {
    scale = [440.00, 523.25, 659.25, 783.99, 880.00]; // 2025: A minor (A4, C5, E5, G5, A5)
    tempo = 140;
  } else if (chapterIndex === 14) {
    scale = [523.25, 659.25, 783.99, 1046.50, 1174.66]; // 2026: C major pentatonic (C5, E5, G5, C6, D6)
    tempo = 90;
    startAgenticBeat();
  }
  
  let noteIndex = 0;
  arpeggioTimer = setInterval(() => {
    if (state.isMuted || !state.audioInitialized) return;
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    const freq = scale[noteIndex % scale.length];
    osc.frequency.setValueAtTime(freq, now);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + 0.35);
    
    noteIndex++;
  }, tempo);
}

export function startAgenticBeat() {
  agenticBeatTimer = setInterval(() => {
    if (state.isMuted || !state.audioInitialized) return;
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, now); // low drum kick
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + 0.6);
  }, 600);
}

export function updateAudioState(chapterIndex) {
  if (!state.audioInitialized || state.isMuted) return;
  
  const now = audioCtx.currentTime;
  
  if (chapterIndex === 9) {
    playResolutionChord();
    
    lowpassFilter.frequency.exponentialRampToValueAtTime(30, now + 1.2);
    tensionGain.gain.linearRampToValueAtTime(0, now + 0.8);
    noiseGain.gain.linearRampToValueAtTime(0.01, now + 1.5);
    
    cleanGain.gain.linearRampToValueAtTime(0.25, now + 1.5);
    
    stopArpeggiator();
  } else if (chapterIndex >= 10) {
    lowpassFilter.frequency.setValueAtTime(30, now);
    tensionGain.gain.setValueAtTime(0, now);
    noiseGain.gain.setValueAtTime(0.01, now);
    cleanGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
    
    startArpeggiator(chapterIndex);
  } else {
    stopArpeggiator();
    cleanGain.gain.linearRampToValueAtTime(0, now + 0.5);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.5);
    modulateAudioParams();
  }
}

export function updateAudioStateForPage(pageId) {
  if (!state.audioInitialized || state.isMuted) return;
  const now = audioCtx.currentTime;

  if (pageId === 'home') {
    cleanGain.gain.linearRampToValueAtTime(0.2, now + 1.2);
    cleanOsc1.frequency.exponentialRampToValueAtTime(130.81, now + 1.2);
    cleanOsc2.frequency.exponentialRampToValueAtTime(196.00, now + 1.2);

    lowpassFilter.frequency.exponentialRampToValueAtTime(40, now + 1.2);
    tensionGain.gain.linearRampToValueAtTime(0, now + 0.8);
    noiseGain.gain.linearRampToValueAtTime(0.015, now + 1.2);
  } else if (pageId === 'mission') {
    cleanGain.gain.linearRampToValueAtTime(0.08, now + 1.2);
    cleanOsc1.frequency.exponentialRampToValueAtTime(110.00, now + 1.2);
    cleanOsc2.frequency.exponentialRampToValueAtTime(165.00, now + 1.2);

    lowpassFilter.frequency.exponentialRampToValueAtTime(180, now + 1.2);
    lowpassFilter.Q.setValueAtTime(3.0, now);
    tensionGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
    tensionOsc.frequency.setValueAtTime(220, now);
    noiseGain.gain.linearRampToValueAtTime(0.03, now + 1.2);
  } else if (pageId === 'team') {
    cleanGain.gain.linearRampToValueAtTime(0.18, now + 1.2);
    cleanOsc1.frequency.exponentialRampToValueAtTime(146.83, now + 1.2);
    cleanOsc2.frequency.exponentialRampToValueAtTime(220.00, now + 1.2);

    lowpassFilter.frequency.exponentialRampToValueAtTime(80, now + 1.2);
    tensionGain.gain.linearRampToValueAtTime(0, now + 0.8);
    noiseGain.gain.linearRampToValueAtTime(0.02, now + 1.2);
  }
}

export function modulateAudioParams() {
  if (!state.audioInitialized || state.isMuted || state.activeChapter >= 9 || state.activePage !== 'article') return;
  
  const now = audioCtx.currentTime;
  const p = state.scrollPercent;
  
  const tensionCurve = Math.pow(p, 2.5);
  
  const baseFreq = 65.41 + tensionCurve * 8.01;
  droneOsc1.frequency.setValueAtTime(baseFreq, now);
  droneOsc2.frequency.setValueAtTime(baseFreq + 0.5 + (p * 2.0), now);
  
  const filterCutoff = 90 + Math.pow(p, 2) * 510;
  lowpassFilter.frequency.setValueAtTime(filterCutoff, now);
  
  const filterQ = 1.5 + p * 6;
  lowpassFilter.Q.setValueAtTime(filterQ, now);
  
  const tensionVolume = p * 0.15;
  tensionGain.gain.setValueAtTime(tensionVolume, now);
  
  const tensionFreq = 220 + p * 110;
  tensionOsc.frequency.setValueAtTime(tensionFreq, now);
  
  noiseGain.gain.setValueAtTime(0.04 + Math.sin(now) * 0.015, now);
}

function playResolutionChord() {
  const now = audioCtx.currentTime;
  const chord = [261.63, 329.63, 392.00, 523.25];
  
  chord.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    const delay = idx * 0.08;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + delay + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.5);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(now + delay);
    osc.stop(now + delay + 3.0);
  });
}
