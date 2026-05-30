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
import { 
  updateAudioStateForPage,
  setDroneVolume,
  setNoiseVolume,
  playPadChime
} from './audio.js';
import { renderUsesDetail } from './uses.js';

// Callback for updating active chapter to resolve circular dependency
let updateActiveChapterFn = null;
export function setUpdateActiveChapter(fn) {
  updateActiveChapterFn = fn;
}

// Article content data for secondary pieces
const articleData = {
  "steven-poem": {
    title: "[Poem Title Placeholder]",
    meta: "Original Poem &bull; Steven Misko",
    body: `
      <div style="text-align: center; padding: 2rem 1rem;">
        <pre style="display: inline-block; text-align: left; line-height: 2.2; font-size: 1.2rem; font-family: var(--font-story); font-style: italic; color: var(--color-text);">
[Line 1 Placeholder: Write your first line of the poem here]
[Line 2 Placeholder: Write your second line of the poem here]
[Line 3 Placeholder: Write your third line of the poem here]
[Line 4 Placeholder: Write your fourth line of the poem here]

[Stanza Break]
[Line 5 Placeholder: Continue your poem here]
[Line 6 Placeholder: Continue your poem here]
[Line 7 Placeholder: Continue your poem here]
[Line 8 Placeholder: Continue your poem here]
        </pre>
      </div>
    `
  },
  "liang-essay": {
    title: "[Critical Essay Title Placeholder]",
    meta: "Original Critical Essay &bull; Liang Zhang",
    body: `
      <p style="font-weight: bold; font-style: italic; margin-bottom: 1.5rem;">[Introduction Paragraph Outline]</p>
      <p>[Thesis & First Argument Placeholder]: Start your critical analysis here. Discuss how the theme of stories connects to your selected literary theory or structural constraints. Highlight the key quotes and citations you plan to analyze.</p>
      <p>[Second Argument Placeholder]: Build your analysis further. Discuss the implications of generative prose, semantic structures, or co-authorship in the texts you are evaluating.</p>
      <p>[Conclusion Outline Placeholder]: Summarize your key arguments and wrap up your literary analysis with a concluding thought that leaves an impression on your audience.</p>
    `
  },
  "farukh-satire": {
    title: "[Satirical Essay Title Placeholder]",
    meta: "Original Satirical Essay &bull; Farukh Baykhanov",
    body: `
      <p style="font-weight: bold; font-style: italic; margin-bottom: 1.5rem;">[Satirical Essay Hook Placeholder]</p>
      <p>[First Satirical Body Paragraph Placeholder]: Write your satirical narrative here. Use humor, irony, or exaggeration to critique digital bureaucracy, simulated intelligence, or automatic communication platforms.</p>
      <p>[Second Satirical Body Paragraph Placeholder]: Extend the satire. Introduce a comical scenario, dialogue, or a mock user manual explaining how automated systems behave under pressure.</p>
      <p>[Closing Satirical Punchline Placeholder]: Conclude the piece with a witty observation that reinforces the critique of technological homogeny.</p>
    `
  },
  "curated-aaryan": {
    title: "Curated: \"A Word is dead\"",
    meta: "Poem &bull; Emily Dickinson &bull; Curated by Aaryan Gada",
    body: `
      <div style="text-align: center; padding: 1rem 0; margin-bottom: 2rem;">
        <pre style="display: inline-block; text-align: left; line-height: 2; font-size: 1.15rem; font-family: var(--font-story); font-style: italic; color: var(--color-text);">
A word is dead
When it is said,
Some say.

I say it just
Begins to live
That day.
        </pre>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px;">
        <strong style="display: block; margin-bottom: 0.5rem; color: var(--color-primary);">Curator Connection:</strong>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6;">
          <strong>[Aaryan's Blurb Placeholder]</strong>: Replace this text with your explanation of how Emily Dickinson's "A Word is dead" connects to your magazine's theme. Why did you choose this piece?
        </p>
      </div>
    `
  },
  "curated-steven": {
    title: "Curated: \"The Library of Babel\"",
    meta: "Short Story &bull; Jorge Luis Borges &bull; Curated by Steven Misko",
    body: `
      <p style="font-style: italic; margin-bottom: 1.5rem; color: var(--color-text-muted);">
        "The universe (which others call the Library) is composed of an indefinite and perhaps infinite number of hexagonal galleries..."
      </p>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px;">
        <strong style="display: block; margin-bottom: 0.5rem; color: var(--color-accent-teal);">Curator Connection:</strong>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6;">
          <strong>[Steven's Blurb Placeholder]</strong>: Replace this text with your explanation of why you selected Jorge Luis Borges' classic story "The Library of Babel" and how its themes of infinite letters and permutation connect to your magazine's focus.
        </p>
      </div>
    `
  },
  "curated-liang": {
    title: "Curated: \"O Me! O Life!\"",
    meta: "Poem &bull; Walt Whitman &bull; Curated by Liang Zhang",
    body: `
      <div style="text-align: center; padding: 1rem 0; margin-bottom: 2rem;">
        <pre style="display: inline-block; text-align: left; line-height: 1.8; font-size: 1.1rem; font-family: var(--font-story); font-style: italic; color: var(--color-text);">
...O me! O life! of the questions of these recurring,
Of the endless trains of the faithless, of cities fill’d with the foolish...
What good amid these, O me, O life?

Answer.
That you are here—that life exists and identity,
That the powerful play goes on, and you may contribute a verse.
        </pre>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px;">
        <strong style="display: block; margin-bottom: 0.5rem; color: var(--color-accent-gold);">Curator Connection:</strong>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6;">
          <strong>[Liang's Blurb Placeholder]</strong>: Replace this text with your explanation of why you selected Walt Whitman's "O Me! O Life!" and how the concept of contributing a verse connects to the human voice in a machine age.
        </p>
      </div>
    `
  },
  "curated-farukh": {
    title: "Curated: \"The Road Not Taken\"",
    meta: "Poem &bull; Robert Frost &bull; Curated by Farukh Baykhanov",
    body: `
      <div style="text-align: center; padding: 1rem 0; margin-bottom: 2rem;">
        <pre style="display: inline-block; text-align: left; line-height: 1.8; font-size: 1.1rem; font-family: var(--font-story); font-style: italic; color: var(--color-text);">
Two roads diverged in a yellow wood,
And sorry I could not travel both...
I took the one less traveled by,
And that has made all the difference.
        </pre>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px;">
        <strong style="display: block; margin-bottom: 0.5rem; color: var(--color-accent-red);">Curator Connection:</strong>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6;">
          <strong>[Farukh's Blurb Placeholder]</strong>: Replace this text with your explanation of why you chose Robert Frost's "The Road Not Taken" and how decisions and choosing pathways relate to neural networks or human agency.
        </p>
      </div>
    `
  },
  "group-macbeth": {
    title: "The Narrative Web of Destiny: Prophecy and Autonomy in Macbeth",
    meta: "Group Literature Connection Essay &bull; Macbeth Analysis",
    body: `
      <p style="font-weight: bold; font-style: italic; margin-bottom: 1.5rem;">[Introduction Paragraph Outline]</p>
      <p>[Thesis Statement Placeholder]: Connect Shakespeare's Macbeth to your magazine's theme. How do the witches' prophecy and Macbeth's pre-computed path to the throne mirror automated systems, algorithms, or destiny in your theme?</p>
      <p>[Body Paragraph 1 - The Weird Sisters as Code]: Discuss the witches as a programmatic script of fate, which Macbeth compiles and executes through his ambition.</p>
      <p>[Body Paragraph 2 - Autonomy vs. Pre-determination]: Evaluate Macbeth's internal struggle. Does he possess free will, or is he simply following predictive text outputs generated by the witches' prophecy?</p>
      <p>[Conclusion Outline Placeholder]: Wrap up the group analysis. Relate Macbeth's tragic submission to prophecy back to modern human-algorithmic alignment.</p>
    `
  },
  "group-kafka": {
    title: "The Latent Fast: Artistry and Obsolescence in Kafka's A Hunger Artist",
    meta: "Group Literature Connection Essay &bull; Franz Kafka Analysis",
    body: `
      <p style="font-weight: bold; font-style: italic; margin-bottom: 1.5rem;">[Introduction Paragraph Outline]</p>
      <p>[Thesis Statement Placeholder]: Connect Franz Kafka's "A Hunger Artist" to your magazine's theme. How does the Hunger Artist's dedication to a fading, unappreciated art form mirror human artists in a world that values machine efficiency and automated novelty?</p>
      <p>[Body Paragraph 1 - Art as Performance and Spectacle]: Explore the relationship between the Hunger Artist and his crowd, comparing it to user interactions with automated text engines.</p>
      <p>[Body Paragraph 2 - The Cage of Obsolescence]: Discuss the artist's ultimate fasting to death in the cage, neglected by the public who are distracted by more immediate sensations (like the panther), symbolizing automated novelty replacing human crafts.</p>
      <p>[Conclusion Outline Placeholder]: Conclude with your group's perspective on maintaining human "artistic hunger" and authenticity in the digital age.</p>
    `
  }
};

const articleDataMap = new Map(Object.entries(articleData));

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

    if (targetPageId === 'uses') {
      const tabs = document.querySelectorAll('.uses-tab');
      tabs.forEach((t, i) => {
        if (i === 0) t.classList.add('active');
        else t.classList.remove('active');
      });
      renderUsesDetail(1);
    }

    // Update Browser Document Title
    if (targetPageId === 'home') {
      document.title = "Home | SYNAPSE";
    } else if (targetPageId === 'manifesto') {
      document.title = "Manifesto | SYNAPSE";
    } else if (targetPageId === 'agents') {
      document.title = "Agents | SYNAPSE";
    } else if (targetPageId === 'curated') {
      document.title = "Curated | SYNAPSE";
    } else if (targetPageId === 'sandbox') {
      document.title = "Cortex Labs | SYNAPSE";
    } else if (targetPageId === 'quiz') {
      document.title = "Humanity Alignment Quiz | SYNAPSE";
    } else if (targetPageId === 'scribe') {
      document.title = "CortexScribe Word Solver | SYNAPSE";
    } else if (targetPageId === 'encrypt') {
      document.title = "Mnemosyne Memory Encrypter | SYNAPSE";
    } else if (targetPageId === 'decrypt') {
      document.title = "Mnemosyne Memory Decrypter | SYNAPSE";
    } else if (targetPageId === 'soundboard') {
      document.title = "Acoustic Synapses Soundboard | SYNAPSE";
    } else if (targetPageId === 'uses') {
      document.title = "Top 10 Uses of AI | SYNAPSE";
    } else if (targetPageId === 'satire') {
      document.title = "A Modest Proposal | SYNAPSE";
    } else if (targetPageId === 'featured') {
      document.title = "Featured Issue | SYNAPSE";
    } else if (targetPageId === 'article') {
      document.title = "An Accelerated History of AI | SYNAPSE";
    }

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
      } else if (targetPageId === 'manifesto') {
        state.canvasState = 'tension';
        updateAudioStateForPage('manifesto');
      } else if (targetPageId === 'agents') {
        state.canvasState = 'vortex';
        updateAudioStateForPage('agents');
      } else if (targetPageId === 'satire') {
        state.canvasState = 'vortex';
        updateAudioStateForPage('satire');
      } else if (targetPageId === 'curated') {
        state.canvasState = 'pulses';
        updateAudioStateForPage('curated');
      } else if (['sandbox', 'quiz', 'scribe', 'encrypt', 'decrypt', 'soundboard', 'uses'].includes(targetPageId)) {
        state.canvasState = 'pulses';
        updateAudioStateForPage(targetPageId);
      } else if (targetPageId === 'featured') {
        state.canvasState = 'vortex';
        updateAudioStateForPage('featured');
      }
    } else {
      // Force active chapter update to bypass early returns and start audio hum immediately
      const currentChapter = state.activeChapter;
      state.activeChapter = -1;
      if (updateActiveChapterFn) {
        updateActiveChapterFn(currentChapter);
      }
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
  const data = articleDataMap.get(articleId);
  if (!data) return;

  drawerTitle.textContent = data.title;
  drawerMeta.textContent = data.meta;
  drawerBody.innerHTML = data.body;

  readingDrawer.classList.add('open');
  readingDrawer.setAttribute('aria-hidden', 'false');
  readingDrawer.focus();

  // Update browser tab title to show active piece name
  document.title = `${data.title} | SYNAPSE`;
}

function closeDrawer() {
  readingDrawer.classList.remove('open');
  readingDrawer.setAttribute('aria-hidden', 'true');

  // Revert back to the active page title
  if (state.activePage === 'featured') {
    document.title = "Featured Issue | SYNAPSE";
  } else if (state.activePage === 'home') {
    document.title = "Home | SYNAPSE";
  } else if (state.activePage === 'manifesto') {
    document.title = "Manifesto | SYNAPSE";
  } else if (state.activePage === 'agents') {
    document.title = "Agents | SYNAPSE";
  } else if (state.activePage === 'satire') {
    document.title = "A Modest Proposal | SYNAPSE";
  } else if (state.activePage === 'curated') {
    document.title = "Curated | SYNAPSE";
  } else if (state.activePage === 'sandbox') {
    document.title = "Cortex Labs | SYNAPSE";
  } else if (state.activePage === 'quiz') {
    document.title = "Humanity Alignment Quiz | SYNAPSE";
  } else if (state.activePage === 'scribe') {
    document.title = "CortexScribe Word Solver | SYNAPSE";
  } else if (state.activePage === 'encrypt') {
    document.title = "Mnemosyne Memory Encrypter | SYNAPSE";
  } else if (state.activePage === 'decrypt') {
    document.title = "Mnemosyne Memory Decrypter | SYNAPSE";
  } else if (state.activePage === 'soundboard') {
    document.title = "Acoustic Synapses Soundboard | SYNAPSE";
  } else if (state.activePage === 'uses') {
    document.title = "Top 10 Uses of AI | SYNAPSE";
  } else if (state.activePage === 'article') {
    document.title = "An Accelerated History of AI | SYNAPSE";
  } else {
    document.title = "SYNAPSE";
  }
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

  // Humanity Alignment Quiz Logic
  const quizOpts = document.querySelectorAll('.quiz-opt');
  const quizResetBtn = document.getElementById('quiz-reset-btn');
  let quizScore = 0;
  let currentQuestionIndex = 1;

  if (quizOpts.length > 0) {
    quizOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const score = parseInt(opt.getAttribute('data-score') || '1', 10);
        quizScore += score;

        // Hide current question
        const currentQEl = document.getElementById(`q${currentQuestionIndex}`);
        if (currentQEl) {
          currentQEl.style.display = 'none';
        }

        currentQuestionIndex++;

        // Show next question or results
        const nextQEl = document.getElementById(`q${currentQuestionIndex}`);
        if (nextQEl) {
          nextQEl.style.display = 'block';
        } else {
          // No more questions, show results
          const quizResult = document.getElementById('quiz-result');
          const quizResultText = document.getElementById('quiz-result-text');
          
          if (quizResult && quizResultText) {
            const pct = Math.round(((quizScore - 3) / 12) * 100);
            quizResultText.textContent = ''; // clear previous content

            const titleEl = document.createElement('strong');
            let description = '';
            if (pct <= 30) {
              titleEl.textContent = 'Organic Consciousness:';
              description = ` Your thoughts remain firmly grounded in biological intuition and creative friction. Your alignment is strongly human (${100 - pct}% human, ${pct}% machine).`;
            } else if (pct >= 70) {
              titleEl.textContent = 'Pre-computed Cognition:';
              description = ` Your responses exhibit high similarity to predictive model weights. Your alignment is strongly machine-aligned (${pct}% machine, ${100 - pct}% human).`;
            } else {
              titleEl.textContent = 'Hybrid Cognitive Node:';
              description = ` You balance the spontaneous emotional spark of humanity with the structured geometry of latent spaces (${100 - pct}% human, ${pct}% machine).`;
            }
            
            quizResultText.appendChild(titleEl);
            quizResultText.appendChild(document.createTextNode(description));
            quizResult.style.display = 'block';
          }
        }
      });
    });
  }

  if (quizResetBtn) {
    quizResetBtn.addEventListener('click', () => {
      quizScore = 0;
      currentQuestionIndex = 1;

      const quizResult = document.getElementById('quiz-result');
      if (quizResult) quizResult.style.display = 'none';

      document.querySelectorAll('.quiz-question').forEach((q, idx) => {
        q.style.display = idx === 0 ? 'block' : 'none';
      });
    });
  }

  // CortexScribe Typist AI Buzzword Scanner
  const scribeInput = document.getElementById('scribe-input');
  const scribeScore = document.getElementById('scribe-score');
  const scribeProgress = document.getElementById('scribe-progress');
  const scribeStatus = document.getElementById('scribe-status');
  const scribeBadgeIndicator = document.getElementById('scribe-badge-indicator');
  const scribeFlagged = document.getElementById('scribe-flagged');
  const scribeWordList = document.getElementById('scribe-word-list');

  const aiBuzzwords = [
    'delve', 'testament', 'tapestry', 'realm', 'beacon', 
    'catalyst', 'pivotal', 'leverage', 'robust', 'synergy', 
    'paradigm', 'furthermore', 'in conclusion', 'demystify'
  ];

  if (scribeInput) {
    scribeInput.addEventListener('keydown', () => {
      import('./audio.js').then(module => {
        module.playKeypressSound();
      });
    });

    scribeInput.addEventListener('input', () => {
      const text = scribeInput.value.toLowerCase();
      const detected = [];
      const wordCounts = {};

      aiBuzzwords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = text.match(regex);
        if (matches) {
          detected.push(word);
          wordCounts[word] = matches.length;
        }
      });

      let penalty = 0;
      detected.forEach(word => {
        penalty += 15 + (wordCounts[word] - 1) * 5;
      });

      const score = Math.max(0, 100 - penalty);
      if (scribeScore) scribeScore.textContent = `${score}%`;
      if (scribeProgress) scribeProgress.style.width = `${score}%`;

      if (scribeStatus && scribeBadgeIndicator && scribeProgress) {
        if (score === 100) {
          scribeStatus.textContent = 'Purely Organic Writing';
          scribeProgress.style.backgroundColor = 'var(--color-primary)';
          scribeBadgeIndicator.style.backgroundColor = 'var(--color-primary)';
          scribeBadgeIndicator.style.boxShadow = '0 0 8px var(--color-primary)';
        } else if (score >= 60) {
          scribeStatus.textContent = 'Slightly Synthesized';
          scribeProgress.style.backgroundColor = 'var(--color-accent-teal)';
          scribeBadgeIndicator.style.backgroundColor = 'var(--color-accent-teal)';
          scribeBadgeIndicator.style.boxShadow = '0 0 8px var(--color-accent-teal)';
        } else if (score >= 30) {
          scribeStatus.textContent = 'High Machine Probability';
          scribeProgress.style.backgroundColor = 'var(--color-accent-gold)';
          scribeBadgeIndicator.style.backgroundColor = 'var(--color-accent-gold)';
          scribeBadgeIndicator.style.boxShadow = '0 0 8px var(--color-accent-gold)';
        } else {
          scribeStatus.textContent = 'Warning: Pure Autocomplete';
          scribeProgress.style.backgroundColor = 'var(--color-accent-red)';
          scribeBadgeIndicator.style.backgroundColor = 'var(--color-accent-red)';
          scribeBadgeIndicator.style.boxShadow = '0 0 8px var(--color-accent-red)';
        }
      }

      if (scribeFlagged && scribeWordList) {
        if (detected.length > 0) {
          scribeFlagged.style.display = 'block';
          scribeWordList.innerHTML = '';
          detected.forEach(word => {
            const badge = document.createElement('span');
            badge.style.background = 'rgba(255,255,255,0.05)';
            badge.style.border = '1px solid rgba(255,255,255,0.1)';
            badge.style.padding = '0.2rem 0.5rem';
            badge.style.borderRadius = '8px';
            badge.style.fontSize = '0.7rem';
            badge.style.color = 'var(--color-accent-red)';
            badge.style.fontWeight = 'bold';
            badge.textContent = `${word} (x${wordCounts[word]})`;
            scribeWordList.appendChild(badge);
          });
        } else {
          scribeFlagged.style.display = 'none';
        }
      }
    });
  }

  // Mnemosyne Memory Encrypter
  const encryptInput = document.getElementById('encrypt-input');
  const encryptOutputPane = document.getElementById('encrypt-output-pane');
  const encryptOutputText = document.getElementById('encrypt-output-text');
  const btnEncryptAction = document.getElementById('btn-encrypt-action');

  let encInterval = null;

  if (encryptInput) {
    encryptInput.addEventListener('keydown', () => {
      import('./audio.js').then(module => {
        module.playKeypressSound();
      });
    });
  }

  if (btnEncryptAction && encryptInput && encryptOutputPane && encryptOutputText) {
    btnEncryptAction.addEventListener('click', () => {
      const text = encryptInput.value.trim();
      if (!text) {
        alert('Please enter a memory to encrypt first!');
        return;
      }

      encryptOutputPane.style.display = 'block';
      btnEncryptAction.disabled = true;

      import('./audio.js').then(module => { module.playClickSound(); });

      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$*&%?[]{}';
      let ticks = 0;
      
      if (encInterval) clearInterval(encInterval);

      encInterval = setInterval(() => {
        let scrambled = '';
        for (let i = 0; i < Math.min(text.length, 60); i++) {
          if (text[i] === ' ') scrambled += ' ';
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        encryptOutputText.textContent = scrambled + '...';
        ticks++;

        if (ticks >= 15) {
          clearInterval(encInterval);
          const base64 = btoa(unescape(encodeURIComponent(text)));
          encryptOutputText.textContent = `KEY::${base64}`;
          btnEncryptAction.disabled = false;
        }
      }, 60);
    });
  }

  // Mnemosyne Memory Decrypter
  const decryptInput = document.getElementById('decrypt-input');
  const decryptOutputPane = document.getElementById('decrypt-output-pane');
  const decryptOutputText = document.getElementById('decrypt-output-text');
  const btnDecryptAction = document.getElementById('btn-decrypt-action');

  let decInterval = null;

  if (decryptInput) {
    decryptInput.addEventListener('keydown', () => {
      import('./audio.js').then(module => {
        module.playKeypressSound();
      });
    });
  }

  if (btnDecryptAction && decryptInput && decryptOutputPane && decryptOutputText) {
    btnDecryptAction.addEventListener('click', () => {
      const text = decryptInput.value.trim();
      if (!text) {
        alert('Please paste an encrypted key to decrypt first!');
        return;
      }

      let hash = text;
      if (text.startsWith('KEY::')) {
        hash = text.substring(5);
      }

      decryptOutputPane.style.display = 'block';
      btnDecryptAction.disabled = true;

      import('./audio.js').then(module => { module.playClickSound(); });

      let decrypted = '';
      try {
        decrypted = decodeURIComponent(escape(atob(hash)));
      } catch (err) {
        decrypted = 'INVALID HASH: Check your encryption key format.';
      }

      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$*&%?[]{}';
      let ticks = 0;

      if (decInterval) clearInterval(decInterval);

      decInterval = setInterval(() => {
        let scrambled = '';
        for (let i = 0; i < Math.min(decrypted.length, 60); i++) {
          if (decrypted[i] === ' ') scrambled += ' ';
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        decryptOutputText.textContent = scrambled + '...';
        ticks++;

        if (ticks >= 12) {
          clearInterval(decInterval);
          if (decrypted.startsWith('INVALID HASH')) {
            decryptOutputText.textContent = decrypted;
            decryptOutputText.style.color = 'var(--color-accent-red)';
          } else {
            decryptOutputText.textContent = `"${decrypted}"`;
            decryptOutputText.style.color = '#38bdf8';
          }
          btnDecryptAction.disabled = false;
        }
      }, 50);
    });
  }

  // Acoustic Synapses Soundboard Mixer Sliders & Chime Pads
  const sliderDrone = document.getElementById('slider-drone');
  const sliderNoise = document.getElementById('slider-noise');
  const labelDroneVal = document.getElementById('label-drone-val');
  const labelNoiseVal = document.getElementById('label-noise-val');
  const audioPads = document.querySelectorAll('.audio-pad');

  if (sliderDrone && labelDroneVal) {
    sliderDrone.addEventListener('input', () => {
      const val = parseInt(sliderDrone.value, 10);
      labelDroneVal.textContent = `${val}%`;
      setDroneVolume(val);
    });
  }

  if (sliderNoise && labelNoiseVal) {
    sliderNoise.addEventListener('input', () => {
      const val = parseInt(sliderNoise.value, 10);
      labelNoiseVal.textContent = `${val}%`;
      setNoiseVolume(val);
    });
  }

  if (audioPads.length > 0) {
    audioPads.forEach(pad => {
      pad.addEventListener('click', () => {
        const padIdx = parseInt(pad.getAttribute('data-pad') || '0', 10);
        playPadChime(padIdx);

        // Flash visual pad keypress effect
        pad.style.transform = 'scale(0.95)';
        pad.style.background = 'rgba(255, 255, 255, 0.2)';
        pad.style.boxShadow = '0 0 15px var(--pad-color)';
        
        setTimeout(() => {
          pad.style.transform = 'none';
          pad.style.background = '';
          pad.style.boxShadow = '';
        }, 150);
      });
    });
  }

  // Uses of AI Interactive Tabs Logic
  const usesTabs = document.querySelectorAll('.uses-tab');
  if (usesTabs.length > 0) {
    usesTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        usesTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const idx = parseInt(tab.getAttribute('data-index') || '1', 10);
        renderUsesDetail(idx);
      });
    });
  }

  // Popstate event handler for browser Back/Forward navigation
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.pageId) {
      navigateToPage(e.state.pageId, false);
    } else {
      // Reconstruct page state if history state is empty (e.g. initial landing page)
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      let pageId = 'home';
      if (path === 'manifesto') pageId = 'manifesto';
      else if (path === 'agents') pageId = 'agents';
      else if (path === 'curated') pageId = 'curated';
      else if (path === 'sandbox') pageId = 'sandbox';
      else if (path === 'quiz') pageId = 'quiz';
      else if (path === 'scribe') pageId = 'scribe';
      else if (path === 'encrypt') pageId = 'encrypt';
      else if (path === 'decrypt') pageId = 'decrypt';
      else if (path === 'soundboard') pageId = 'soundboard';
      else if (path === 'uses') pageId = 'uses';
      else if (path === 'satire') pageId = 'satire';
      else if (path === 'featured') pageId = 'featured';
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
  
  if (path === 'manifesto') {
    targetPageId = 'manifesto';
  } else if (path === 'agents') {
    targetPageId = 'agents';
  } else if (path === 'curated') {
    targetPageId = 'curated';
  } else if (path === 'sandbox') {
    targetPageId = 'sandbox';
  } else if (path === 'quiz') {
    targetPageId = 'quiz';
  } else if (path === 'scribe') {
    targetPageId = 'scribe';
  } else if (path === 'encrypt') {
    targetPageId = 'encrypt';
  } else if (path === 'decrypt') {
    targetPageId = 'decrypt';
  } else if (path === 'soundboard') {
    targetPageId = 'soundboard';
  } else if (path === 'uses') {
    targetPageId = 'uses';
  } else if (path === 'satire') {
    targetPageId = 'satire';
  } else if (path === 'featured') {
    targetPageId = 'featured';
  } else if (path === 'article') {
    targetPageId = 'article';
  }
  
  // Initialize current history page context
  history.replaceState({ pageId: targetPageId }, '', window.location.pathname);
  
  // Render active page view
  navigateToPage(targetPageId, false);
}
