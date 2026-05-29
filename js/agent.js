import { playClickSound, playHoverSound, playKeypressSound } from './audio.js';

// Tasks data for simulation
const tasks = {
  dev: {
    files: [
      { name: '📁 src', active: false },
      { name: '📄 index.js', active: false },
      { name: '📄 utils.js', active: true },
      { name: '📁 tests', active: false },
      { name: '📄 package.json', active: false }
    ],
    research: {
      thoughts: [
        "Analyzing project directory tree...",
        "Inspecting performance-critical utilities in `src/utils.js`.",
        "Found synchronous file-parsing loop blocking the main UI thread during renders."
      ],
      terminal: [
        "$ grep -rn 'readFileSync' src/",
        "src/utils.js:42:  const configData = fs.readFileSync(configPath);",
        "$ node --eval 'console.log(\"Syntax check: active configuration OK.\")'"
      ]
    },
    approvalMsg: "Approve writing asynchronous promise-based file loader to utils.js?",
    exec: {
      thoughts: [
        "User approved modifications. Structuring replacement diff...",
        "Applying async worker queue wrapper to `src/utils.js`.",
        "Initializing Mocha test suite framework to verify runtime changes."
      ],
      terminal: [
        "$ cat << 'EOF' > src/utils.js.diff\n- fs.readFileSync(configPath)\n+ await fs.promises.readFile(configPath)\nEOF",
        "Writing chunk modification diff to /src/utils.js... Done.",
        "$ npm run test"
      ]
    },
    done: {
      thoughts: [
        "All test assertions passed successfully.",
        "Hot-reload compiled in 18ms. Main loop lag dropped to 0ms.",
        "Workspace optimized. Software Dev Sandbox fully resolved."
      ],
      terminal: [
        "✓ tests/scheduler_test.js (4 passed)",
        "✓ tests/concurrency_test.js (2 passed)",
        "Success. Performance increased by 42%."
      ]
    }
  },
  science: {
    files: [
      { name: '📁 genome', active: false },
      { name: '📄 lookup.py', active: true },
      { name: '📄 db_cache.json', active: false },
      { name: '📁 results', active: false },
      { name: '📄 clinvar.fasta', active: false }
    ],
    research: {
      thoughts: [
        "Extracting molecular DNA motif profile templates...",
        "Querying JASPAR repository (Matrix ID: MA0139.1) for TF binding profiles.",
        "Cross-referencing coordinates with pathogenic variants in ClinVar."
      ],
      terminal: [
        "$ python lookup.py --motif MA0139.1 --region chr19:11200-11500",
        "Connecting to JASPAR servers... Profile GATA2 loaded.",
        "Loading clinical pathogenicity variants... 4 candidate mutations found."
      ]
    },
    approvalMsg: "Approve external Ensembl REST API sequence queries for chromosome mapping?",
    exec: {
      thoughts: [
        "User approved. Initiating external REST queries...",
        "Running local sequence alignment via Clustal Omega solver.",
        "Calculating mutation effect index on GATA2 transcription factor binding affinity."
      ],
      terminal: [
        "$ python align.py --input clinvar.fasta --reference human_grch38.fasta",
        "Aligning target sequences... Clustal Omega complete (score: 0.94).",
        "Calculating position weight matrix variance...",
        "Variant rs121912651 disrupts core binding motif. Affinity reduced by 85%."
      ]
    },
    done: {
      thoughts: [
        "Promoter disruptor target isolated with 98% statistical confidence.",
        "Bioinformatics pipeline completed. Analysis results structured.",
        "Saved alignment reports to `results/GATA2_promoter_variant.json`."
      ],
      terminal: [
        "✓ Sequence alignment complete (score: 0.94)",
        "Isolate: chr19:pos11294 (G>A transition)",
        "Research pipeline run complete. Logs written to results/."
      ]
    }
  },
  hedge: {
    files: [
      { name: '📁 trading', active: false },
      { name: '📄 hedge.js', active: true },
      { name: '📄 markets.json', active: false },
      { name: '📁 logs', active: false },
      { name: '📄 portfolio.xml', active: false }
    ],
    research: {
      thoughts: [
        "Retrieving real-time market index volatility boundaries...",
        "Detecting massive volatility spike in hardware makers following DeepSeek launch.",
        "Evaluating delta exposure risk thresholds for active digital assets."
      ],
      terminal: [
        "$ node hedge.js --check-volatility --token ETH",
        "Reading markets.json... Loaded asset mappings.",
        "Current ETH spot: $3,450. VIX is at 28.5 (Risk threshold limit: 25.0)."
      ]
    },
    approvalMsg: "Approve execution order to redirect 1,200 ETH portfolio weights to hedges?",
    exec: {
      thoughts: [
        "User approved. Structuring short-hedges: 40% futures, 60% cash reserves.",
        "Routing smart contracts execution logs to liquidity aggregator pools.",
        "Awaiting blockchain gas execution and block confirmation signatures."
      ],
      terminal: [
        "$ node hedge.js --action rebalance --hedges active --amount 1200",
        "Structuring short contract (480 ETH) & Liquidity pool hedge (720 ETH)...",
        "Broadcasting trade execution to pools...",
        "Transaction block signature: 0x8f2a632db2f90a2c4e9d5e3f3b9c4f. Verified."
      ]
    },
    done: {
      thoughts: [
        "Vol hedge ratio rebalanced to 1.15x safety targets.",
        "Aggregator pipeline cleared. Liquidity margin secured.",
        "Trading portfolio risk exposure normalized. Hedge complete."
      ],
      terminal: [
        "✓ Volatility hedge rebalanced. Margin coverage: 240%",
        "Hedge confirmation: order 0x8f2a...9c4f successfully mined.",
        "Workspace secured. Monitoring active feeds."
      ]
    }
  }
};

// UI Selectors
let activeTask = null;
let currentPhase = 'idle'; // idle, research, paused, exec, done
let simulationTimeouts = [];

export function initAgentWorkspace() {
  const taskButtons = document.querySelectorAll('.agent-task-btn');
  const btnApprove = document.getElementById('btn-agent-approve');
  const btnReset = document.getElementById('btn-agent-reset');
  
  if (!taskButtons.length) return;
  
  taskButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (currentPhase !== 'idle' && currentPhase !== 'done') return;
      playClickSound();
      
      // Clear previous simulation timeouts
      clearSimulation();
      
      const taskId = btn.getAttribute('data-task');
      runTaskSimulation(taskId);
    });
    btn.addEventListener('mouseenter', () => {
      if (currentPhase === 'idle' || currentPhase === 'done') {
        playHoverSound();
      }
    });
  });
  
  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      if (currentPhase !== 'paused') return;
      playClickSound();
      approveTaskStep();
    });
    btnApprove.addEventListener('mouseenter', () => {
      if (currentPhase === 'paused') playHoverSound();
    });
  }
  
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playClickSound();
      resetWorkspace();
    });
    btnReset.addEventListener('mouseenter', () => {
      if (!btnReset.disabled) playHoverSound();
    });
  }
}

function clearSimulation() {
  simulationTimeouts.forEach(t => clearTimeout(t));
  simulationTimeouts = [];
}

function updateStatusUI(statusText, indicatorClass) {
  const statusLabel = document.getElementById('agent-status');
  const indicator = document.querySelector('.status-indicator');
  
  if (statusLabel) statusLabel.textContent = `STATUS: ${statusText}`;
  if (indicator) {
    indicator.className = 'status-indicator';
    if (indicatorClass) indicator.classList.add(indicatorClass);
  }
}

function renderFileTree(files) {
  const fileListContainer = document.getElementById('agent-file-list');
  if (!fileListContainer) return;
  
  fileListContainer.innerHTML = '';
  files.forEach(file => {
    const item = document.createElement('div');
    const isFolder = file.name.startsWith('📁');
    const isIndent = file.name.startsWith('📄') && files.some(f => f.name.startsWith('📁') && file.name !== f.name);
    
    item.className = 'file-item';
    if (isIndent && file.name !== 'package.json' && file.name !== 'clinvar.fasta' && file.name !== 'portfolio.xml') {
      item.classList.add('indent');
    }
    if (file.active && currentPhase !== 'idle') {
      item.classList.add('active');
    }
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'file-icon';
    iconSpan.textContent = isFolder ? '📁' : '📄';
    
    const cleanName = file.name.replace(/^[📁📄]\s*/, '');
    
    item.appendChild(iconSpan);
    item.appendChild(document.createTextNode(` ${cleanName}`));
    fileListContainer.appendChild(item);
  });
}

function typeLogLines(containerId, lines, onComplete, delayBetween = 700) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let lineIdx = 0;
  
  function typeNextLine() {
    if (lineIdx >= lines.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const text = lines[lineIdx];
    const el = document.createElement('div');
    
    if (containerId === 'thought-log') {
      el.className = 'thought-step';
      if (text.startsWith('User approved') || text.startsWith('Optimization applied') || text.startsWith('Bioinformatics pipeline') || text.startsWith('Vol hedge')) {
        el.classList.add('done-note');
      } else if (text.startsWith('Found') || text.startsWith('Vulnerability') || text.startsWith('rs121912651') || text.startsWith('Detecting')) {
        el.classList.add('system-note');
      }
    } else {
      el.className = 'terminal-line';
      if (text.startsWith('$')) {
        el.classList.add('cmd');
      } else if (text.startsWith('✓') || text.startsWith('Success') || text.startsWith('Build successful')) {
        el.classList.add('success');
      } else if (text.startsWith('Vulnerability') || text.startsWith('rs121912651') || text.startsWith('Transaction block')) {
        el.classList.add('success');
      }
    }
    
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    
    // Typewriter effect per line
    let charIdx = 0;
    const typingSpeed = 10;
    const typingTimer = setInterval(() => {
      el.textContent = text.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx >= text.length) {
        clearInterval(typingTimer);
        
        // play keypress sounds sporadically
        if (Math.random() < 0.3) {
          playKeypressSound();
        }
        
        lineIdx++;
        const timeout = setTimeout(typeNextLine, delayBetween);
        simulationTimeouts.push(timeout);
      }
    }, typingSpeed);
  }
  
  typeNextLine();
}

function runTaskSimulation(taskId) {
  if (!Object.prototype.hasOwnProperty.call(tasks, taskId)) return;
  activeTask = tasks[taskId];
  if (!activeTask) return;
  
  currentPhase = 'research';
  
  // Set button active
  document.querySelectorAll('.agent-task-btn').forEach(btn => {
    if (btn.getAttribute('data-task') === taskId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Render files tree with active element
  renderFileTree(activeTask.files);
  
  // Reset logs
  const thoughtLog = document.getElementById('thought-log');
  const terminalLog = document.getElementById('terminal-log');
  if (thoughtLog) thoughtLog.innerHTML = '';
  if (terminalLog) terminalLog.innerHTML = '$ ready.\n';
  
  updateStatusUI('RUNNING: ANALYZING WORKSPACE', 'running');
  
  // 1. Type thoughts
  typeLogLines('thought-log', activeTask.research.thoughts, () => {
    // 2. Type terminal outputs
    typeLogLines('terminal-log', activeTask.research.terminal, () => {
      // 3. Enter paused approval state
      currentPhase = 'paused';
      updateStatusUI('AWAITING USER DECISION', 'awaiting');
      
      const approvalBanner = document.getElementById('approval-banner');
      const approvalText = approvalBanner.querySelector('.approval-text');
      const btnApprove = document.getElementById('btn-agent-approve');
      const btnReset = document.getElementById('btn-agent-reset');
      
      if (approvalBanner) approvalBanner.classList.add('active');
      if (approvalText) approvalText.textContent = `[ACTION REQUIRED] ${activeTask.approvalMsg}`;
      if (btnApprove) btnApprove.removeAttribute('disabled');
      if (btnReset) btnReset.removeAttribute('disabled');
    }, 400);
  }, 500);
}

function approveTaskStep() {
  if (currentPhase !== 'paused' || !activeTask) return;
  
  currentPhase = 'exec';
  updateStatusUI('RUNNING: APPLYING MODIFICATIONS', 'running');
  
  const approvalBanner = document.getElementById('approval-banner');
  const approvalText = approvalBanner.querySelector('.approval-text');
  const btnApprove = document.getElementById('btn-agent-approve');
  
  if (approvalBanner) approvalBanner.classList.remove('active');
  if (approvalText) approvalText.textContent = "Applying modifications and executing validation tests...";
  if (btnApprove) btnApprove.setAttribute('disabled', 'true');
  
  // 1. Run exec thoughts
  typeLogLines('thought-log', activeTask.exec.thoughts, () => {
    // 2. Run exec terminal outputs
    typeLogLines('terminal-log', activeTask.exec.terminal, () => {
      // 3. Complete task
      currentPhase = 'done';
      updateStatusUI('TASK COMPLETED', 'completed');
      
      if (approvalText) approvalText.textContent = "Agent completed task. All test suites verified successfully.";
      
      // Run final checks and completions
      typeLogLines('thought-log', activeTask.done.thoughts, () => {
        typeLogLines('terminal-log', activeTask.done.terminal, () => {
          // Finish
        }, 300);
      }, 400);
    }, 400);
  }, 500);
}

function resetWorkspace() {
  clearSimulation();
  activeTask = null;
  currentPhase = 'idle';
  
  // Reset buttons
  document.querySelectorAll('.agent-task-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Reset status
  updateStatusUI('IDLE', '');
  
  // Reset file list tree to standard tree
  const fileListContainer = document.getElementById('agent-file-list');
  if (fileListContainer) {
    fileListContainer.innerHTML = `
      <div class="file-item"><span class="file-icon">📁</span> src/</div>
      <div class="file-item indent"><span class="file-icon">📄</span> index.js</div>
      <div class="file-item indent"><span class="file-icon">📄</span> utils.js</div>
      <div class="file-item"><span class="file-icon">📁</span> tests/</div>
      <div class="file-item"><span class="file-icon">📄</span> package.json</div>
    `;
  }
  
  // Reset outputs
  const thoughtLog = document.getElementById('thought-log');
  const terminalLog = document.getElementById('terminal-log');
  if (thoughtLog) thoughtLog.textContent = 'Select an autonomous agent task on the left to begin...';
  if (terminalLog) terminalLog.textContent = '$ ready.';
  
  // Reset approval banner
  const approvalBanner = document.getElementById('approval-banner');
  const approvalText = approvalBanner.querySelector('.approval-text');
  const btnApprove = document.getElementById('btn-agent-approve');
  const btnReset = document.getElementById('btn-agent-reset');
  
  if (approvalBanner) approvalBanner.classList.remove('active');
  if (approvalText) approvalText.textContent = "Awaiting task selection...";
  if (btnApprove) btnApprove.setAttribute('disabled', 'true');
  if (btnReset) btnReset.setAttribute('disabled', 'true');
}
