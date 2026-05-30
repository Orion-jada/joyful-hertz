/**
 * js/uses.js
 * Interactive guide logic for the Top 10 Ways to Use AI page.
 */

// Central store of simulated data and templates
const USES_DATA = {
  1: {
    title: "1. Overcoming Writer's Block",
    intro: "Calibrate models to generate creative seeds and prose ideas. Avoid generic prompt setups by providing specific aesthetic and structural boundaries.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">SELECT A GENRE / AESTHETIC:</label>
        <select id="uses-1-genre" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="cyberpunk">Sci-Fi Cyberpunk (Neon-drenched, high-tech, low-life)</option>
          <option value="gothic">Gothic Surrealism (Dark decay, psychological architecture)</option>
          <option value="minimalist">Minimalist Realism (Quiet domesticity, unspoken friction)</option>
        </select>
        <button id="uses-1-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem;">Generate Prompt Spark</button>
        <div id="uses-1-output" class="crypt-matrix-pane" style="display: none; background: rgba(0,0,0,0.4); border: 1px solid rgba(13,242,201,0.2); padding: 1.2rem; border-radius: 12px; font-family: var(--font-story); font-style: italic; min-height: 80px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); line-height: 1.6; color: #fff;">
          Generating prompt seed...
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-1-btn');
      const output = container.querySelector('#uses-1-output');
      const genreSelect = container.querySelector('#uses-1-genre');
      
      const prompts = {
        cyberpunk: "Write about a data-courier who discovers that the memory logs they are transporting contain the digital ghost of their childhood friend, but the storage medium is slowly decaying with every read access.",
        gothic: "A clockmaker in a flooded city is hired to repair a giant grandfather clock situated inside a church that has been submerged under black ink, only to find the gears are made of petrified human bone.",
        minimalist: "Two estranged siblings spend an afternoon sitting on plastic chairs in a half-empty storage unit, sorting through cardboard boxes containing their father's obsolete collection of audio tapes."
      };

      btn.addEventListener('click', () => {
        const val = genreSelect.value;
        const text = prompts[val] || prompts.cyberpunk;
        output.style.display = 'block';
        output.textContent = '';
        output.style.color = 'var(--color-accent-teal)';
        
        // Typewriter effect
        let idx = 0;
        btn.disabled = true;
        const interval = setInterval(() => {
          output.textContent += text[idx];
          idx++;
          if (idx >= text.length) {
            clearInterval(interval);
            btn.disabled = false;
            output.style.color = '#fff';
          }
        }, 15);
      });
    }
  },
  2: {
    title: "2. Help with Writing or Debugging Code",
    intro: "Provide context when resolving errors. Show the model the compiler trace, relevant dependencies, and highlight code sections to perform targeted diff refactors.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">SELECT A COMPILING EXCEPTION:</label>
        <select id="uses-2-bug" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="async">Async/Await: Unhandled Promise Rejection</option>
          <option value="flex">CSS: Flexbox Child Overflows Parent</option>
          <option value="react">React: Infinite useEffect Render Cycle</option>
        </select>
        <button id="uses-2-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-primary); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);">Run Code Debugger</button>
        
        <div id="uses-2-output" style="display: none; display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="glass-panel" style="padding: 1rem; border-color: rgba(244, 63, 94, 0.2); background: rgba(244, 63, 94, 0.02); font-family: monospace; font-size: 0.8rem; overflow-x: auto; white-space: pre;">
<span style="color: #f43f5e; font-weight: bold;">[BROKEN CODE]</span>
<div id="uses-2-broken" style="color: rgba(255,255,255,0.7); margin-top: 0.5rem;"></div>
            </div>
            <div class="glass-panel" style="padding: 1rem; border-color: rgba(34, 197, 94, 0.2); background: rgba(34, 197, 94, 0.02); font-family: monospace; font-size: 0.8rem; overflow-x: auto; white-space: pre;">
<span style="color: #22c55e; font-weight: bold;">[FIXED CODE]</span>
<div id="uses-2-fixed" style="color: rgba(255,255,255,0.9); margin-top: 0.5rem;"></div>
            </div>
          </div>
          <div id="uses-2-desc" class="glass-panel" style="padding: 1rem; background: rgba(0,0,0,0.2); font-size: 0.85rem; line-height: 1.5; color: var(--color-text-muted);"></div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-2-btn');
      const output = container.querySelector('#uses-2-output');
      const brokenBox = container.querySelector('#uses-2-broken');
      const fixedBox = container.querySelector('#uses-2-fixed');
      const descBox = container.querySelector('#uses-2-desc');
      const bugSelect = container.querySelector('#uses-2-bug');

      const bugData = {
        async: {
          broken: `async function fetchData() {\n  // Missing error boundary\n  let res = await fetch('/api/data');\n  let data = await res.json();\n  return data;\n}`,
          fixed: `async function fetchData() {\n  try {\n    let res = await fetch('/api/data');\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    return await res.json();\n  } catch (error) {\n    console.error('Fetch failed:', error);\n    return null;\n  }\n}`,
          desc: "<strong>AI Debugger Note:</strong> Unwrapped fetch calls throw exceptions if the network fails or the server returns an invalid JSON format. An explicit try/catch block isolates the call stack, preventing unhandled promise rejections."
        },
        flex: {
          broken: `.parent {\n  display: flex;\n}\n.child {\n  width: 500px;\n  /* Overflows on small devices */\n}`,
          fixed: `.parent {\n  display: flex;\n  flex-wrap: wrap; /* Wraps items */\n}\n.child {\n  width: 100%;\n  max-width: 500px; /* Safe bounds */\n  flex-shrink: 1; /* Shrinks if needed */\n}`,
          desc: "<strong>AI Debugger Note:</strong> Flex containers default to no-wrap, forcing children to stay on a single line. Adding flex-wrap and replacing rigid widths with max-width values forces items to adjust layout fluidly."
        },
        react: {
          broken: `useEffect(() => {\n  const data = fetchStats();\n  setStats(data);\n  // Missing dependency array causes loop\n});`,
          fixed: `useEffect(() => {\n  fetchStats().then(data => setStats(data));\n}, []); // Empty array runs once on mount`,
          desc: "<strong>AI Debugger Note:</strong> Omitting the dependency array causes the hook to execute on every component re-render. Since setStats triggers a state change and re-render, it creates an infinite feedback loop. Adding [] stabilizes it."
        }
      };

      btn.addEventListener('click', () => {
        const key = bugSelect.value;
        const data = bugData[key];
        
        output.style.display = 'none';
        
        // Brief loading state
        btn.textContent = "Analyzing Call Stack...";
        btn.disabled = true;
        
        setTimeout(() => {
          brokenBox.textContent = data.broken;
          fixedBox.textContent = data.fixed;
          descBox.innerHTML = data.desc;
          
          output.style.display = 'flex';
          btn.textContent = "Run Code Debugger";
          btn.disabled = false;
        }, 600);
      });
    }
  },
  3: {
    title: "3. Explaining Complex Topics Simply",
    intro: "Leverage metaphors to clarify theoretical structures. Instruct the model to build a progressive analogy, moving from simple physical objects to mathematical realities.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">CHOOSE A RESEARCH DOMAIN:</label>
        <select id="uses-3-topic" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="quantum">Quantum Superposition (Physics)</option>
          <option value="vector">Vector Embeddings (Machine Learning)</option>
          <option value="blockchain">Cryptographic Hash Trees (Distributed Systems)</option>
        </select>
        <button id="uses-3-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Explain Like I'm 5</button>
        
        <div id="uses-3-output" class="glass-panel" style="display: none; padding: 1.5rem; border-color: rgba(13,242,201,0.2); background: rgba(13,242,201,0.01); line-height: 1.6;">
          <h4 id="uses-3-title" style="color: var(--color-accent-teal); font-weight: 700; margin-bottom: 0.6rem; font-size: 1rem; text-transform: uppercase;"></h4>
          <p id="uses-3-text" style="color: #fff; font-size: 0.92rem;"></p>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-3-btn');
      const output = container.querySelector('#uses-3-output');
      const title = container.querySelector('#uses-3-title');
      const text = container.querySelector('#uses-3-text');
      const topicSelect = container.querySelector('#uses-3-topic');

      const explanations = {
        quantum: {
          title: "Spinning Coin Analogy",
          text: "Imagine you place a coin on a desk. It is either showing Heads or Tails. But if you spin the coin, it is rotating so fast you cannot see which side it is. While it is spinning, it is a mixture of both Heads and Tails at the exact same time. This spinning state is like quantum superposition—the coin only becomes a solid 'Heads' or 'Tails' once you slap your hand down to stop it (which is what physicists call making a measurement)."
        },
        vector: {
          title: "The Giant Library Grid",
          text: "Imagine you are organizing a giant warehouse of products, but instead of sorting them by name, you place similar things close to each other. Apples go near oranges, which go near peaches. Hammers go near screws and nails. We can describe the exact spot of any item using a map coordinates numbers (like longitude and latitude). Vector embeddings are just map coordinates for thoughts or words, allowing a computer to calculate how close two concepts are by measuring the physical distance between their points."
        },
        blockchain: {
          title: "The Interlinked Wax Seals",
          text: "Imagine you write a page of a diary, fold it, and seal it with a unique wax stamp. On the next page, you write a new entry, but before folding it, you press the previous wax seal into the paper itself, and then add a new seal on top. If someone tries to tear out or change a page in the middle of your diary, the seals on all the following pages will crack and break instantly. This makes it impossible to tamper with past logs without the entire diary showing visual proof of alteration."
        }
      };

      btn.addEventListener('click', () => {
        const val = topicSelect.value;
        const data = explanations[val];
        
        output.style.display = 'block';
        title.textContent = data.title;
        text.textContent = data.text;
      });
    }
  },
  4: {
    title: "4. Refactoring and Polishing Prose",
    intro: "Refine sentences for distinct communication objectives. Adjust settings to output professional, urgent, or collaborative tones while keeping the original context.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">RAW PROSE INPUT:</label>
        <textarea id="uses-4-input" class="form-input text-area" style="height: 90px; width: 100%; resize: none; font-size: 0.9rem;" placeholder="Type a blunt or unpolished email draft...">Hey, I need that report by tomorrow morning. I'm waiting for it. Make it quick.</textarea>
        
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">CALIBRATE TONE:</label>
          <select id="uses-4-tone" class="form-input" style="cursor: pointer; padding: 0.5rem 1rem; font-size: 0.85rem;">
            <option value="polite">Polite & Professional</option>
            <option value="urgent">Assertive & Urgent</option>
            <option value="warm">Warm & Collaborative</option>
          </select>
          <button id="uses-4-btn" class="form-submit" style="padding: 0.8rem 1.8rem; background-color: var(--color-accent-gold); color: #000; font-weight: 700; border-radius: 40px;">Refactor Email</button>
        </div>
        
        <div id="uses-4-output" class="crypt-matrix-pane" style="display: none; background: rgba(0,0,0,0.4); border: 1px solid rgba(251,191,36,0.2); padding: 1.2rem; border-radius: 12px; font-family: monospace; font-size: 0.85rem; min-height: 80px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
          <div style="font-size: 0.7rem; color: var(--color-accent-gold); font-weight: 700; margin-bottom: 0.5rem; letter-spacing: 0.1em;">REFACTORED PROSE OUTPUT</div>
          <div id="uses-4-text" style="color: #fff; line-height: 1.5;"></div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-4-btn');
      const output = container.querySelector('#uses-4-output');
      const textBox = container.querySelector('#uses-4-text');
      const input = container.querySelector('#uses-4-input');
      const toneSelect = container.querySelector('#uses-4-tone');

      const toneDrafts = {
        polite: "I hope you are having a productive week. Could you please send over the latest draft of the report by tomorrow morning? Having it by then will help ensure we stay aligned with our project timeline. Thank you for your assistance.",
        urgent: "Following up on the report—we will need the final copy completed and sent over by tomorrow morning to ensure we can meet our scheduled delivery. Please let me know if you foresee any issues hitting this window.",
        warm: "Hi there! I hope your day is going well. Whenever you get a moment, could you share the report with me by tomorrow morning? I'd love to review it and prepare for our upcoming sync. Let me know if you need a hand wrapping anything up!"
      };

      btn.addEventListener('click', () => {
        const val = toneSelect.value;
        const text = toneDrafts[val] || toneDrafts.polite;
        
        output.style.display = 'block';
        textBox.textContent = "Processing semantic transformations...";
        textBox.style.color = 'var(--color-accent-gold)';
        
        setTimeout(() => {
          textBox.textContent = text;
          textBox.style.color = '#fff';
        }, 500);
      });
    }
  },
  5: {
    title: "5. Extracting Data and Spotting Trends",
    intro: "Process unstructured tabular logs or CSV strings. Perform quantitative aggregation, compute growth metrics, and generate simple representations to highlight outliers.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">SELECT TABULAR LOG:</label>
        <select id="uses-5-data" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="stars">Global Frontend Framework Usage (Stars, 2026)</option>
          <option value="growth">Compute Agent Sandbox Executions (Ops/sec)</option>
        </select>
        <button id="uses-5-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Analyze Trend</button>
        
        <div id="uses-5-output" style="display: none; display: flex; flex-direction: column; gap: 1.2rem;">
          <div class="glass-panel" style="padding: 1.5rem; background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 1rem;" id="uses-5-chart-box">
            <!-- Bars will be injected dynamically -->
          </div>
          <div id="uses-5-desc" class="glass-panel" style="padding: 1rem; background: rgba(13,242,201,0.02); border-color: rgba(13,242,201,0.1); font-size: 0.85rem; line-height: 1.5;"></div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-5-btn');
      const output = container.querySelector('#uses-5-output');
      const chartBox = container.querySelector('#uses-5-chart-box');
      const descBox = container.querySelector('#uses-5-desc');
      const dataSelect = container.querySelector('#uses-5-data');

      const dataSets = {
        stars: {
          items: [
            { label: "Svelte 5", val: 82, color: "#f43f5e" },
            { label: "React 19", val: 95, color: "#06b6d4" },
            { label: "Vue 3.5", val: 68, color: "#10b981" }
          ],
          desc: "<strong>AI Insight Report:</strong> React retains volume leadership, but Svelte shows the highest relative growth rate (24% YoY) driven by compiler-based reactivity stability. Vue maintains steady core adoption."
        },
        growth: {
          items: [
            { label: "Software Sandbox", val: 92, color: "#10b981" },
            { label: "Bioinformatics run", val: 45, color: "#8b5cf6" },
            { label: "Quant Trade logic", val: 78, color: "#fbbf24" }
          ],
          desc: "<strong>AI Insight Report:</strong> Sandbox computing runs have the highest execution rates, averaging 92,000 Ops/sec. Bioinformatics workloads show lower raw frequencies due to high sequence translation overheads."
        }
      };

      btn.addEventListener('click', () => {
        const val = dataSelect.value;
        const set = dataSets[val];
        
        output.style.display = 'none';
        chartBox.innerHTML = '';
        
        btn.textContent = "Aggregating metrics...";
        btn.disabled = true;
        
        setTimeout(() => {
          set.items.forEach(item => {
            const barWrapper = document.createElement('div');
            barWrapper.style.display = 'flex';
            barWrapper.style.flexDirection = 'column';
            barWrapper.style.gap = '0.3rem';
            
            barWrapper.innerHTML = `
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700;">
                <span>${item.label}</span>
                <span>${item.val}%</span>
              </div>
              <div style="background:rgba(255,255,255,0.05); height:12px; border-radius:6px; overflow:hidden; width:100%;">
                <div style="background:${item.color}; width:${item.val}%; height:100%; border-radius:6px; box-shadow:0 0 10px ${item.color}50; transition: width 0.8s ease;"></div>
              </div>
            `;
            chartBox.appendChild(barWrapper);
          });
          
          descBox.innerHTML = set.desc;
          output.style.display = 'flex';
          btn.textContent = "Analyze Trend";
          btn.disabled = false;
        }, 500);
      });
    }
  },
  6: {
    title: "6. Structure Stream of Consciousness",
    intro: "Input a list of tasks, notes, or ideas. Command the model to classify items, compute priority metrics, and print a structured, copy-pasteable checklist.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">RAW BRAIN DUMP:</label>
        <textarea id="uses-6-input" class="form-input text-area" style="height: 100px; width: 100%; resize: none; font-size: 0.9rem;" placeholder="Type a chaotic list of thoughts...">groceries... get milk... read Kafka paper... call mom... schedule dentist... write thesis introduction... clean desk... buy bike pump... outline math chapter</textarea>
        <button id="uses-6-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Structure Thoughts</button>
        
        <div id="uses-6-output" class="glass-panel" style="display: none; padding: 1.5rem; border-color: rgba(13,242,201,0.2); background: rgba(13,242,201,0.01); display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div style="border-right: 1px solid rgba(255,255,255,0.05); padding-right: 1rem;">
            <h4 style="font-size: 0.8rem; font-weight: 700; color: var(--color-accent-teal); margin-bottom: 0.8rem; letter-spacing: 0.05em;">HEALTH & HOME</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
              <li><input type="checkbox" checked disabled> Call Mom (Family update)</li>
              <li><input type="checkbox" checked disabled> Schedule Dentist (Health check)</li>
              <li><input type="checkbox" checked disabled> Clean Desk (Workspace setup)</li>
              <li><input type="checkbox" checked disabled> Get Milk (Groceries)</li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.8rem; font-weight: 700; color: var(--color-accent-gold); margin-bottom: 0.8rem; letter-spacing: 0.05em;">ACADEMIC & ERRANDS</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
              <li><input type="checkbox" checked disabled> Write Thesis Intro (Literature)</li>
              <li><input type="checkbox" checked disabled> Read Kafka Paper (Kafka connection)</li>
              <li><input type="checkbox" checked disabled> Outline Math Chapter (Study)</li>
              <li><input type="checkbox" checked disabled> Buy Bike Pump (Errands)</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-6-btn');
      const output = container.querySelector('#uses-6-output');

      btn.addEventListener('click', () => {
        btn.textContent = "Sorting tags...";
        btn.disabled = true;
        
        setTimeout(() => {
          output.style.display = 'grid';
          btn.textContent = "Structure Thoughts";
          btn.disabled = false;
        }, 400);
      });
    }
  },
  7: {
    title: "7. Build a Custom Calendar or Study Plan",
    intro: "Request incremental milestones for projects. Calibrate the output format to render a grid representing days and specific, isolated learning objectives.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">LEARNING TARGET:</label>
        <select id="uses-7-plan" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="css">Master CSS Grid & Flexbox Layouts</option>
          <option value="poetry">Write a Satirical Modest Proposal Essay</option>
        </select>
        <button id="uses-7-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Build Plan</button>
        
        <div id="uses-7-output" style="display: none; display: flex; flex-direction: column; gap: 1rem;">
          <h4 id="uses-7-title" style="font-size: 0.9rem; font-weight: 700; color: var(--color-accent-teal); text-transform: uppercase;"></h4>
          <div id="uses-7-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <!-- Plan blocks will be injected -->
          </div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-7-btn');
      const output = container.querySelector('#uses-7-output');
      const grid = container.querySelector('#uses-7-grid');
      const title = container.querySelector('#uses-7-title');
      const select = container.querySelector('#uses-7-plan');

      const plans = {
        css: {
          title: "3-Step CSS Layout Program",
          steps: [
            { day: "Phase 1", title: "Flexbox Foundations", desc: "Build standard layouts using display:flex. Practice justify-content, align-items, and handle mobile wrap breakpoints." },
            { day: "Phase 2", title: "CSS Grid Architecture", desc: "Define explicit templates (grid-template-columns, grid-area). Build multi-row grid structures and responsive auto-fit cards." },
            { day: "Phase 3", title: "Combustion Practice", desc: "Assemble a complex landing page combining flexbox headers with a multi-column CSS grid dashboard container." }
          ]
        },
        poetry: {
          title: "Satirical Essay Writing Guide",
          steps: [
            { day: "Phase 1", title: "Target Selection", desc: "Identify a modern societal pain point (e.g. college pressure, digital burnouts) to exaggerate. Analyze Swift's tone." },
            { day: "Phase 2", title: "Drafting Pillars", desc: "Outline three absurd automated systems to resolve the target problem. Exaggerate their mechanical metrics." },
            { day: "Phase 3", title: "Disclaimer Footnote", desc: "Inject ironical disclaimers and write a biting Terms of Service footer. Polish byline details." }
          ]
        }
      };

      btn.addEventListener('click', () => {
        const val = select.value;
        const plan = plans[val];
        
        output.style.display = 'none';
        grid.innerHTML = '';
        
        btn.textContent = "Compiling syllabus...";
        btn.disabled = true;
        
        setTimeout(() => {
          title.textContent = plan.title;
          plan.steps.forEach(step => {
            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.padding = '1.2rem';
            card.style.background = 'rgba(255,255,255,0.01)';
            card.style.borderColor = 'rgba(255,255,255,0.04)';
            
            card.innerHTML = `
              <div style="font-size:0.7rem; color:var(--color-accent-teal); font-weight:700; margin-bottom:0.4rem; letter-spacing:0.05em;">${step.day}</div>
              <h5 style="font-family:var(--font-story); font-size:1rem; font-weight:700; color:#fff; margin-bottom:0.5rem;">${step.title}</h5>
              <p style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.4;">${step.desc}</p>
            `;
            grid.appendChild(card);
          });
          
          output.style.display = 'flex';
          btn.textContent = "Build Plan";
          btn.disabled = false;
        }, 500);
      });
    }
  },
  8: {
    title: "8. Roleplay Conversations & Mock Interviews",
    intro: "Stage mock interviews or speech training inside sandbox streams. The model acts as an interviewer, returning critiques and suggesting alternative replies.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">SELECT MOCK SCENARIO:</label>
        <select id="uses-8-scen" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="salary">Negotiating a Project Deadline Extension</option>
          <option value="code">Explaining a Code Bug to a Client</option>
        </select>
        <button id="uses-8-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Start Session</button>
        
        <div id="uses-8-output" class="glass-panel" style="display: none; padding: 1.5rem; border-color: rgba(13,242,201,0.2); background: rgba(13,242,201,0.01); display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; gap: 0.8rem; align-items: start;">
            <div style="background: rgba(13,242,201,0.1); padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: var(--color-accent-teal);">AI CLIENT</div>
            <p id="uses-8-prompt" style="font-size: 0.9rem; line-height: 1.5; color: #fff;"></p>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); display: block; margin-bottom: 0.6rem;">CHOOSE YOUR RESPONSE:</label>
            <div id="uses-8-options" style="display: flex; flex-direction: column; gap: 0.6rem;">
              <!-- Option buttons go here -->
            </div>
          </div>
          <div id="uses-8-feedback" class="glass-panel" style="display: none; padding: 1rem; background: rgba(0,0,0,0.2); font-size: 0.85rem; line-height: 1.4; color: var(--color-accent-teal);"></div>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-8-btn');
      const output = container.querySelector('#uses-8-output');
      const promptText = container.querySelector('#uses-8-prompt');
      const optionsContainer = container.querySelector('#uses-8-options');
      const feedbackBox = container.querySelector('#uses-8-feedback');
      const scenSelect = container.querySelector('#uses-8-scen');

      const scenarios = {
        salary: {
          prompt: "The client asks: 'We scheduled the software beta deployment for tomorrow morning, but you're telling me it won't be ready? This stalls our marketing campaign. Why is this late?'",
          opts: [
            { text: "My apologies, we hit some server errors and had to restart test runs. We need 48 more hours.", score: "neutral", feed: "<strong>AI Coach:</strong> Neutral response. Valid rationale, but focus on the test validation quality instead of simple errors to reinforce developer authority." },
            { text: "We discovered a major security loop during final compilations. We chose to delay the build to guarantee customer data safety rather than ship a fragile model.", score: "strong", feed: "<strong>AI Coach:</strong> Strong response! Framing the delay around security audits and user protection increases trust and justifies the extra time." }
          ]
        },
        code: {
          prompt: "The client asks: 'Why does the dashboard take 5 seconds to load the charts? This feels slow.'",
          opts: [
            { text: "The server is doing a lot of database processing, there is nothing we can do right now.", score: "weak", feed: "<strong>AI Coach:</strong> Weak response. Avoid defensive phrases. Instead, suggest incremental optimizations like lazy-loading charts." },
            { text: "The chart compiles heavy historical data logs. I will implement a lazy-loading module today so that the core UI renders instantly while data populates in the background.", score: "strong", feed: "<strong>AI Coach:</strong> Strong response! Emphasizes clear understanding of the bottleneck and offers a concrete performance strategy (lazy-loading)." }
          ]
        }
      };

      btn.addEventListener('click', () => {
        const key = scenSelect.value;
        const scen = scenarios[key];
        
        output.style.display = 'flex';
        feedbackBox.style.display = 'none';
        promptText.textContent = scen.prompt;
        optionsContainer.innerHTML = '';
        
        scen.opts.forEach(opt => {
          const optBtn = document.createElement('button');
          optBtn.className = 'btn-secondary';
          optBtn.style.padding = '0.8rem 1rem';
          optBtn.style.borderRadius = '10px';
          optBtn.style.fontSize = '0.85rem';
          optBtn.style.textAlign = 'left';
          optBtn.textContent = opt.text;
          
          optBtn.addEventListener('click', () => {
            feedbackBox.style.display = 'block';
            feedbackBox.innerHTML = opt.feed;
            
            // Highlight feedback color based on strength
            if (opt.score === 'strong') {
              feedbackBox.style.borderColor = 'rgba(34, 197, 94, 0.3)';
              feedbackBox.style.color = '#22c55e';
            } else {
              feedbackBox.style.borderColor = 'rgba(251, 191, 36, 0.3)';
              feedbackBox.style.color = '#fbbf24';
            }
          });
          
          optionsContainer.appendChild(optBtn);
        });
      });
    }
  },
  9: {
    title: "9. Auto-Generate Spreadsheet Macros or Script Runs",
    intro: "Avoid manual CSV parsing or formula building. Describe the automation logic in natural language and retrieve fully formatted Python or JavaScript snippets.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">SELECT AUTOMATION SCRIPT:</label>
        <select id="uses-9-macro" class="form-input" style="width: 100%; cursor: pointer;">
          <option value="extract">Extract Domain Names from Raw Emails</option>
          <option value="format">Convert MM/DD/YYYY Dates to ISO format</option>
        </select>
        <button id="uses-9-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-primary); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);">Generate Macro</button>
        
        <div id="uses-9-output" class="glass-panel" style="display: none; padding: 1.2rem; background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.05); font-family: monospace; font-size: 0.8rem; overflow-x: auto; white-space: pre; color: #fff;">
          Generating script...
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-9-btn');
      const output = container.querySelector('#uses-9-output');
      const macroSelect = container.querySelector('#uses-9-macro');

      const macros = {
        extract: `// JavaScript Macro: Extract Domain from Email\nfunction getEmailDomain(email) {\n  if (!email || !email.includes('@')) return null;\n  return email.split('@')[1].trim().toLowerCase();\n}\n\n// Example: getEmailDomain('user@synapse.org') -> 'synapse.org'`,
        format: `// Python Macro: Date Format Converter\nfrom datetime import datetime\n\ndef convert_to_iso(date_str):\n    try:\n        # Parses '11/22/2022' -> '2022-11-22'\n        dt = datetime.strptime(date_str.strip(), '%m/%d/%Y')\n        return dt.strftime('%Y-%m-%d')\n    except ValueError:\n        return None`
      };

      btn.addEventListener('click', () => {
        const val = macroSelect.value;
        const code = macros[val];
        
        output.style.display = 'block';
        output.textContent = code;
      });
    }
  },
  10: {
    title: "10. Rapid Prototyping for Websites",
    intro: "Compose wireframe components. Select styling guidelines and business verticals to render visual layout containers in real-time.",
    html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); display: block; margin-bottom: 0.4rem;">BUSINESS TYPE:</label>
            <select id="uses-10-biz" class="form-input" style="width: 100%; cursor: pointer;">
              <option value="cafe">Cozy Neighborhood Café</option>
              <option value="saas">AI developer Startup</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); display: block; margin-bottom: 0.4rem;">COLOR THEME:</label>
            <select id="uses-10-theme" class="form-input" style="width: 100%; cursor: pointer;">
              <option value="cafe">Warm Terracotta & Sand</option>
              <option value="saas">Deep Space Obsidian & Blue</option>
            </select>
          </div>
        </div>
        <button id="uses-10-btn" class="form-submit" style="align-self: flex-start; padding: 0.8rem 1.8rem; background-color: var(--color-accent-teal); color: #000; font-weight: 700;">Draft Landing Page</button>
        
        <div id="uses-10-output" class="glass-panel" style="display: none; padding: 1.5rem; transition: all 0.5s ease; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); min-height: 200px; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center; justify-content: center;">
          <h4 id="uses-10-header" style="font-family: var(--font-story); font-size: 1.6rem; font-weight: 700;"></h4>
          <p id="uses-10-desc" style="font-size: 0.9rem; max-width: 450px; line-height: 1.5; color: var(--color-text-muted);"></p>
          <button id="uses-10-cta" style="border: none; padding: 0.8rem 2rem; border-radius: 40px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.3s;"></button>
        </div>
      </div>
    `,
    bind: (container) => {
      const btn = container.querySelector('#uses-10-btn');
      const output = container.querySelector('#uses-10-output');
      const header = container.querySelector('#uses-10-header');
      const desc = container.querySelector('#uses-10-desc');
      const cta = container.querySelector('#uses-10-cta');
      const bizSelect = container.querySelector('#uses-10-biz');
      const themeSelect = container.querySelector('#uses-10-theme');

      const options = {
        cafe: {
          bg: "linear-gradient(135deg, #2e1a1c 0%, #1c0e10 100%)",
          border: "1px solid rgba(234, 88, 12, 0.25)",
          color: "#fdba74",
          btnBg: "#ea580c",
          btnColor: "#fff",
          hText: "THE DAILY BREW",
          pText: "Slow-roasted organic beans harvested sustainably. Drop by for artisanal pastries, ambient jazz playlists, and warm community desks.",
          ctaText: "Find a Café Near You"
        },
        saas: {
          bg: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          color: "#38bdf8",
          btnBg: "#0284c7",
          btnColor: "#fff",
          hText: "SYNAPSE COMPUTING",
          pText: "Autonomous agent infrastructure built on local, privacy-centric large models. Run compiler tools, test pipelines, and automate databases.",
          ctaText: "Deploy Free Sandbox"
        }
      };

      btn.addEventListener('click', () => {
        const val = bizSelect.value;
        const opt = options[val];
        
        output.style.display = 'flex';
        output.style.background = opt.bg;
        output.style.border = opt.border;
        header.style.color = opt.color;
        header.textContent = opt.hText;
        desc.textContent = opt.pText;
        
        cta.style.background = opt.btnBg;
        cta.style.color = opt.btnColor;
        cta.textContent = opt.ctaText;
      });
    }
  }
};

export function renderUsesDetail(idx) {
  const panel = document.getElementById('uses-panel-content');
  if (!panel) return;

  const data = USES_DATA[idx];
  if (!data) return;

  // Build the complete interface frame
  panel.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem; height: 100%;">
      <div>
        <h3 style="font-family: var(--font-story); font-size: 1.40rem; font-weight: 700; color: var(--color-accent-teal); margin-bottom: 0.5rem;">${data.title}</h3>
        <p style="font-family: var(--font-body); font-size: 0.92rem; color: var(--color-text-muted-light); line-height: 1.5;">${data.intro}</p>
        <div style="height: 1px; background: rgba(255, 255, 255, 0.05); margin-top: 1.2rem; margin-bottom: 1.2rem;"></div>
      </div>
      <div id="uses-simulation-frame" style="flex: 1;">
        ${data.html}
      </div>
    </div>
  `;

  // Bind individual event logic to injected elements
  const frame = panel.querySelector('#uses-simulation-frame');
  if (frame && data.bind) {
    data.bind(frame);
  }
}
