// ==========================================
// Synapse Entry Point (ES6 Module Router & Engine Glue)
// ==========================================

import {
  state,
  canvas,
  scroller,
  chapters,
  progressFill,
  dotNav,
  audioToggle,
  audioLabel,
  soundOverlay,
  btnSoundOn,
  btnSoundOff,
  logoElement
} from './js/state.js';

import { renderCanvas, triggerShockwave } from './js/particles.js';
import {
  initAudio,
  toggleMute,
  updateAudioState,
  updateAudioStateForPage,
  modulateAudioParams,
  audioCtx,
  playHoverSound,
  playClickSound,
  playKeypressSound
} from './js/audio.js';
import { initTerminal } from './js/terminal.js';
import { initRouter, resolveInitialRoute } from './js/router.js';
import { initAgentWorkspace } from './js/agent.js';

// Set initial canvas dimensions
canvas.width = state.width;
canvas.height = state.height;

// Start particle rendering loop
requestAnimationFrame(renderCanvas);

// Initialize router, terminal, and agentic workspace simulations
initRouter();
resolveInitialRoute();
initTerminal();
initAgentWorkspace();

// ------------------------------------------
// 1. Interactive Dot Navigation Generation
// ------------------------------------------
chapters.forEach((chapter, index) => {
  chapter.style.setProperty('--chapter-index', index);
  const wrapper = document.createElement('div');
  wrapper.className = `nav-dot-wrapper ${index === 0 ? 'active' : ''}`;
  wrapper.setAttribute('data-index', index);
  
  const labelElement = chapter.querySelector('.chapter-meta .chapter-date');
  const labelText = labelElement ? labelElement.textContent : '';
  const label = document.createElement('span');
  label.className = 'nav-label';
  if (index === 0) {
    label.textContent = `Intro: ${labelText}`;
  } else {
    label.textContent = `Ch ${index}: ${labelText}`;
  }
  
  const dot = document.createElement('div');
  dot.className = 'nav-dot';
  
  const themeColor = chapter.style.getPropertyValue('--chapter-theme-color');
  wrapper.style.setProperty('--chapter-theme-color', themeColor);
  
  wrapper.appendChild(label);
  wrapper.appendChild(dot);
  dotNav.appendChild(wrapper);
  
  wrapper.addEventListener('click', () => {
    chapter.scrollIntoView({ behavior: 'smooth' });
  });
});

// Update timeline slider offsets dynamically in JS for rock-solid cross-browser compatibility
export function updateTimelineOffsets() {
  const isDesktop = window.innerWidth >= 1000;
  const scrollTop = scroller ? scroller.scrollTop : 0;
  const viewportHeight = window.innerHeight || 1;
  const currentScrollChapter = scrollTop / viewportHeight;
  
  // The timeline is active if the scroll position is within the timeline range
  // We widen it slightly to make transitions smooth (chapters 10 to 15)
  const isTimelineActive = currentScrollChapter >= 9.0 && currentScrollChapter <= 15.5;

  chapters.forEach((chapter, index) => {
    if (index >= 10 && index <= 15) {
      const card = chapter.querySelector('.timeline-card');
      if (card) {
        if (isTimelineActive && isDesktop) {
          const diff = index - currentScrollChapter;
          const offsetVw = diff * 85;
          
          card.style.position = 'fixed';
          card.style.top = '50%';
          card.style.left = '50%';
          // Perfect translateX horizontal sliding alignment
          card.style.transform = `translate(-50%, -50%) translateX(${offsetVw}vw)`;
          card.style.margin = '0';
          card.style.zIndex = '10';
          
          // Calculate continuous opacity fading to prevent overlaps
          const dist = Math.abs(diff);
          const opacity = Math.max(0, 1 - dist * 1.5);
          card.style.opacity = opacity;
          
          card.style.pointerEvents = 'none';
        } else {
          // Revert to stylesheet rules for vertical layout / mobile
          card.style.position = '';
          card.style.top = '';
          card.style.left = '';
          card.style.transform = '';
          card.style.margin = '';
          card.style.zIndex = '';
          card.style.opacity = '';
          card.style.pointerEvents = '';
        }
      }
    }
  });
}
updateTimelineOffsets();

// ------------------------------------------
// 2. Active Chapter / View Transitions Coordinator
// ------------------------------------------
export function updateActiveChapter(activeIndex) {
  if (state.activeChapter === activeIndex) return;
  
  const oldCanvasState = state.canvasState;
  state.activeChapter = activeIndex;
  
  // Keep header logo title as SYNAPSE
  if (logoElement) {
    logoElement.textContent = 'SYNAPSE';
  }
  
  // 1. Toggle chapter active statuses
  chapters.forEach((chapter, index) => {
    if (index === activeIndex) {
      chapter.classList.add('active');
    } else {
      chapter.classList.remove('active');
    }
  });
  
  // 2. Toggle dot navigation wrappers statuses
  const navWrappers = document.querySelectorAll('.nav-dot-wrapper');
  navWrappers.forEach((wrapper, index) => {
    if (index === activeIndex) {
      wrapper.classList.add('active');
    } else {
      wrapper.classList.remove('active');
    }
  });
  
  // 3. Coordinate canvasState with chapter index
  if (activeIndex === 0 || activeIndex === 1) {
    state.canvasState = 'winter';
  } else if (activeIndex >= 2 && activeIndex <= 3) {
    state.canvasState = 'war';
  } else if (activeIndex >= 4 && activeIndex <= 5) {
    state.canvasState = 'fractures';
  } else if (activeIndex >= 6 && activeIndex <= 7) {
    state.canvasState = 'reprieve';
  } else if (activeIndex === 8) {
    state.canvasState = 'tension';
  } else if (activeIndex === 9) {
    state.canvasState = 'chatgpt';
  } else if (activeIndex === 10) {
    state.canvasState = 'vortex';
  } else if (activeIndex === 11) {
    state.canvasState = 'vortex';
  } else if (activeIndex === 12) {
    state.canvasState = 'pulses';
  } else if (activeIndex === 13) {
    state.canvasState = 'deepseek';
    if (oldCanvasState !== 'deepseek') {
      triggerShockwave();
    }
  } else if (activeIndex === 14) {
    state.canvasState = 'frontier';
  } else if (activeIndex === 15) {
    state.canvasState = 'agentic';
  }
  
  // 4. Propagate theme colors
  const activeChapterElement = chapters[activeIndex];
  if (activeChapterElement) {
    const themeColor = activeChapterElement.style.getPropertyValue('--chapter-theme-color');
    document.body.style.setProperty('--chapter-theme-color', themeColor);
  }
  
  updateTimelineOffsets();
  
  // 5. CSS Toggles
  if (state.canvasState === 'chatgpt') {
    document.body.classList.add('chatgpt-active');
  } else {
    document.body.classList.remove('chatgpt-active');
  }
  
  const isTimelineState = ['vortex', 'pulses', 'deepseek', 'frontier', 'agentic'].includes(state.canvasState);
  if (isTimelineState) {
    document.body.classList.add('timeline-active');
  } else {
    document.body.classList.remove('timeline-active');
  }
  
  // 6. Update Audio States
  updateAudioState(activeIndex);

  // 7. Update Document Title dynamically for article timeline chapters
  if (state.activePage === 'article') {
    const chapterEl = chapters[activeIndex];
    if (chapterEl) {
      const headerEl = chapterEl.querySelector('.timeline-title, h1');
      if (headerEl) {
        document.title = `${headerEl.textContent.trim()} | An Accelerated History of AI | SYNAPSE`;
      } else {
        document.title = `Chapter ${activeIndex} | An Accelerated History of AI | SYNAPSE`;
      }
    }
  }
}

// ------------------------------------------
// 3. User Scrolling & Interactivity Hooks
// ------------------------------------------
if (scroller) {
  scroller.addEventListener('scroll', () => {
    if (state.activePage !== 'article') return;
    
    const scrollTop = scroller.scrollTop;
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    const rawPercent = maxScroll > 0 ? scrollTop / maxScroll : 0;
    state.scrollPercent = Math.max(0, Math.min(1, rawPercent));
    
    progressFill.style.width = `${state.scrollPercent * 100}%`;
    
    let currentActiveIndex = 0;
    let minDiff = Infinity;
    const viewportCenter = window.innerHeight / 2;
    
    chapters.forEach((chapter, index) => {
      const rect = chapter.getBoundingClientRect();
      const chapterCenter = rect.top + rect.height / 2;
      const diff = Math.abs(viewportCenter - chapterCenter);
      
      if (diff < minDiff) {
        minDiff = diff;
        currentActiveIndex = index;
      }
    });
    
    updateActiveChapter(currentActiveIndex);
    updateTimelineOffsets(); // Update timeline sliding position continuously on every scroll frame
    modulateAudioParams();
  });
}

// Global Cursor tracking for background particles
window.addEventListener('mousemove', (e) => {
  state.mouse.x = e.clientX;
  state.mouse.y = e.clientY;
  state.mouse.active = true;
});

window.addEventListener('mouseleave', () => {
  state.mouse.active = false;
});

window.addEventListener('resize', () => {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = state.width;
  canvas.height = state.height;
  updateTimelineOffsets(); // Recalculate continuous offsets for new dimensions
});

// ------------------------------------------
// 4. Sound Warning & Top-header Controls Wiring
// ------------------------------------------
if (audioToggle) {
  audioToggle.addEventListener('click', toggleMute);
}

if (btnSoundOn) {
  btnSoundOn.addEventListener('click', () => {
    state.isMuted = false;
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audioToggle.classList.add('playing');
    audioLabel.textContent = 'Sound On';
    
    // Set active sound scape for entered page
    if (state.activePage === 'article') {
      updateAudioState(state.activeChapter);
    } else {
      updateAudioStateForPage(state.activePage);
    }
    
    soundOverlay.classList.add('fade-out');
    setTimeout(() => {
      soundOverlay.style.display = 'none';
    }, 800);
  });
}

if (btnSoundOff) {
  btnSoundOff.addEventListener('click', () => {
    state.isMuted = true;
    initAudio(); // initializes audio objects, but keeps master volume zero
    soundOverlay.classList.add('fade-out');
    setTimeout(() => {
      soundOverlay.style.display = 'none';
    }, 800);
  });
}

// ------------------------------------------
// 5. Global UI Sound Effect Bindings
// ------------------------------------------
function initUISoundBindings() {
  // Select all interactive UI elements
  const hoverClickElements = document.querySelectorAll(
    '.nav-link, .btn-primary, .btn-secondary, .toc-item, .drawer-close, .form-submit, .audio-control, .nav-trigger'
  );
  
  hoverClickElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playHoverSound();
    });
    el.addEventListener('click', () => {
      playClickSound();
    });
  });
  
  // Attach typing click sounds to input fields
  const textInputs = document.querySelectorAll('input, textarea');
  textInputs.forEach(input => {
    input.addEventListener('keypress', () => {
      playKeypressSound();
    });
  });
}

// Run sound bindings setup
initUISoundBindings();
