# DesiSports V2 — Deployment & Operating Guide

DesiSports V2 is configured for deployment on **Render.com**, **Docker**, or any Node.js hosting platform.

---

## 1. Quick Deploy to Render.com

1. **Push code to GitHub**:
   Ensure all changes are pushed to your repository `https://github.com/mangoman2049/desisports-v2`.

2. **Create New Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) -> **New +** -> **Web Service**.
   - Connect repository `mangoman2049/desisports-v2`.
   - **Environment**: Node
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma db push && node prisma/seed.js && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```

3. **Environment Variables on Render**:
   | Variable | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Required |
   | `DATABASE_URL` | `file:./dev.db` (or Render Postgres URL) | Supports SQLite locally & Postgres in prod |
   | `LITELLM_API_BASE` | `https://your-litellm-proxy.com` | OpenAI-compatible Vision & LLM gateway |
   | `LITELLM_API_KEY` | `sk-...` | Optional if using deterministic fallback |
   | `VISION_MODEL` | `gpt-4o-mini` | Recommended model |

---

## 2. Docker Deployment

To build and run locally with Docker:
```bash
docker build -t desisports-v2 .
docker run -p 3000:3000 -e DATABASE_URL="file:./dev.db" desisports-v2
```
Access at `http://localhost:3000`.

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Push database schema & seed sample data
npx prisma db push
node prisma/seed.js

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Key Pages
- **`/admin` & `/admin/scorecards/new`**: Camera capture, blur/glare quality gate, fast maker-checker review.
- **`/player/35`**: Manish Pandey's complete profile with retained V1 metrics, trends, match history, and granular V3 ball-by-ball dismissal/boundary stats.
- **`/captain`**: 32 initial insights, team lineups, 16-over bowling allocations, and LiteLLM strategic brief.
