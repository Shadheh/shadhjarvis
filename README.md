# JARVIS Studio — Vercel + Bring Your Own API Key

A static, responsive personal AI workspace with a premium OLED-inspired interface. Deploy directly to Vercel; no local Node server and no Vercel environment variable are required. Each visitor supplies their own OpenAI API key inside Settings.

## Features

- Streaming AI chat using the OpenAI Responses API
- Optional OpenAI web search tool (requires API access and may incur extra usage costs)
- Model selector (availability depends on your OpenAI API account)
- API key field inside the website; key is held in `sessionStorage` for the current tab session only
- Key is sent directly from the browser to OpenAI and is not sent to the Vercel app/server
- Conversation history, chat search, delete and JSON backup export
- Custom assistant instructions
- Browser voice dictation and text-to-speech read-aloud where supported
- Quick notes, calculator, focus timer and local commands (`/time`, `/date`, `/calc`, `/help`)
- Copy messages/code, regenerate responses, stop generation, responsive layout and installable app shell

## Deploy to Vercel

### Option A: Vercel dashboard

1. Download and extract this project ZIP.
2. Put the contents of the `jarvis-web` folder into a GitHub repository.
3. In Vercel, choose **Add New → Project**, import that repository, and deploy.
4. Framework preset: **Other**. Build command: leave empty. Output directory: `public`.
5. Open the deployed URL, open **Settings**, paste your own OpenAI API key, and select **Use for this session**.

### Option B: Vercel CLI

From the project folder, run `npx vercel` and follow the prompts. The `vercel.json` config sets `public` as the static output directory.

## API key and billing notes

- Create an API key in your OpenAI API platform account. A ChatGPT subscription is separate from API billing.
- The key is stored in the current tab's `sessionStorage`, not `localStorage`, and is cleared when that tab's session ends. Use **Forget key** to remove it sooner.
- The browser sends requests directly to `https://api.openai.com/v1/responses`. Vercel does not receive or store the key. The key is still available to the browser itself, so use this only on a trusted device and never paste a key into a public/shared computer.
- OpenAI's API may change which models your account can access. If the selected model is unavailable, choose another model supported by your API account.
- Web search availability and pricing depend on your API account and current OpenAI API terms.
- Direct browser requests require the OpenAI API endpoint to permit the browser's CORS request. If the browser blocks it, this direct BYOK design cannot work in that browser; the alternative is a server-side API proxy, which requires a server secret or a separate authenticated key-vault design.

## Privacy / limitations

Chat history and notes are stored locally in the browser. This app does not provide user accounts or cloud-synced chat history. Session storage is tab-session scoped, but browser restore behavior may vary. The API key is sent to OpenAI for each request; follow OpenAI's current API data policies.
