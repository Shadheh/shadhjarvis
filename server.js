import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const ALLOWED_MODELS = new Set(['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.4-nano']);
const DEFAULT_MODEL = ALLOWED_MODELS.has(process.env.OPENAI_MODEL) ? process.env.OPENAI_MODEL : 'gpt-5.5';
const SYSTEM_BASE = `You are JARVIS, a capable, polished, warm, and precise personal AI assistant. Be useful, proactive, and honest. Prefer clear structure and actionable answers. Do not claim to have performed actions outside the tools or browser features actually available to you. If asked to control the user's device, explain the permission or integration needed rather than pretending. Use Markdown when helpful. Adapt to the user's language and level. When web search is enabled, use it for current information and cite sources with links in your answer when possible.`;

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  next();
});
app.use(express.json({ limit: '1mb' }));

// Small in-memory per-IP throttle to discourage accidental rapid-fire requests.
const requestBuckets = new Map();
function rateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'local';
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 30;
  let bucket = requestBuckets.get(key);
  if (!bucket || now - bucket.start > windowMs) bucket = { start: now, count: 0 };
  bucket.count += 1;
  requestBuckets.set(key, bucket);
  if (bucket.count > maxRequests) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }
  next();
}

app.get('/api/status', (_req, res) => {
  res.json({
    configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here'),
    defaultModel: DEFAULT_MODEL,
    models: [...ALLOWED_MODELS],
    version: '1.0.0'
  });
});

app.post('/api/chat', rateLimit, async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    res.status(503).json({ error: 'OpenAI API is not configured yet. Add OPENAI_API_KEY to your .env file and restart JARVIS.' });
    return;
  }

  const { messages, model, webSearch, systemPrompt } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Please send a message first.' });
    return;
  }

  const safeMessages = messages.slice(-32).map((message) => {
    const role = ['user', 'assistant'].includes(message?.role) ? message.role : null;
    const content = typeof message?.content === 'string' ? message.content.slice(0, 12000) : '';
    if (!role || !content.trim()) return null;
    return { role, content };
  }).filter(Boolean);

  if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'The latest conversation message must be from you.' });
    return;
  }

  const selectedModel = ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL;
  const customInstructions = typeof systemPrompt === 'string' ? systemPrompt.trim().slice(0, 1800) : '';
  const instructions = customInstructions ? `${SYSTEM_BASE}\n\nPersonalization requested by the user (follow when compatible with safety and accuracy):\n${customInstructions}` : SYSTEM_BASE;
  const controller = new AbortController();
  let clientClosed = false;

  req.on('aborted', () => {
    clientClosed = true;
    controller.abort();
  });
  res.on('close', () => {
    if (!res.writableEnded) {
      clientClosed = true;
      controller.abort();
    }
  });

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const send = (event, data) => {
    if (!clientClosed && !res.destroyed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const client = new OpenAI({ apiKey });
    const stream = await client.responses.create({
      model: selectedModel,
      instructions,
      input: safeMessages,
      tools: webSearch === true ? [{ type: 'web_search' }] : undefined,
      stream: true,
      store: false,
      max_output_tokens: 2400
    }, { signal: controller.signal });

    for await (const event of stream) {
      if (clientClosed) break;
      if (event.type === 'response.output_text.delta') send('delta', { text: event.delta });
      if (event.type === 'response.completed') send('done', { responseId: event.response?.id, model: selectedModel });
      if (event.type === 'response.failed') {
        const message = event.response?.error?.message || 'The model could not complete the response.';
        send('error', { error: message });
      }
    }
    if (!clientClosed && !res.writableEnded) res.end();
  } catch (error) {
    if (clientClosed || error?.name === 'AbortError' || error?.name === 'APIUserAbortError') {
      if (!res.writableEnded) res.end();
      return;
    }
    console.error('[JARVIS API]', error?.status || '', error?.message || error);
    let message = 'Something went wrong while talking to the AI. Please try again.';
    let status = error?.status || 502;
    if (status === 401) message = 'The API key was rejected. Check OPENAI_API_KEY in your .env file.';
    else if (status === 429) message = 'API rate limit or billing limit reached. Check your OpenAI API account and try again later.';
    else if (status === 400) message = 'The selected model or request is not available for this API key. Try another model in Settings.';
    else if (status === 403) message = 'Your API account does not have access to this model or tool.';
    send('error', { error: message });
    if (!res.writableEnded) res.end();
  }
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
app.get('/{*path}', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  JARVIS Studio is ready → http://localhost:${PORT}\n  OpenAI API key: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here' ? 'configured' : 'not configured (add it to .env)'}\n`);
});
