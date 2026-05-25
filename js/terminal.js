const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const aiResponses = {
  "what about the economic storm?": "In late 2022, central banks spearheaded by the Federal Reserve initiated the most aggressive interest rate hiking cycle in decades to combat skyrocketing inflation. Markets plummeted, energy costs in Europe surged due to supply lines cutting off, and a cold winter threatened deep recession. The recovery of late autumn was merely a fragile illusion of optimism.",
  "how fragile was this winter of 2022?": "The global apparatus was wound to the absolute limit. Europe was deeply divided over energy price caps, the US-China rivalry reached a boiling point in Cambodia, and economic warfare escalated. The world was holding its breath, waiting for a catalyst to break the gridlock.",
  "was the system really holding its breath?": "Yes. The old post-pandemic order was crumbling under structural inflation and geopolitical warfare. There was an eerie stillness—a collective sense of dread that some sudden vibration would shatter the illusion of control. And then, ChatGPT was released, shifting the global focus overnight from geopolitical decay to the exponential dawn of artificial intelligence."
};

const defaultResponse = "The winter of 2022 felt like a historic bottleneck—where energy crises, global wars, and economic inflation converged. But the launch of generative AI instantly re-centered the human narrative around a new, unpredictable frontier.";

function appendMessage(sender, text) {
  if (!chatMessages) return null;
  const messageNode = document.createElement('div');
  messageNode.className = `terminal-message ${sender === 'user' ? 'user-message' : ''}`;
  
  const avatar = document.createElement('div');
  avatar.className = `message-avatar ${sender}`;
  avatar.textContent = sender === 'user' ? 'ME' : 'GPT';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;
  
  messageNode.appendChild(avatar);
  messageNode.appendChild(content);
  chatMessages.appendChild(messageNode);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return content;
}

export function handleChatSubmit(e) {
  if (e) e.preventDefault();
  if (!chatInput) return;
  const rawInput = chatInput.value.trim();
  if (!rawInput) return;
  
  chatInput.value = '';
  appendMessage('user', rawInput);
  
  setTimeout(() => {
    const aiMessageHolder = appendMessage('ai', '');
    if (!aiMessageHolder) return;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    aiMessageHolder.appendChild(cursor);
    
    const cleanedQuery = rawInput.toLowerCase().replace(/[^\w\s]/g, '');
    let responseText = defaultResponse;
    
    for (const key in aiResponses) {
      if (cleanedQuery.includes(key.substring(0, 15)) || key.includes(cleanedQuery)) {
        responseText = aiResponses[key];
        break;
      }
    }
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < responseText.length) {
        aiMessageHolder.textContent = responseText.substring(0, i + 1);
        aiMessageHolder.appendChild(cursor);
        i++;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        clearInterval(typingInterval);
        cursor.remove();
      }
    }, 15);
    
  }, 600);
}

// Hook up listener if elements exist
export function initTerminal() {
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }
}
