# Cert Prep by the Cyber Ninja — CompTIA A+ & Network+ Study Site

## What this project is
A study website for CompTIA A+ and Network+ students (complete beginners, no IT background).
Built stage by stage as a learning project — both to teach students AND to learn Claude Code.

## ⚠️ CRITICAL: API KEY SECURITY — READ BEFORE GOING LIVE
**NEVER put the Claude API key directly in any HTML, JS, or CSS file.**
**NEVER push an API key to GitHub — the repo is public.**

If you see anything like this in the code, STOP and flag it immediately:
```
apiKey: "sk-ant-..."
Authorization: "Bearer sk-ant-..."
ANTHROPIC_API_KEY = "sk-ant-..."
```

The correct approach is a **Cloudflare Worker** (free) that sits between
the browser and the Anthropic API. The API key lives only in the Worker's
environment variables — never in the frontend code.

**Before any `git push` to main, always run this check:**
```bash
grep -r "sk-ant" .
```
If that command returns anything, DO NOT push. Remove the key first.

---

## Hosting & Deployment
- **Platform**: GitHub Pages (free, public repo)
- **Live URL**: https://yourusername.github.io/certprep  ← update this once live
- **Branch**: main (GitHub Pages serves from the main branch root)

### How GitHub Pages works (learn this once, use it everywhere)
1. You push code to GitHub
2. GitHub automatically serves your HTML files as a live website
3. index.html becomes your homepage
4. No server needed — it's "static hosting"

### First-time setup (do this once)
```bash
# 1. Create a repo on github.com called: certprep
# 2. Connect your local folder to it
git init
git remote add origin https://github.com/yourusername/certprep.git

# 3. Then go to: repo → Settings → Pages
#    Set Source to: Deploy from a branch
#    Set Branch to: main / (root)
#    Click Save — site goes live in about 60 seconds
```

### Deploy to production (do this every time you want to publish changes)
```bash
git add .
git commit -m "describe what you changed"
git push origin main
```

### ⚠️ API proxy setup (do this before the quiz engine goes live)
The Claude API calls must go through a Cloudflare Worker, not the browser directly.

**Worker is live:**
```
https://comptidda.kemar-k-hinds.workers.dev
```
Use this URL in quiz.html wherever the frontend needs to call the Claude API.
The API key lives only in Cloudflare's environment variables — never in the frontend.

---

## Git workflow (use this on every project)

### The golden rule
`main` branch = working, live code only.
All new features are built on their own branch, then merged in when ready.

### Branch naming
```
feature/quiz-engine
feature/flashcards
feature/network-diagram
feature/progress-dashboard
feature/mini-games
```

### Daily workflow
```bash
# Start a new feature
git checkout -b feature/quiz-engine

# Save your work as you go
git add .
git commit -m "add topic selector to quiz page"

# When the feature is done and tested, merge into main
git checkout main
git merge feature/quiz-engine -m "Merge quiz engine feature"
git push origin main

# Clean up the old branch
git branch -d feature/quiz-engine
```

### Check what's going on at any time
```bash
git status          # what files have changed
git log --oneline   # history of commits
git branch -a       # list all branches
```

---

## File structure
```
certprep/
├── index.html          # Landing page — intro, topic selector, links to tools
├── quiz.html           # AI-powered practice questions (A+ and Network+)
├── flashcards.html     # Spaced repetition flashcard decks
├── games.html          # Mini-games: port matching, OSI sorter, hardware ID
├── progress.html       # Student progress dashboard and streak tracker
├── CLAUDE.md           # This file — Claude Code reads it every session
└── .gitignore          # Files Git should never track (see below)
```

### .gitignore — always have this file
Create a file called `.gitignore` in your project root with:
```
.env
.env.local
*.env
node_modules/
.DS_Store
.netlify/
```
This stops secret files and junk from ever being committed to GitHub.

---

## Tech stack (plain English)
| What | Tool | Why |
|------|------|-----|
| Pages | HTML files | Simple, no build step needed |
| Styling | CSS (embedded in each HTML file) | Beginner friendly |
| Interactivity | Vanilla JavaScript | No frameworks to learn yet |
| AI questions | Claude API via Cloudflare Worker | API key stays secret |
| Fonts | Google Fonts CDN | Free, loads from a link |
| Hosting | GitHub Pages | Free static hosting |
| API proxy | Cloudflare Workers | Keeps API key out of browser |

---

## Design system
**Theme: Dark.** Black background, dark card surfaces, light text.
Change colours here first, then find-and-replace in the HTML.

| Token | Hex | Usage |
|-------|-----|-------|
| Primary blue | `#3b82f6` | Buttons, active states, highlights |
| Primary hover | `#2563eb` | Button hover |
| Background | `#09090b` | Page background (near-black) |
| Surface | `#18181b` | Cards, panels |
| Surface hover | `#1f1f23` | Card on hover |
| Text primary | `#fafafa` | Headings, body |
| Text secondary | `#a1a1aa` | Subtitles, hints |
| Border | `#27272a` | Card borders, dividers |
| Success green | `#16a34a` | Correct answers |
| Error red | `#dc2626` | Wrong answers |
| Accent — A+ Core 1 (220-1201) | `#3b82f6` (bg: rgba 15%) | Core 1 badge/button |
| Accent — A+ Core 2 (220-1202) | `#8b5cf6` (bg: rgba 15%) | Core 2 badge/button |
| Accent — Network+ | `#10b981` (bg: rgba 15%) | Network+ badge/button |

### Typography
- **Font**: DM Sans (Google Fonts) — clean, modern, friendly for learners
- **Heading weight**: 700
- **Body weight**: 400
- **Letter spacing**: -0.01em on headings

### Corner radii
- Buttons: `8px`
- Cards: `12px`
- Tags/badges: `6px`

---

## Build stages (work through these in order)

### Stage 1 — Static foundation (Week 1–2)
**Skills you learn**: HTML structure, CSS styling, basic JavaScript
**What to build**: Landing page + topic selector + first static quiz
**Claude Code prompt to start**:
> "Build a clean landing page for CertPrep, a CompTIA A+ and Network+ study site
> for beginners. Include a header with the site name, a tagline, and two large
> cards — one for A+ and one for Network+ — each with a short description and
> a Start Studying button. Use the design system in my CLAUDE.md."

### Stage 2 — AI question engine (Week 3–4)
**Skills you learn**: APIs, fetch, JSON, async JavaScript, Cloudflare Workers
**What to build**: Dynamic questions generated by Claude API with explanations
**⚠️ Set up the Cloudflare Worker BEFORE writing any API code**
**Claude Code prompt to start**:
> "Set up a Cloudflare Worker to proxy Claude API requests so my API key
> never appears in the browser. Then build a quiz page where students pick
> a topic and get 5 multiple choice questions with detailed explanations."

### Stage 3 — Visual learning tools (Week 5–6)
**Skills you learn**: SVG, Canvas API, drag-and-drop
**What to build**: Network diagram builder + OSI layer visualizer
**Claude Code prompt to start**:
> "Build an interactive network diagram tool where students drag and drop
> routers, switches, and PCs onto a canvas and connect them with lines.
> Label each device. This is for CompTIA Network+ beginners."

### Stage 4 — Flashcards & mini-games (Week 7–8)
**Skills you learn**: Local storage, timers, game logic
**What to build**: Spaced repetition flashcards + port/protocol matching game
**Claude Code prompt to start**:
> "Build a flashcard system with spaced repetition for CompTIA A+ terms.
> Cards the student gets wrong come back sooner. Save progress using
> localStorage so it persists between sessions."

### Stage 5 — Progress dashboard (Week 9–10)
**Skills you learn**: Data visualisation, charts, simple backend concepts
**What to build**: Score history, weak topic tracking, streak counter
**Claude Code prompt to start**:
> "Build a progress dashboard that shows a student's quiz scores over time,
> which CompTIA topics they are weakest in, and a daily streak counter.
> Use localStorage for data storage."

### Stage 6 — Polish & launch (Week 11–12)
**Skills you learn**: Responsive design, performance, real deployment
**What to build**: Mobile-friendly, fast, shareable with students
**⚠️ Run the API key check before this stage:**
```bash
grep -r "sk-ant" .
```

---

## Common tasks

### Add a new quiz topic
Find `.topic-grid` in `quiz.html` and add a new `.topic-card` element.

### Change the primary colour
```bash
# Find all uses of the primary blue
grep -r "2563eb" .
# Then replace with your new colour
```

### Update the Claude model being used
Search for `claude-sonnet` in the Worker code and update the model string.

### Test locally before pushing
Open `index.html` directly in your browser. For pages that use the API,
you need a local server. Ask Claude Code: *"How do I run a local server
for this project?"*

---

## Coding preferences
Tell Claude Code to always follow these when writing code for this project:

- Add comments explaining what each section does — this is a learning project
- Explain any new concept before writing the code for it
- Prefer simple, readable code over clever one-liners
- Use the design system colours and fonts defined above
- Always check: could a student's parent with no IT knowledge understand this UI?
- Mobile-first — test how it looks on a phone, not just a desktop

---

## Learning checkpoints
After each stage, ask Claude Code:
> "Explain what we just built in plain English so I understand it well
> enough to build something similar on my own."

This one habit will make everything click faster than anything else.
