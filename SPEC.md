# AI Marketing Suite — SPEC

## Concept & Vision

Plateforme SaaS B2B pour exécuter des skills marketing pilotés par LLM (GLM 5.1 / MiniMax 2.7) en marque blanche. Chaque projet client a son dossier `context/` (marque, produit, audience) et ses `skills/` (SOP marketing). L'UI permet de sélectionner projet + skill + LLM + brief et obtenir un résultat prêt à l'emploi.

## Design Language

- **Aesthetic**: Dark terminal / SaaS dashboard — sobre, professionnel,、高效 (工作效率)
- **Colors**: `#0a0a0a` bg, `#ffffff` text, `#3b82f6` accent (blue), `#22c55e` success, `#ef4444` error
- **Typography**: `Inter` (sans-serif, UI), `JetBrains Mono` (code/output)
- **Motion**: Minimal — transitions 150ms ease-out, pas d'animation décorative
- **Icons**: Lucide icons (cohérent, léger)

## Design Goals

- Interface dense mais lisible (dashboard-like)
- Formes rectangulaires, pas de rounded excessif
- Output généré bien formaté (code blocks, sections)
- Feedback visuel immédiat sur les appels API

## Tech Stack

- **Framework**: SvelteKit + TypeScript
- **Adapter**: `@sveltejs/adapter-vercel`
- **LLM**: GLM 5.1 (Zhipu) + MiniMax 2.7
- **Storage**: filesystem (repo Git) → R2/S3 plus tard
- **Deploy**: Vercel

## Project Structure

```
ai-marketing-suite/
  src/
    routes/
      +layout.svelte
      +page.svelte              # dashboard
      api/
        run-skill/
          +server.ts            # exécution skill + appel LLM
    lib/
      llm.ts                    # callGLM / callMiniMax
      projects.ts               # lecture dossiers projets
  projects/
    innotech-it/
      context/
        brand.md
        product.md
        audience.md
      skills/
        audit.md
        marketing_research.md
        social_content.md
        data_analysis.md
        campaign_presentation.md
  package.json
  svelte.config.js
  tsconfig.json
```

## Features

1. **Dashboard** — sélecteur projet, skill, LLM, textarea brief, bouton Run, zone output
2. **API `/api/run-skill`** — POST avec {project, skillName, llm, input} → charge context + skill → appelle LLM → retourne JSON
3. **Multi-projet** — nouveau dossier = nouveau client (marque blanche)
4. **Logs** — timestamp + projet + skill + LLM + tokens dans la réponse

## API Design

**POST `/api/run-skill`**
```json
// Request
{ "project": "innotech-it", "skillName": "audit", "llm": "minimax", "input": "Audit SEO complet du site" }

// Response 200
{ "project": "innotech-it", "skillName": "audit", "llm": "minimax", "result": "...", "tokens": 1234, "timestamp": "2026-04-20T..." }

// Response 400
{ "error": "Missing project / skillName / llm / input" }

// Response 404
{ "error": "Skill not found: audit" }
```

## LLM Config

| Provider | Model | Endpoint |
|---|---|---|
| GLM | glm-5.1 | `https://api.zhipu.ai/v1/chat/completions` |
| MiniMax | abab6.5s-chat | `https://api.minimax.chat/v1/text/chatcompletion` |

## Environment Variables (Vercel)

- `GLM_API_KEY`
- `MINIMAX_API_KEY`
