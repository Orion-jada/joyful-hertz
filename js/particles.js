import { state, ctx } from './state.js';
import { playNodeChime } from './audio.js';

// Array to track electrical pulse signals traversing the neural network
const activePulses = [];

class Particle {
  constructor() {
    this.reset(true);
  }
  
  reset(init = false) {
    this.x = Math.random() * state.width;
    this.y = init ? Math.random() * state.height : (Math.random() > 0.5 ? -10 : state.height + 10);
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = Math.random() * 0.6 + 0.1;
    this.size = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.color = { r: 100, g: 150, b: 200 };
    this.vibrateOffset = { x: 0, y: 0 };
    
    // Dynamic physics modifier
    this.orbitRadius = Math.random() * 80 + 20;
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitSpeed = (Math.random() - 0.5) * 0.02;

    // Firing neuron configurations
    this.glowStrength = 0;
    this.lastFired = 0;
  }
  
  // Fire electrical impulse to connected neighbors
  fire() {
    const now = Date.now();
    if (this.lastFired && now - this.lastFired < 400) return false;
    this.lastFired = now;
    this.glowStrength = 1.0;
    
    const s = state.canvasState;
    const maxDist = s === 'tension' ? 85 : 120;
    
    particles.forEach(neighbor => {
      if (neighbor === this) return;
      
      const dx = this.x - neighbor.x;
      const dy = this.y - neighbor.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < maxDist) {
        // Prevent duplicate pulses on same synapse
        const alreadyExists = activePulses.some(p => p.from === this && p.to === neighbor);
        if (!alreadyExists && activePulses.length < 120) {
          activePulses.push({
            from: this,
            to: neighbor,
            progress: 0,
            speed: Math.random() * 0.035 + 0.02
          });
        }
      }
    });
    return true;
  }
  
  update() {
    const s = state.canvasState;
    const isNeuralNet = ['frontier', 'tension', 'vortex'].includes(s);
    
    // Glow decay
    if (isNeuralNet && this.glowStrength > 0) {
      this.glowStrength -= 0.04;
      if (this.glowStrength < 0) this.glowStrength = 0;
    }
    
    // 1. Base state movements
    if (s === 'winter') {
      this.vy = Math.abs(this.vy);
      if (this.vy < 0.2) this.vy = 0.5;
      this.x += this.vx * 0.5;
      this.y += this.vy * 0.7;
      this.color = { r: 150, g: 180, b: 220 };
    } 
    else if (s === 'war') {
      this.x += this.vx * 1.5;
      this.y += this.vy * 1.5;
      this.color = { r: 180, g: 90, b: 90 };
    } 
    else if (s === 'fractures') {
      this.x += this.vx * 0.4;
      this.y += this.vy * 0.4;
      this.color = { r: 251, g: 191, b: 36 }; // Gold/yellow
    } 
    else if (s === 'reprieve') {
      this.orbitAngle += this.orbitSpeed * 3;
      this.y = (state.height / 2) + Math.sin(this.x * 0.005 + this.orbitAngle) * 150 + Math.cos(this.x * 0.02) * 40;
      this.x += 1.5;
      this.color = { r: 239, g: 68, b: 68 }; // Crimson red
    } 
    else if (s === 'tension') {
      this.vibrateOffset.x = (Math.random() - 0.5) * 4.5;
      this.vibrateOffset.y = (Math.random() - 0.5) * 4.5;
      this.color = { r: 255, g: 255, b: 255 };
    } 
    else if (s === 'vortex') {
      // Flowing wave of nodes (Microsoft/OpenAI teal vs Google/Bard purple, dynamically synced)
      this.orbitAngle += this.orbitSpeed * 0.4;
      this.y = (state.height / 2) + Math.sin(this.x * 0.004 + this.orbitAngle) * 180 + Math.cos(this.x * 0.012) * 40;
      this.x += 1.2;
      
      if (state.activeChapter === 10) {
        this.color = { r: 13, g: 242, b: 201 }; // Teal for Ch 10
      } else {
        this.color = { r: 139, g: 92, b: 246 }; // Purple for Ch 11
      }
    }
    else if (s === 'pulses') {
      // Linear servers rows with horizontal drifting nodes
      this.x += this.vx * 0.9;
      this.y += Math.sin(this.x * 0.05) * 0.6;
      this.color = { r: 99, g: 102, b: 241 }; // Indigo matching #6366f1
    }
    else if (s === 'deepseek') {
      // Bouncing particles decelerating from initial shockwave
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.x += this.vx + (Math.random() - 0.5) * 0.4;
      this.y += this.vy + (Math.random() - 0.5) * 0.4;
      this.color = { r: 236, g: 72, b: 153 }; // Pink/magenta matching #ec4899
    }
    else if (s === 'frontier') {
      // Fluid matrix wave of nodes
      this.orbitAngle += this.orbitSpeed * 0.3;
      this.y = (state.height / 2) + Math.sin(this.x * 0.003 + this.orbitAngle) * 200;
      this.x += 0.8;
      this.color = { r: 6, g: 182, b: 212 }; // Cyan matching #06b6d4
    }
    else if (s === 'chatgpt') {
      this.vibrateOffset.x = 0;
      this.vibrateOffset.y = 0;
      this.orbitAngle += this.orbitSpeed * 0.5;
      this.x += Math.sin(this.orbitAngle) * 0.3;
      this.y += Math.cos(this.orbitAngle) * 0.3;
      this.color = { r: 13, g: 242, b: 201 };
    }

    // 2. Unified Cursor Physics (All particles respond to cursor)
    if (state.mouse.active) {
      const dx = this.x - state.mouse.x;
      const dy = this.y - state.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let radius = 250;
      let forceStrength = 1.0;
      
      // Electric activation on proximity
      if (isNeuralNet && dist < 95) {
        const fired = this.fire();
        if (fired) {
          playNodeChime();
        }
      }
      
      if (s === 'winter') {
        radius = 220;
        forceStrength = 1.5;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * forceStrength;
        }
      } else if (s === 'war') {
        radius = 240;
        forceStrength = 3.5;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * forceStrength;
          this.y += (dy / dist) * force * forceStrength;
        }
      } else if (s === 'fractures') {
        radius = 200;
        forceStrength = 16.0;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * forceStrength;
          this.y += (dy / dist) * force * forceStrength;
        }
      } else if (s === 'reprieve') {
        radius = 240;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.y += (dy / dist) * force * 12;
        }
      } else if (s === 'tension') {
        radius = 300;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.vibrateOffset.x += (Math.random() - 0.5) * force * 10;
          this.vibrateOffset.y += (Math.random() - 0.5) * force * 10;
        }
      } else if (s === 'vortex' || s === 'pulses' || s === 'frontier') {
        radius = 240;
        forceStrength = 4.0; // Repelling force for laminar deflection
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * forceStrength;
          this.y += (dy / dist) * force * forceStrength;
        }
      } else if (s === 'chatgpt') {
        radius = 320;
        forceStrength = 2.5; // Magnetic pulling force for ChatGPT screen
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x -= (dx / dist) * force * forceStrength;
          this.y -= (dy / dist) * force * forceStrength;
        }
      } else if (s === 'deepseek') {
        radius = 180;
        forceStrength = 5.0; // Scatter during deepseek
        if (dist < radius) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * forceStrength;
          this.y += (dy / dist) * force * forceStrength;
        }
      }
    }

    // 3. Keep within canvas boundary resets
    if (s === 'winter') {
      if (this.y > state.height || this.x < 0 || this.x > state.width) {
        this.reset();
      }
    } else if (s === 'reprieve' || s === 'frontier') {
      if (this.x > state.width + 10) {
        this.x = -10;
      }
    } else if (s === 'vortex') {
      // Wrap-around for full screen vortex drift
      if (this.x < -20) this.x = state.width + 20;
      if (this.x > state.width + 20) this.x = -20;
      if (this.y < -20) this.y = state.height + 20;
      if (this.y > state.height + 20) this.y = -20;
    } else {
      if (this.y > state.height + 20 || this.y < -20 || this.x < -20 || this.x > state.width + 20) {
        this.reset();
      }
    }
  }
  
  draw() {
    const rx = this.x + this.vibrateOffset.x;
    const ry = this.y + this.vibrateOffset.y;
    const s = state.canvasState;
    const isNeuralNet = ['frontier', 'tension', 'vortex'].includes(s);
    
    if (isNeuralNet && this.glowStrength > 0.05) {
      // Draw outer glowing halo for excited state
      ctx.beginPath();
      ctx.arc(rx, ry, this.size * (1 + this.glowStrength * 2.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * this.glowStrength * 0.4})`;
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(rx, ry, isNeuralNet ? this.size * (1 + this.glowStrength * 0.4) : this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${isNeuralNet ? Math.min(1.0, this.alpha + this.glowStrength * 0.45) : this.alpha})`;
    ctx.fill();
  }
}

// Initialize particles array
const particleCount = 150;
const particles = [];
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Shockwave trigger for 2025 DeepSeek release
export function triggerShockwave() {
  const centerX = state.width / 2;
  const centerY = state.height / 2;
  particles.forEach(p => {
    const dx = p.x - centerX;
    const dy = p.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = 35 / dist;
    p.vx += (dx / dist) * force * 5;
    p.vy += (dy / dist) * force * 5;
  });
}

// Update and draw signal pulses
function updateAndDrawPulses() {
  const s = state.canvasState;
  const isNeuralNet = ['frontier', 'tension', 'vortex'].includes(s);
  if (!isNeuralNet) {
    activePulses.length = 0; // Clear immediately on state exit
    return;
  }
  
  let pulseColor = { r: 13, g: 242, b: 201 }; // teal (home/frontier)
  if (s === 'tension') {
    pulseColor = { r: 239, g: 68, b: 68 }; // red/coral (mission)
  } else if (s === 'vortex') {
    if (state.activeChapter === 10) {
      pulseColor = { r: 13, g: 242, b: 201 }; // Teal for Ch 10
    } else {
      pulseColor = { r: 139, g: 92, b: 246 }; // Purple for Ch 11
    }
  }

  for (let i = activePulses.length - 1; i >= 0; i--) {
    const pulse = activePulses[i];
    pulse.progress += pulse.speed;
    
    // Position interpolation
    const fromX = pulse.from.x + pulse.from.vibrateOffset.x;
    const fromY = pulse.from.y + pulse.from.vibrateOffset.y;
    const toX = pulse.to.x + pulse.to.vibrateOffset.x;
    const toY = pulse.to.y + pulse.to.vibrateOffset.y;
    
    // Boundary protection for wrapping/resetting nodes
    const distSq = (toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY);
    if (distSq > 300 * 300) {
      activePulses.splice(i, 1);
      continue;
    }
    
    const cx = fromX + (toX - fromX) * pulse.progress;
    const cy = fromY + (toY - fromY) * pulse.progress;
    
    // Render signal pulse dot
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${pulseColor.r}, ${pulseColor.g}, ${pulseColor.b}, 0.95)`;
    ctx.shadowColor = `rgba(${pulseColor.r}, ${pulseColor.g}, ${pulseColor.b}, 0.8)`;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0; // reset immediately
    
    if (pulse.progress >= 1.0) {
      pulse.to.glowStrength = 1.0;
      
      // Proximity propagation
      if (Math.random() < 0.25) {
        const nextNeighbors = [];
        const maxDist = s === 'tension' ? 85 : 120;
        
        particles.forEach(n => {
          if (n === pulse.to || n === pulse.from) return;
          const dx = pulse.to.x - n.x;
          const dy = pulse.to.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            nextNeighbors.push(n);
          }
        });
        
        if (nextNeighbors.length > 0) {
          const target = nextNeighbors[Math.floor(Math.random() * nextNeighbors.length)];
          const now = Date.now();
          if (!target.lastFired || now - target.lastFired > 400) {
            target.lastFired = now;
            activePulses.push({
              from: pulse.to,
              to: target,
              progress: 0,
              speed: Math.random() * 0.035 + 0.02
            });
          }
        }
      }
      activePulses.splice(i, 1);
    }
  }
}

// Animating connections between neighboring nodes
function drawConnections() {
  const s = state.canvasState;
  if (s === 'winter' || s === 'reprieve') return; 
  
  let maxDistance = 90;
  let r = 255, g = 255, b = 255, baseAlpha = 0.15;
  
  if (s === 'war') {
    maxDistance = 110;
    r = 180; g = 100; b = 100;
    baseAlpha = 0.1;
  } else if (s === 'fractures') {
    maxDistance = 85;
    r = 251; g = 191; b = 36; 
    baseAlpha = 0.25;
  } else if (s === 'tension') {
    maxDistance = 85;
    r = 239; g = 68; b = 68; 
    baseAlpha = 0.18;
  } else if (s === 'chatgpt') {
    maxDistance = 130;
    r = 13; g = 242; b = 201;
    baseAlpha = 0.15; 
  } else if (s === 'vortex') {
    maxDistance = 110;
    if (state.activeChapter === 10) {
      r = 13; g = 242; b = 201; // Teal
    } else {
      r = 139; g = 92; b = 246; // Purple
    }
    baseAlpha = 0.16;
  } else if (s === 'pulses') {
    maxDistance = 120;
    r = 99; g = 102; b = 241; // Indigo
    baseAlpha = 0.15;
  } else if (s === 'deepseek') {
    maxDistance = 90;
    r = 236; g = 72; b = 153; // Pink
    baseAlpha = 0.25;
  } else if (s === 'frontier') {
    maxDistance = 130;
    r = 6; g = 182; b = 212; // Cyan
    baseAlpha = 0.20;
  }
  
  ctx.lineWidth = 0.8;
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    const r1x = p1.x + p1.vibrateOffset.x;
    const r1y = p1.y + p1.vibrateOffset.y;
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const r2x = p2.x + p2.vibrateOffset.x;
      const r2y = p2.y + p2.vibrateOffset.y;
      
      const dx = r1x - r2x;
      const dy = r1y - r2y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < maxDistance) {
        const alpha = (1 - dist / maxDistance) * baseAlpha;
        ctx.beginPath();
        ctx.moveTo(r1x, r1y);
        ctx.lineTo(r2x, r2y);
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.stroke();
      }
    }
  }
}

// Core Rendering Loop
export function renderCanvas() {
  const s = state.canvasState;
  
  if (s === 'chatgpt') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  } else if (s === 'tension') {
    ctx.fillStyle = 'rgba(3, 5, 8, 0.3)';
  } else {
    ctx.fillStyle = 'rgba(3, 5, 8, 0.12)';
  }
  
  ctx.fillRect(0, 0, state.width, state.height);
  
  // Render nodes
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Draw signal pulses
  updateAndDrawPulses();
  
  // Connect nodes
  drawConnections();
  
  // Spontaneous random signal generation
  const isNeuralNet = ['frontier', 'tension', 'vortex'].includes(s);
  if (isNeuralNet && Math.random() < 0.02 && particles.length > 0) {
    const randParticle = particles[Math.floor(Math.random() * particles.length)];
    randParticle.fire();
  }
  
  requestAnimationFrame(renderCanvas);
}
