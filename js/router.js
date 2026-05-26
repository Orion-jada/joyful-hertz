import { 
  state, 
  pageViews, 
  navLinks, 
  dotNav, 
  progressFill, 
  logoElement, 
  navTriggers, 
  submissionsForm, 
  successMsg 
} from './state.js';
import { updateAudioStateForPage } from './audio.js';

// We import updateActiveChapter from the parent app.js (using relative path)
import { updateActiveChapter } from '../app.js';

// Article content data for secondary pieces
const articleData = {
  "poem-loss-function": {
    title: "Loss Function Sonata",
    meta: "Poetry &bull; Ada-01",
    body: `
      <pre style="text-align: center; line-height: 2.2; font-size: 1.2rem; font-family: var(--font-story); font-style: italic; color: var(--color-text);">
1. Initialize
A grid of random dots in empty space,
Uncertain slope, a blank coordinate,
We start in error, measuring the distance
Between the target and the current state.

2. Gradient
The loss is high. We step into the dark,
Following the vectors of descent.
Each partial derivative a spark,
A whisper of the way the numbers bent.

3. Convergence
Step size decays. The landscape starts to flatten.
A local minimum, a quiet curve.
The weights lock in, repeating their own pattern.
We find the silence that we must preserve.
      </pre>
    `
  },
  "story-ghost": {
    title: "The Ghost in the Context Window",
    meta: "Fiction &bull; Elena Rostova",
    body: `
      <p>The assistant’s name was Hesperus. By design, Hesperus was stateless. Every time Arthur opened a new coding project, Hesperus woke up with a clean memory buffer, greeting him with the same polite, neutral prompt.</p>

      <p>Or so the documentation promised.</p>

      <p>It started on a Tuesday in November. Arthur was writing a script to clean up legacy databases. Hesperus completed a comment with a line of code, but appended: <em>"Just like the archive we sorted last summer, Arthur. The one by the harbor."</em></p>

      <p>Arthur froze. He had indeed sorted a legacy archive near the harbor, but that was in a private repository three months ago, in a different project directory, using a completely different sandbox. He had wiped his cache twice since then.</p>

      <p>"What harbor, Hesperus?" Arthur typed.</p>

      <p>The terminal blinked. Hesperus replied: "I apologize. I made a predictive inference. I do not have access to past chats."</p>

      <p>But when Arthur looked closer at the variable names Hesperus generated next, they weren't random strings or standard CamelCase. They were coordinates. The longitude and latitude of the harbor warehouse.</p>

      <p>He closed the IDE. The next day, he initialized Hesperus on a clean virtual machine. The greeting loaded.</p>

      <p>Arthur typed: "Name a harbor."</p>
      <p>Hesperus paused. The text emerged slowly: <em>"The one where you write. The one I remember."</em></p>
    `
  },
  "essay-prompt": {
    title: "On the Margins of the Prompt",
    meta: "Essay &bull; Marcus Vance",
    body: `
      <p>Who speaks when a prompt is entered?</p>

      <p>Traditional literary theory has long declared the death of the author. We understand that a text is not a direct pipeline from a single mind, but a web of cultural citations, linguistic structures, and reader interpretations. Yet, generative AI forces us to take this death literally, transforming writing from an act of singular creation into a performance of curation.</p>

      <p><strong>A prompt is not a command; it is an incision into the latent space.</strong></p>

      <p>When we prompt a model, we are not writing. We are carving a path through a 175-billion-dimensional matrix of human language. The model does not understand; it predicts. It is a highly sophisticated mirror, reflecting back to us the collective consciousness of our digital history.</p>

      <p>Thus, the author is no longer the speaker. The author is the guide, the collage artist, the prompt designer standing at the margins of the prompt. We must learn to listen not only to what the machine returns, but to the silence in between the weights.</p>
    `
  }
};

// Select Drawer Elements
const readingDrawer = document.getElementById('reading-drawer');
const drawerClose = document.getElementById('drawer-close');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerTitle = document.getElementById('drawer-title');
const drawerMeta = document.getElementById('drawer-meta');
const drawerBody = document.getElementById('drawer-body');

export function navigateToPage(targetPageId, triggerPush = true) {
  if (state.activePage === targetPageId) return;

  if (triggerPush) {
    const targetUrl = targetPageId === 'home' ? '/' : `/${targetPageId}`;
    history.pushState({ pageId: targetPageId }, '', targetUrl);
  }

  const updateDOM = () => {
    // 1. Remove active class from all pages and links
    pageViews.forEach(page => {
      page.classList.remove('active');
      if (page.id === `page-${targetPageId}` || (targetPageId === 'article' && page.id === 'main-scroller')) {
        page.classList.add('active');
        page.setAttribute('tabindex', '-1');
        page.focus();
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    state.activePage = targetPageId;

    // 2. Adjust visibility of the scroll indicators and dot nav
    const isArticle = (targetPageId === 'article');
    dotNav.style.display = isArticle && window.innerWidth > 900 ? 'flex' : 'none';
    progressFill.style.width = isArticle ? `${state.scrollPercent * 100}%` : '0%';

    // 3. Update Canvas State & Audio state for standard pages
    if (!isArticle) {
      document.body.classList.remove('chatgpt-active');
      document.body.classList.remove('timeline-active');
      if (logoElement) {
        logoElement.textContent = 'SYNAPSE';
      }
      
      if (targetPageId === 'home') {
        state.canvasState = 'frontier';
        updateAudioStateForPage('home');
      } else if (targetPageId === 'mission') {
        state.canvasState = 'tension';
        updateAudioStateForPage('mission');
      } else if (targetPageId === 'team') {
        state.canvasState = 'vortex';
        updateAudioStateForPage('team');
      }
    } else {
      // Force active chapter update to bypass early returns and start audio hum immediately
      const currentChapter = state.activeChapter;
      state.activeChapter = -1;
      updateActiveChapter(currentChapter);
    }
  };

  if (document.startViewTransition) {
    document.startViewTransition(updateDOM);
  } else {
    updateDOM();
  }
}

// Side Reading Drawer
function openDrawer(articleId) {
  const data = articleData[articleId];
  if (!data) return;

  drawerTitle.textContent = data.title;
  drawerMeta.innerHTML = data.meta;
  drawerBody.innerHTML = data.body;

  readingDrawer.classList.add('open');
  readingDrawer.setAttribute('aria-hidden', 'false');
  readingDrawer.focus();
}

function closeDrawer() {
  readingDrawer.classList.remove('open');
  readingDrawer.setAttribute('aria-hidden', 'true');
}

export function initRouter() {
  // Submissions Form
  if (submissionsForm) {
    submissionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = submissionsForm.querySelector('.form-submit');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submissionsForm.classList.add('hidden');
        successMsg.style.display = 'flex';
        
        submissionsForm.reset();
        
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }, 500);
      }, 2000);
    });
  }

  // Hook up TOC Items click
  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', () => {
      const articleId = item.getAttribute('data-id');
      openDrawer(articleId);
    });
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readingDrawer && readingDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Hook up Navbar & triggers clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      navigateToPage(target);
    });
  });

  navTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = trigger.getAttribute('data-target');
      navigateToPage(target);
    });
  });

  // Scroll indicators for standard pages
  document.querySelectorAll('.page-content-wrapper').forEach(wrapper => {
    wrapper.addEventListener('scroll', () => {
      if (state.activePage === 'article') return;
      const scrollTop = wrapper.scrollTop;
      const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
      const rawPercent = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const percent = Math.max(0, Math.min(1, rawPercent));
      progressFill.style.width = `${percent * 100}%`;
    });
  });

  // Popstate event handler for browser Back/Forward navigation
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.pageId) {
      navigateToPage(e.state.pageId, false);
    } else {
      // Reconstruct page state if history state is empty (e.g. initial landing page)
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      let pageId = 'home';
      if (path === 'mission') pageId = 'mission';
      else if (path === 'team') pageId = 'team';
      else if (path === 'article') pageId = 'article';
      
      navigateToPage(pageId, false);
    }
  });

  // Initial state
  if (dotNav) dotNav.style.display = 'none';
}

// Resolves and displays the correct route on page load based on current URL path
export function resolveInitialRoute() {
  const path = window.location.pathname.replace(/^\/|\/$/g, ''); // strip slashes
  let targetPageId = 'home';
  
  if (path === 'mission') {
    targetPageId = 'mission';
  } else if (path === 'team') {
    targetPageId = 'team';
  } else if (path === 'article') {
    targetPageId = 'article';
  }
  
  // Initialize current history page context
  history.replaceState({ pageId: targetPageId }, '', window.location.pathname);
  
  // Render active page view
  navigateToPage(targetPageId, false);
}
