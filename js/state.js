// Global state tracking
export const state = {
  activePage: 'home',
  activeChapter: 0,
  scrollPercent: 0,
  isMuted: true,
  audioInitialized: false,
  canvasState: 'frontier', // winter, war, fractures, reprieve, tension, chatgpt, frontier, vortex, deepseek, pulses
  width: window.innerWidth,
  height: window.innerHeight,
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false }
};

// UI Elements
export const scroller = document.getElementById('main-scroller');
export const chapters = document.querySelectorAll('.chapter');
export const progressFill = document.getElementById('progress-indicator');
export const dotNav = document.getElementById('dot-nav');
export const audioToggle = document.getElementById('audio-toggle');
export const audioLabel = audioToggle.querySelector('.audio-label');
export const soundOverlay = document.getElementById('sound-overlay');
export const btnSoundOn = document.getElementById('btn-sound-on');
export const btnSoundOff = document.getElementById('btn-sound-off');
export const canvas = document.getElementById('background-canvas');
export const ctx = canvas.getContext('2d');
export const logoElement = document.querySelector('.logo');

// SPA UI Elements
export const navLinks = document.querySelectorAll('.nav-link');
export const pageViews = document.querySelectorAll('.page-view');
export const navTriggers = document.querySelectorAll('.nav-trigger');
export const submissionsForm = document.getElementById('submissions-form');
export const successMsg = document.getElementById('form-success-msg');
