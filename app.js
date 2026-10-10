(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORE_KEY = 'jarvis.studio.chats.v1';
  const SETTINGS_KEY = 'jarvis.studio.settings.v1';
  const NOTES_KEY = 'jarvis.studio.notes.v1';
  const AMBIENCE_KEY = 'jarvis.studio.ambience.v1';
  const API_KEY_SESSION = 'jarvis.openai.key.session.v1';
  const svgPaths = {
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3M19 6l1.5-1.5"/>',
    settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 0 0-1.82.7l-.04.07h-3.4l-.03-.08a1.7 1.7 0 0 0-1.82-.69l-.08.02-1.7-2.94.06-.06A1.7 1.7 0 0 0 9.5 15l-.08-.04v-3.4l.08-.03a1.7 1.7 0 0 0 .69-1.82l-.02-.08 2.94-1.7.06.06a1.7 1.7 0 0 0 1.88.34l.04-.08h3.4l.03.08a1.7 1.7 0 0 0 1.82.69l.08-.02 1.7 2.94-.06.06A1.7 1.7 0 0 0 21.8 14l-.08.03v3.4z" transform="translate(-3.1 -3.1) scale(.95)"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    sparkles: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3zM19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14 4l-4 16"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.5 5.9-5.9 2.5 2.5-5.9 5.9-2.5z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M19 9h4M19 14h4M1 9h4M1 14h4"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    volumeOff: '<path d="M11 5 6 9H2v6h4l5 4zM23 9l-6 6M17 9l6 6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.55-2.6L20 12M4 12l2.85 5.6A7 7 0 0 0 18.4 15"/>',
    external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    pause: '<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',
    headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M5 14h2v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zM17 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2z"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  };
  const icon = (name, size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.sparkles}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  $('#sidebarClose').innerHTML = icon('x');
  $('#menuToggle').innerHTML = icon('menu');
  $('#themeToggle').innerHTML = icon('sun');
  $('#clearSearch').innerHTML = icon('search');
  $$('.modal-close').forEach(el => { el.innerHTML = icon('x'); });
  $('#sendBtn').innerHTML = icon('arrowUp', 17);
  $('#stopBtn').innerHTML = icon('stop', 17);

  const state = {
    chats: loadJSON(STORE_KEY, []),
    activeId: null,
    settings: loadJSON(SETTINGS_KEY, { model: 'gpt-5.4-mini', systemPrompt: '', webSearch: false }),
    apiStatus: null,
    isGenerating: false,
    abortController: null,
    lastAssistantId: null,
    recognition: null,
    focusInterval: null,
    focusSeconds: 25 * 60,
    focusMode: 'focus',
    focusRunning: false,
    focusPausedAt: null,
    calcExpression: '',
    calcResult: '0',
    calcFresh: true,
    ambience: loadJSON(AMBIENCE_KEY, false),
    currentUtility: 'notes',
  };
  if (!Array.isArray(state.chats)) state.chats = [];
  if (state.ambience) document.body.classList.add('soft-ambience');

  function loadJSON(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { toast('Browser storage is full. Export and remove old chats.', 'error'); return false; }
  }
  function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
  function escapeHTML(str) { return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
  function safeUrl(url) { try { const u = new URL(url); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; } }
  function activeChat() { return state.chats.find(chat => chat.id === state.activeId) || null; }
  function formatTime(ts) { return new Date(ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  function formatDateGroup(ts) {
    const date = new Date(ts || Date.now()); const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'TODAY';
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
    const days = (today - date) / 86400000;
    if (days < 7) return 'PREVIOUS 7 DAYS';
    return date.toLocaleDateString([], { month: 'short', year: 'numeric' }).toUpperCase();
  }
  function titleFromText(text) {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > 38 ? `${clean.slice(0, 37).trimEnd()}…` : (clean || 'New conversation');
  }
  function makeChat() {
    const chat = { id: uid(), title: 'New conversation', updatedAt: Date.now(), messages: [] };
    state.chats.unshift(chat); state.activeId = chat.id; persistChats(); renderHistory(); renderActiveChat(); $('#promptInput').focus(); return chat;
  }
  function persistChats() {
    state.chats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    saveJSON(STORE_KEY, state.chats);
  }
  function toast(message, type = 'success') {
    const element = document.createElement('div'); element.className = `toast${type === 'error' ? ' error' : ''}`;
    element.innerHTML = `<span class="toast-icon"></span><span>${escapeHTML(message)}</span>`;
    $('#toastRegion').append(element);
    setTimeout(() => { element.style.opacity = '0'; element.style.transform = 'translateY(5px)'; setTimeout(() => element.remove(), 230); }, 3200);
  }

  function renderHistory() {
    const container = $('#chatHistory'); const query = $('#historySearch').value.trim().toLowerCase();
    const sorted = [...state.chats].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const filtered = sorted.filter(chat => !query || chat.title.toLowerCase().includes(query) || chat.messages.some(m => m.content.toLowerCase().includes(query)));
    if (!filtered.length) { container.innerHTML = `<div class="history-empty">${query ? 'No conversations match your search.' : 'Your conversations will appear here.'}</div>`; return; }
    let lastGroup = '';
    container.innerHTML = filtered.map(chat => {
      const group = formatDateGroup(chat.updatedAt);
      let heading = '';
      if (group !== lastGroup) { heading = `<div class="history-date">${escapeHTML(group)}</div>`; lastGroup = group; }
      return `${heading}<button class="history-item${chat.id === state.activeId ? ' selected' : ''}" data-chat-id="${escapeHTML(chat.id)}" title="${escapeHTML(chat.title)}"><span>${icon('message', 13)}</span><span class="history-title">${escapeHTML(chat.title || 'New conversation')}</span><span class="delete-chat" role="button" tabindex="0" data-delete-chat="${escapeHTML(chat.id)}" aria-label="Delete conversation" title="Delete conversation">${icon('x', 12)}</span></button>`;
    }).join('');
  }

  function formatMarkdown(input, messageId) {
    const source = String(input || '');
    const codes = [];
    let text = source.replace(/```([^\n`]*)\n([\s\S]*?)```/g, (_match, language, code) => {
      const token = `JARVISCODEREF${codes.length}TOKEN`;
      codes.push({ token, language: (language || 'code').trim().slice(0, 30) || 'code', code });
      return `\n\n${token}\n\n`;
    });
    text = escapeHTML(text);
    text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
      const decoded = url.replace(/&amp;/g, '&'); const safe = safeUrl(decoded);
      return safe ? `<a href="${escapeHTML(safe)}" target="_blank" rel="noopener noreferrer">${label}</a>` : match;
    });
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(?!\s)(.+?)(?<!\s)\*/g, '<em>$1</em>').replace(/~~(.+?)~~/g, '<del>$1</del>');
    const blocks = text.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
    const rendered = blocks.map(block => {
      const code = codes.find(item => block === item.token);
      if (code) return `<div class="code-wrap"><div class="code-header"><span>${escapeHTML(code.language)}</span><button type="button" data-copy-code="${codes.indexOf(code)}">${icon('copy', 12)}Copy code</button></div><pre><code>${escapeHTML(code.code.replace(/\n$/, ''))}</code></pre></div>`;
      if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(block)) return '<hr />';
      const lines = block.split('\n');
      if (lines.every(line => /^\s*#{1,3}\s+/.test(line))) return lines.map(line => { const m = line.match(/^\s*(#{1,3})\s+(.+)$/); const level = m[1].length; return `<h${level}>${m[2]}</h${level}>`; }).join('');
      if (lines.every(line => /^\s*[-*+]\s+/.test(line))) return `<ul>${lines.map(line => `<li>${line.replace(/^\s*[-*+]\s+/, '')}</li>`).join('')}</ul>`;
      if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) return `<ol>${lines.map(line => `<li>${line.replace(/^\s*\d+[.)]\s+/, '')}</li>`).join('')}</ol>`;
      if (lines.every(line => /^\s*&gt;\s?/.test(line))) return `<blockquote>${lines.map(line => line.replace(/^\s*&gt;\s?/, '')).join('<br>')}</blockquote>`;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    });
    return rendered.join('');
  }

  function renderActiveChat() {
    const chat = activeChat(); const welcome = $('#welcomeView'); const messages = $('#messagesView');
    const hasMessages = Boolean(chat && chat.messages.length);
    welcome.classList.toggle('hidden', hasMessages); messages.classList.toggle('hidden', !hasMessages);
    $('#currentPageName').textContent = 'Assistant';
    if (!hasMessages) { messages.innerHTML = ''; renderHistory(); updateComposerButtons(); return; }
    messages.innerHTML = chat.messages.map(message => {
      const role = message.role === 'assistant' ? 'assistant' : 'user';
      const avatar = role === 'assistant' ? `<div class="message-avatar">${icon('sparkles', 15)}</div>` : '<div class="message-avatar">S</div>';
      const content = message.content ? formatMarkdown(message.content, message.id) : '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      const actions = role === 'assistant' && message.content ? `<div class="message-actions"><button class="message-action" data-copy-message="${escapeHTML(message.id)}">${icon('copy', 12)}Copy</button><button class="message-action" data-speak-message="${escapeHTML(message.id)}">${icon('volume', 12)}Read aloud</button><button class="message-action" data-regenerate="${escapeHTML(message.id)}">${icon('refresh', 12)}Regenerate</button></div>` : '';
      const body = role === 'user' ? `<div class="user-bubble">${content}</div>` : content;
      return `<article class="message-row ${role}" data-message-row="${escapeHTML(message.id)}">${avatar}<div class="message-body"><div class="message-meta"><strong>${role === 'assistant' ? 'JARVIS' : 'YOU'}</strong><time>${escapeHTML(formatTime(message.createdAt))}</time></div><div class="message-text${role === 'assistant' && state.isGenerating && message.id === state.lastAssistantId ? ' stream-cursor' : ''}">${body}</div>${actions}</div></article>`;
    }).join('');
    renderHistory();
    updateComposerButtons();
    messages.scrollTop = messages.scrollHeight;
    const scene = $('#chatScene'); scene.scrollTop = scene.scrollHeight;
  }

  function updateComposerButtons() {
    $('#sendBtn').classList.toggle('hidden', state.isGenerating);
    $('#stopBtn').classList.toggle('hidden', !state.isGenerating);
    $('#sendBtn').disabled = !$('#promptInput').value.trim() && !activeChat()?.messages.length;
  }

  function refreshApiStatus() {
    const configured = Boolean(getSessionApiKey());
    state.apiStatus = { configured };
    const status = $('#apiStatus');
    status.classList.toggle('online', configured); status.classList.toggle('offline', !configured);
    status.innerHTML = `<span class="status-dot"></span><span>${configured ? 'Session key ready' : 'API key needed'}</span>`;
    $('#connectionText').textContent = configured ? 'Session key ready' : 'Add API key';
    $('#connectionTitle').textContent = configured ? 'API key ready for this session' : 'Add your OpenAI API key';
    $('#connectionDescription').textContent = configured ? 'The key is held in this tab session. It has not been validated yet.' : 'Paste your key below, then choose “Use for this session”.';
    $('#connectionCard').classList.toggle('ready', configured);
    const input = $('#apiKeyInput');
    if (input && document.activeElement !== input) input.value = '';
    $('#refreshStatus').textContent = 'Check';
  }
  function getSessionApiKey() {
    try { return sessionStorage.getItem(API_KEY_SESSION) || ''; } catch { return ''; }
  }
  function saveSessionApiKey() {
    const input = $('#apiKeyInput');
    const key = input.value.trim();
    if (!key) { toast('Paste your OpenAI API key first.', 'error'); input.focus(); return; }
    if (!/^sk-/.test(key)) { toast('That does not look like an OpenAI API key. Check it and try again.', 'error'); return; }
    try { sessionStorage.setItem(API_KEY_SESSION, key); input.value = ''; refreshApiStatus(); toast('API key set for this browser session.'); }
    catch { toast('Session storage is unavailable in this browser.', 'error'); }
  }
  function clearSessionApiKey() {
    try { sessionStorage.removeItem(API_KEY_SESSION); } catch {}
    $('#apiKeyInput').value = ''; refreshApiStatus(); toast('API key removed from this session.');
  }
  async function streamOpenAI(messages, signal, onDelta) {
    const apiKey = getSessionApiKey();
    if (!apiKey) throw new Error('Add your OpenAI API key in Settings before chatting.');
    const instructionsBase = 'You are JARVIS, a capable, polished, warm, and precise personal AI assistant. Be useful, proactive, and honest. Prefer clear structure and actionable answers. Do not claim to have performed actions outside the tools or browser features actually available to you. If asked to control the user’s device, explain the permission or integration needed rather than pretending. Use Markdown when helpful. Adapt to the user’s language and level. When web search is enabled, use it for current information and cite sources with links in your answer when possible.';
    const custom = (state.settings.systemPrompt || '').trim().slice(0, 1800);
    const body = {
      model: state.settings.model || 'gpt-5.4-mini',
      instructions: custom ? `${instructionsBase}\n\nPersonalization requested by the user (follow when compatible with safety and accuracy):\n${custom}` : instructionsBase,
      input: messages,
      stream: true,
      store: false,
      max_output_tokens: 2400
    };
    if (state.settings.webSearch) body.tools = [{ type: 'web_search' }];
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body), signal
    });
    if (!response.ok) {
      let detail = '';
      try { const data = await response.json(); detail = data.error?.message || ''; } catch {}
      if (response.status === 401) throw new Error('OpenAI rejected this API key. Check the key in Settings.');
      if (response.status === 429) throw new Error('OpenAI rate limit or API billing limit reached. Check your API account.');
      if (response.status === 403) throw new Error(detail || 'Your API account does not have access to this model or web search.');
      throw new Error(detail || `OpenAI request failed (${response.status}).`);
    }
    if (!response.body) throw new Error('This browser did not provide a response stream.');
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const chunk = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
        let eventName = 'message'; let data = '';
        for (const line of chunk.split(/\r?\n/)) {
          if (line.startsWith('event:')) eventName = line.slice(6).trim();
          else if (line.startsWith('data:')) data += line.slice(5).trim();
        }
        if (!data || data === '[DONE]') continue;
        let payload; try { payload = JSON.parse(data); } catch { continue; }
        if (eventName === 'response.output_text.delta') onDelta(payload.delta || '');
        if (eventName === 'error' || eventName === 'response.failed') throw new Error(payload.error?.message || payload.response?.error?.message || 'OpenAI could not complete the response.');
      }
    }
  }

  function showModal(id) { const modal = $(`#${id}`); if (!modal) return; modal.classList.remove('hidden'); setTimeout(() => (modal.querySelector('input,textarea,select,button') || modal).focus?.(), 30); }
  function closeModal(id) { const modal = $(`#${id}`); if (modal) modal.classList.add('hidden'); }
  function openSettings() {
    $('#modelSelect').value = state.settings.model || 'gpt-5.4-mini';
    $('#systemPrompt').value = state.settings.systemPrompt || '';
    $('#apiKeyInput').value = '';
    showModal('settingsModal'); refreshApiStatus();
  }
  function saveSettings() {
    state.settings.model = $('#modelSelect').value;
    state.settings.systemPrompt = $('#systemPrompt').value.trim().slice(0, 1800);
    saveJSON(SETTINGS_KEY, state.settings);
    $('#settingsSavedHint').textContent = 'Saved just now.';
    toast('Settings saved on this device.');
    setTimeout(() => { $('#settingsSavedHint').textContent = 'Settings are saved on this device.'; }, 2000);
  }

  function addMessage(chat, role, content, extra = {}) {
    const message = { id: uid(), role, content, createdAt: Date.now(), ...extra };
    chat.messages.push(message); chat.updatedAt = Date.now();
    if (role === 'user' && (chat.title === 'New conversation' || !chat.title)) chat.title = titleFromText(content);
    persistChats(); return message;
  }

  function localCommand(text) {
    const trimmed = text.trim();
    if (/^\/(help|commands)\s*$/i.test(trimmed)) return 'Here are the built-in commands you can use without an API call:\n\n- `/time` — show your current local time\n- `/date` — show today’s date\n- `/calc 12 * (3 + 2)` — calculate a math expression\n- `/help` — show this list\n\nYou can also open **Quick notes**, **Calculator**, and **Focus session** from the sidebar.';
    if (/^\/time\s*$/i.test(trimmed)) return `Your local time is **${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}**.`;
    if (/^\/date\s*$/i.test(trimmed)) return `Today is **${new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**.`;
    const calc = trimmed.match(/^\/calc\s+(.+)$/i);
    if (calc) {
      try { return `**Result:** \`${formatNumber(evaluateMath(calc[1]))}\``; }
      catch (error) { return `I couldn't calculate that expression: ${error.message}\n\nTry a basic expression such as \`/calc 12 * (3 + 2)\`.`; }
    }
    return null;
  }

  function evaluateMath(expression) {
    const source = expression.replace(/,/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').trim();
    if (!source || source.length > 120 || !/^[0-9+\-*/().%\s^]+$/.test(source)) throw new Error('Only basic math symbols and numbers are supported.');
    const tokens = source.match(/\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/%^]/gi) || [];
    if (tokens.join('') !== source.replace(/\s/g, '')) throw new Error('Check the expression and try again.');
    let index = 0;
    const peek = () => tokens[index];
    const take = () => tokens[index++];
    function primary() {
      const token = take();
      if (token === '+') return primary();
      if (token === '-') return -primary();
      if (token === '(') { const v = addSub(); if (take() !== ')') throw new Error('Missing closing parenthesis.'); return v; }
      const value = Number(token);
      if (!Number.isFinite(value)) throw new Error('Invalid number.');
      return value;
    }
    function power() { let v = primary(); if (peek() === '^') { take(); v **= power(); } return v; }
    function mulDiv() {
      let v = power();
      while (['*', '/', '%'].includes(peek())) { const op = take(), r = power(); if ((op === '/' || op === '%') && r === 0) throw new Error('Division by zero is not allowed.'); v = op === '*' ? v * r : op === '/' ? v / r : v % r; }
      return v;
    }
    function addSub() { let v = mulDiv(); while (['+', '-'].includes(peek())) { const op = take(), r = mulDiv(); v = op === '+' ? v + r : v - r; } return v; }
    const result = addSub();
    if (index !== tokens.length) throw new Error('Check the expression and try again.');
    if (!Number.isFinite(result)) throw new Error('The result is outside the supported range.');
    return result;
  }
  function formatNumber(number) { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 10 }).format(number); }

  async function sendPrompt(textOverride = null) {
    const input = $('#promptInput'); const text = (textOverride ?? input.value).trim();
    if (!text || state.isGenerating) return;
    input.value = ''; autoResizeInput(); updateComposerButtons();
    let chat = activeChat(); if (!chat) chat = makeChat();
    addMessage(chat, 'user', text);
    const command = localCommand(text);
    if (command) {
      addMessage(chat, 'assistant', command);
      renderActiveChat();
      return;
    }
    const assistantMessage = addMessage(chat, 'assistant', '');
    state.lastAssistantId = assistantMessage.id;
    state.isGenerating = true;
    state.abortController = new AbortController();
    setGenerationUI(true); renderActiveChat();

    try {
      const requestMessages = chat.messages.filter(m => m.id !== assistantMessage.id).slice(-32).map(m => ({ role: m.role, content: m.content }));
      await streamOpenAI(requestMessages, state.abortController.signal, (delta) => {
        assistantMessage.content += delta;
        chat.updatedAt = Date.now();
        updateAssistantStream(chat, assistantMessage);
      });
      if (!assistantMessage.content.trim()) assistantMessage.content = 'I didn’t receive any text back. Please try again.';
    } catch (error) {
      const wasCancelled = error.name === 'AbortError' || error.name === 'APIUserAbortError';
      if (!wasCancelled) {
        assistantMessage.content = assistantMessage.content ? `${assistantMessage.content}\n\n> **Connection issue:** ${error.message}` : `**Unable to respond.** ${error.message}`;
        toast(error.message, 'error');
      } else if (!assistantMessage.content) {
        chat.messages = chat.messages.filter(m => m.id !== assistantMessage.id);
      }
    } finally {
      state.isGenerating = false; state.abortController = null; state.lastAssistantId = null;
      chat.updatedAt = Date.now(); persistChats(); setGenerationUI(false); renderActiveChat();
    }
  }

  function updateAssistantStream(chat, message) {
    const row = $(`[data-message-row="${CSS.escape(message.id)}"]`, $('#messagesView'));
    if (!row) { renderActiveChat(); return; }
    const textContainer = $('.message-text', row);
    textContainer.classList.add('stream-cursor');
    textContainer.innerHTML = formatMarkdown(message.content, message.id);
    const scene = $('#chatScene'); scene.scrollTop = scene.scrollHeight;
    const historyButton = $(`[data-chat-id="${CSS.escape(chat.id)}"]`); if (historyButton) $('.history-title', historyButton).textContent = chat.title;
  }
  function setGenerationUI(generating) {
    $('#composerShell').classList.toggle('generating', generating);
    $('#promptInput').placeholder = generating ? 'JARVIS is thinking…' : 'Ask JARVIS anything…';
    $('#promptInput').disabled = generating;
    updateComposerButtons();
  }
  function stopGeneration() { if (state.abortController) state.abortController.abort(); }
  function regenerate(messageId) {
    if (state.isGenerating) return;
    const chat = activeChat(); if (!chat) return;
    const idx = chat.messages.findIndex(m => m.id === messageId);
    if (idx < 0 || chat.messages[idx].role !== 'assistant') return;
    chat.messages = chat.messages.slice(0, idx);
    const last = chat.messages[chat.messages.length - 1];
    if (!last || last.role !== 'user') { renderActiveChat(); toast('No user message available to regenerate.', 'error'); return; }
    const assistantMessage = addMessage(chat, 'assistant', ''); state.lastAssistantId = assistantMessage.id;
    state.isGenerating = true; state.abortController = new AbortController(); setGenerationUI(true); renderActiveChat();
    // Reuse the same stream path without appending another user message.
    runExistingAssistant(chat, assistantMessage);
  }
  async function runExistingAssistant(chat, assistantMessage) {
    try {
      const requestMessages = chat.messages.filter(m => m.id !== assistantMessage.id).slice(-32).map(m => ({ role: m.role, content: m.content }));
      await streamOpenAI(requestMessages, state.abortController.signal, (delta) => {
        assistantMessage.content += delta;
        chat.updatedAt = Date.now();
        updateAssistantStream(chat, assistantMessage);
      });
      if (!assistantMessage.content.trim()) assistantMessage.content = 'I didn’t receive any text back. Please try again.';
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'APIUserAbortError') { if (!assistantMessage.content) chat.messages = chat.messages.filter(m => m.id !== assistantMessage.id); }
      else { assistantMessage.content = assistantMessage.content ? `${assistantMessage.content}\n\n> **Connection issue:** ${error.message}` : `**Unable to respond.** ${error.message}`; toast(error.message, 'error'); }
    } finally { state.isGenerating = false; state.abortController = null; state.lastAssistantId = null; chat.updatedAt = Date.now(); persistChats(); setGenerationUI(false); renderActiveChat(); }
  }

  function autoResizeInput() {
    const input = $('#promptInput'); input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
    $('#charCount').textContent = input.value.length > 0 ? String(input.value.length) : '0'; updateComposerButtons();
  }
  function setWebSearch(enabled) {
    state.settings.webSearch = enabled; $('#webToggle').setAttribute('aria-pressed', String(enabled));
    $('#webToggle').title = enabled ? 'Web search is on for the next responses' : 'Let JARVIS search the web';
    saveJSON(SETTINGS_KEY, state.settings);
    toast(enabled ? 'Web search enabled for API responses.' : 'Web search disabled.');
  }

  function startVoice() {
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) { toast('Voice input is not supported in this browser. Try current Chrome or Edge.', 'error'); return; }
    if (state.recognition) { state.recognition.stop(); return; }
    const recognition = new API(); state.recognition = recognition; recognition.lang = navigator.language || 'en-US'; recognition.interimResults = true; recognition.continuous = false;
    const startValue = $('#promptInput').value.trim(); $('#voiceBtn').classList.add('listening');
    recognition.onresult = (event) => {
      const text = Array.from(event.results).map(result => result[0].transcript).join(' ');
      $('#promptInput').value = `${startValue}${startValue && text ? ' ' : ''}${text}`; autoResizeInput();
    };
    recognition.onerror = event => { if (event.error !== 'no-speech' && event.error !== 'aborted') toast(`Voice input: ${event.error}. Check microphone permission.`, 'error'); };
    recognition.onend = () => { state.recognition = null; $('#voiceBtn').classList.remove('listening'); };
    try { recognition.start(); toast('Listening… speak now.'); } catch { state.recognition = null; $('#voiceBtn').classList.remove('listening'); toast('Could not start voice input. Try again.', 'error'); }
  }
  function readAloud(messageId) {
    if (!('speechSynthesis' in window)) { toast('Read aloud is not supported in this browser.', 'error'); return; }
    const chat = activeChat(); const message = chat?.messages.find(m => m.id === messageId); if (!message?.content) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, ' code omitted ').replace(/[#*`_>]/g, ' '));
    utterance.rate = 1.04; utterance.pitch = 1; utterance.onend = () => {}; window.speechSynthesis.speak(utterance); toast('Reading response aloud.');
  }

  function downloadText(filename, content, type = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function chatToMarkdown(chat) {
    return `# ${chat.title || 'JARVIS conversation'}\n\n_Exported ${new Date(chat.updatedAt || Date.now()).toLocaleString()}_\n\n` + chat.messages.map(m => `## ${m.role === 'assistant' ? 'JARVIS' : 'You'}\n\n${m.content}`).join('\n\n---\n\n');
  }
  function exportAllChats() {
    const data = state.chats.map(chat => ({ ...chat, markdown: chatToMarkdown(chat) }));
    downloadText(`jarvis-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, chats: data }, null, 2), 'application/json;charset=utf-8');
    toast('Chat backup exported.');
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
    catch { const area = document.createElement('textarea'); area.value = text; document.body.append(area); area.select(); const ok = document.execCommand('copy'); area.remove(); toast(ok ? 'Copied to clipboard.' : 'Could not access the clipboard.', ok ? 'success' : 'error'); }
  }

  function openUtility(type) {
    state.currentUtility = type;
    const titles = { notes: 'Quick notes', calculator: 'Calculator', focus: 'Focus session' };
    $('#utilityTitle').textContent = titles[type] || 'Workspace';
    $('#currentPageName').textContent = titles[type] || 'Assistant';
    $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.tool === type));
    let content = '';
    if (type === 'notes') {
      content = `<label class="field-label" for="notesArea">YOUR PRIVATE SCRATCHPAD</label><textarea class="notes-area" id="notesArea" placeholder="Capture a thought, list, idea, or reminder…">${escapeHTML(localStorage.getItem(NOTES_KEY) || '')}</textarea><div class="utility-bottom"><span class="utility-muted" id="notesSaved">Saved in this browser</span><button class="primary-btn" id="saveNotesBtn">Save notes ${icon('check', 13)}</button></div>`;
    } else if (type === 'calculator') {
      content = `<div class="calc-display"><div class="calc-expression" id="calcExpression">Ready for a calculation</div><div class="calc-result" id="calcResult">0</div></div><div class="calc-grid">${['AC','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='].map(key => `<button class="calc-key${['÷','×','−','+','%'].includes(key) ? ' operator' : ''}${key === '=' ? ' equals' : ''}${key === 'AC' || key === '⌫' ? ' clear' : ''}" data-calc-key="${key}">${key}</button>`).join('')}</div><div class="utility-bottom"><span class="utility-muted">Keyboard input supported</span><button class="secondary-btn" id="calcSendToChat">Ask JARVIS about this</button></div>`;
    } else if (type === 'focus') {
      content = `<div class="focus-ring"><div class="focus-time" id="focusTime">${formatTimer(state.focusSeconds)}</div><div class="focus-caption" id="focusCaption">${state.focusMode === 'focus' ? 'MINUTES OF FOCUS' : 'A MOMENT TO RESET'}</div></div><div class="focus-controls"><button id="focusResetBtn">Reset</button><button class="focus-primary" id="focusStartBtn">${state.focusRunning ? 'Pause session' : 'Start focus'}</button><button id="focusModeBtn">${state.focusMode === 'focus' ? '5 min break' : '25 min focus'}</button></div><p class="helper-text" style="text-align:center;margin-top:16px">One thing at a time. Close distractions, pick a tiny goal, and start.</p>`;
    }
    $('#utilityContent').innerHTML = content; showModal('utilityModal');
    if (type === 'notes') {
      $('#notesArea').addEventListener('input', () => { try { localStorage.setItem(NOTES_KEY, $('#notesArea').value); $('#notesSaved').textContent = 'Saved automatically'; } catch { $('#notesSaved').textContent = 'Could not save — storage is full'; } });
      $('#saveNotesBtn').addEventListener('click', () => { try { localStorage.setItem(NOTES_KEY, $('#notesArea').value); toast('Notes saved.'); } catch { toast('Could not save notes. Browser storage may be full.', 'error'); } });
    } else if (type === 'calculator') {
      state.calcExpression = ''; state.calcResult = '0'; state.calcFresh = true; drawCalculator();
      $$('.calc-key', $('#utilityContent')).forEach(key => key.addEventListener('click', () => handleCalcKey(key.dataset.calcKey)));
      $('#calcSendToChat').addEventListener('click', () => { const expression = state.calcExpression; const result = state.calcResult; closeModal('utilityModal'); state.activeId = state.activeId || null; sendPrompt(`Please explain this calculation: ${expression || result} = ${result}`); });
    } else if (type === 'focus') {
      $('#focusStartBtn').addEventListener('click', toggleFocus);
      $('#focusResetBtn').addEventListener('click', resetFocus);
      $('#focusModeBtn').addEventListener('click', switchFocusMode);
      updateFocusDisplay();
    }
  }

  function drawCalculator() { const expression = $('#calcExpression'); const result = $('#calcResult'); if (!expression || !result) return; expression.textContent = state.calcExpression || 'Ready for a calculation'; result.textContent = state.calcResult; }
  function handleCalcKey(key) {
    if (key === 'AC') { state.calcExpression = ''; state.calcResult = '0'; state.calcFresh = true; }
    else if (key === '⌫') { state.calcExpression = state.calcExpression.slice(0, -1); state.calcFresh = false; }
    else if (key === '=') {
      if (!state.calcExpression) return;
      try { state.calcResult = formatNumber(evaluateMath(state.calcExpression)); state.calcExpression = String(state.calcResult).replace(/,/g, ''); state.calcFresh = true; }
      catch (error) { state.calcResult = 'Error'; toast(error.message, 'error'); }
    } else if (key === '±') {
      if (state.calcExpression) state.calcExpression = state.calcExpression.startsWith('-') ? state.calcExpression.slice(1) : `-${state.calcExpression}`;
    } else {
      const mapped = ({ '÷': '/', '×': '*', '−': '-', '%': '%' })[key] || key;
      if (state.calcFresh && /[0-9.]/.test(mapped)) { state.calcExpression = ''; state.calcFresh = false; state.calcResult = '0'; }
      state.calcExpression += mapped; state.calcFresh = false;
      try { if (!/[+\-*/%.]$/.test(state.calcExpression)) state.calcResult = formatNumber(evaluateMath(state.calcExpression)); }
      catch { /* expression can be temporarily incomplete */ }
    }
    drawCalculator();
  }
  function formatTimer(seconds) { const m = Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0'); const s = (Math.max(0, seconds) % 60).toString().padStart(2, '0'); return `${m}:${s}`; }
  function updateFocusDisplay() { const time = $('#focusTime'); if (!time) return; time.textContent = formatTimer(state.focusSeconds); $('#focusCaption').textContent = state.focusMode === 'focus' ? 'MINUTES OF FOCUS' : 'A MOMENT TO RESET'; $('#focusStartBtn').textContent = state.focusRunning ? 'Pause session' : (state.focusSeconds === (state.focusMode === 'focus' ? 1500 : 300) ? 'Start focus' : 'Resume session'); $('#focusModeBtn').textContent = state.focusMode === 'focus' ? '5 min break' : '25 min focus'; }
  function toggleFocus() {
    if (state.focusRunning) { state.focusRunning = false; clearInterval(state.focusInterval); state.focusInterval = null; updateFocusDisplay(); return; }
    state.focusRunning = true; updateFocusDisplay();
    state.focusInterval = setInterval(() => {
      state.focusSeconds = Math.max(0, state.focusSeconds - 1); updateFocusDisplay();
      if (state.focusSeconds <= 0) { clearInterval(state.focusInterval); state.focusInterval = null; state.focusRunning = false; toast(state.focusMode === 'focus' ? 'Focus session complete. Take a short break.' : 'Break complete. You’ve got this.'); try { if ('Notification' in window && Notification.permission === 'granted') new Notification('JARVIS Focus', { body: state.focusMode === 'focus' ? 'Focus session complete. Take a short break.' : 'Break complete. Ready to focus again?' }); } catch {} updateFocusDisplay(); }
    }, 1000);
  }
  function resetFocus() { clearInterval(state.focusInterval); state.focusInterval = null; state.focusRunning = false; state.focusSeconds = state.focusMode === 'focus' ? 25 * 60 : 5 * 60; updateFocusDisplay(); }
  function switchFocusMode() { clearInterval(state.focusInterval); state.focusInterval = null; state.focusRunning = false; state.focusMode = state.focusMode === 'focus' ? 'break' : 'focus'; state.focusSeconds = state.focusMode === 'focus' ? 25 * 60 : 5 * 60; updateFocusDisplay(); }

  // Main controls
  $('#newChatBtn').addEventListener('click', () => { if (state.isGenerating) stopGeneration(); makeChat(); closeMobileSidebar(); });
  $('#sendBtn').addEventListener('click', () => sendPrompt());
  $('#stopBtn').addEventListener('click', stopGeneration);
  $('#promptInput').addEventListener('input', autoResizeInput);
  $('#promptInput').addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); sendPrompt(); }
  });
  $('#webToggle').addEventListener('click', () => setWebSearch(!state.settings.webSearch));
  $('#voiceBtn').addEventListener('click', startVoice);
  $('#openSettings').addEventListener('click', openSettings); $('#topSettings').addEventListener('click', openSettings);
  $('#refreshStatus').addEventListener('click', refreshApiStatus);
  $('#saveApiKeyBtn').addEventListener('click', saveSessionApiKey);
  $('#clearApiKeyBtn').addEventListener('click', clearSessionApiKey);
  $('#toggleApiKey').addEventListener('click', () => { const input = $('#apiKeyInput'); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; $('#toggleApiKey').textContent = show ? 'Hide' : 'Show'; });
  $('#apiKeyInput').addEventListener('keydown', event => { if (event.key === 'Enter') saveSessionApiKey(); });
  $('#saveSettingsBtn').addEventListener('click', saveSettings);
  $('#exportAllBtn').addEventListener('click', exportAllChats);
  $('#clearAllBtn').addEventListener('click', () => {
    if (!state.chats.length) { toast('There is no local history to clear.'); return; }
    if (!confirm('Clear every conversation saved in this browser? This cannot be undone. Export a backup first if you need it.')) return;
    if (state.isGenerating) stopGeneration(); state.chats = []; state.activeId = null; persistChats(); renderHistory(); renderActiveChat(); toast('Local conversation history cleared.');
  });
  $('#clearSearch').addEventListener('click', () => { const wrap = $('#historySearchWrap'); wrap.classList.toggle('open'); if (wrap.classList.contains('open')) $('#historySearch').focus(); else { $('#historySearch').value = ''; renderHistory(); } });
  $('#historySearch').addEventListener('input', renderHistory);
  $('#themeToggle').addEventListener('click', () => { state.ambience = !state.ambience; document.body.classList.toggle('soft-ambience', state.ambience); saveJSON(AMBIENCE_KEY, state.ambience); toast(state.ambience ? 'Soft ambience enabled.' : 'Soft ambience disabled.'); });
  $$('.suggestion-card').forEach(card => card.addEventListener('click', () => { $('#promptInput').value = card.dataset.prompt; autoResizeInput(); sendPrompt(); }));
  $$('.nav-item').forEach(item => item.addEventListener('click', () => { if (item.dataset.view === 'chat') { $('#currentPageName').textContent = 'Assistant'; $$('.nav-item').forEach(n => n.classList.toggle('active', n === item)); closeMobileSidebar(); renderActiveChat(); } else if (item.dataset.tool) { closeMobileSidebar(); openUtility(item.dataset.tool); } }));
  $('#chatHistory').addEventListener('click', event => {
    const deleteEl = event.target.closest('[data-delete-chat]');
    if (deleteEl) { event.stopPropagation(); deleteChat(deleteEl.dataset.deleteChat); return; }
    const chatButton = event.target.closest('[data-chat-id]'); if (!chatButton) return;
    state.activeId = chatButton.dataset.chatId; $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === 'chat')); $('#currentPageName').textContent = 'Assistant'; renderActiveChat(); closeMobileSidebar();
  });
  $('#chatHistory').addEventListener('keydown', event => { const deleteEl = event.target.closest('[data-delete-chat]'); if (deleteEl && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); deleteChat(deleteEl.dataset.deleteChat); } });
  function deleteChat(id) {
    const chat = state.chats.find(item => item.id === id); if (!chat) return;
    if (!confirm(`Delete “${chat.title}”?`)) return;
    state.chats = state.chats.filter(item => item.id !== id); if (state.activeId === id) state.activeId = null; persistChats(); renderHistory(); renderActiveChat(); toast('Conversation deleted.');
  }
  $('#messagesView').addEventListener('click', event => {
    const copyCode = event.target.closest('[data-copy-code]');
    if (copyCode) { const code = copyCode.closest('.code-wrap')?.querySelector('pre code')?.innerText || ''; copyText(code); return; }
    const copyMessage = event.target.closest('[data-copy-message]');
    if (copyMessage) { const message = activeChat()?.messages.find(m => m.id === copyMessage.dataset.copyMessage); if (message) copyText(message.content); return; }
    const speak = event.target.closest('[data-speak-message]');
    if (speak) { readAloud(speak.dataset.speakMessage); return; }
    const regen = event.target.closest('[data-regenerate]'); if (regen) regenerate(regen.dataset.regenerate);
  });
  $$('[data-close-modal]').forEach(button => button.addEventListener('click', () => { closeModal('settingsModal'); closeModal('utilityModal'); if (state.currentUtility) { $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === 'chat')); $('#currentPageName').textContent = 'Assistant'; } }));
  $$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => { if (event.target === backdrop) { backdrop.classList.add('hidden'); $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === 'chat')); $('#currentPageName').textContent = 'Assistant'; } }));
  $('#menuToggle').addEventListener('click', openMobileSidebar); $('#mobileOverlay').addEventListener('click', closeMobileSidebar);
  function openMobileSidebar() { $('#sidebar').classList.add('mobile-open'); $('#mobileOverlay').classList.add('visible'); }
  function closeMobileSidebar() { $('#sidebar').classList.remove('mobile-open'); $('#mobileOverlay').classList.remove('visible'); }
  document.addEventListener('keydown', event => {
    const calculatorOpen = !$('#utilityModal').classList.contains('hidden') && state.currentUtility === 'calculator';
    if (calculatorOpen && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (/^[0-9.]$/.test(event.key) || ['+', '-', '*', '/', '%', '(', ')', '^'].includes(event.key)) { event.preventDefault(); handleCalcKey(event.key); }
      else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); handleCalcKey('='); }
      else if (event.key === 'Backspace') { event.preventDefault(); handleCalcKey('⌫'); }
      else if (event.key === 'Delete') { event.preventDefault(); handleCalcKey('AC'); }
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); makeChat(); }
    if (event.key === 'Escape') { closeModal('settingsModal'); closeModal('utilityModal'); closeMobileSidebar(); }
  });
  window.addEventListener('beforeunload', () => { if (state.focusInterval) clearInterval(state.focusInterval); if (state.recognition) state.recognition.stop(); });

  // Initialization
  $('#webToggle').setAttribute('aria-pressed', String(Boolean(state.settings.webSearch)));
  if (state.settings.webSearch) $('#webToggle').classList.add('enabled');
  renderHistory(); renderActiveChat(); refreshApiStatus();
  if (state.chats.length) { state.chats.sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0)); state.activeId = state.chats[0].id; renderHistory(); renderActiveChat(); }
  autoResizeInput();
})();
