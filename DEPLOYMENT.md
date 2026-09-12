# DesiSports V2 — Deployment & Operating Guide

DesiSports V2 is configured for deployment on **Render.com**, **Docker**, or any Node.js hosting platform.

---

## 1. Quick Deploy to Render.com

You can deploy **DesiSports V2** to Render in less than 3 minutes using either the **Web Service UI** or the **1-Click Blueprint**.

### Method A: Web Service (Recommended, Free)

1. **Log in to Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click **"New +"** (top right) $\rightarrow$ select **"Web Service"**.

2. **Connect Repository**:
   - Choose **"Build and deploy from a Git repository"**.
   - Connect your GitHub account and select:
     `mangoman2049/desisports-v2` (or enter `https://github.com/mangoman2049/desisports-v2`).

3. **Configure Service Settings**:
   - **Name**: `desisports-v2` (or your preferred name)
   - **Region**: `Oregon (US West)` or closest to you (e.g. Frankfurt / Singapore)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma db push && npm run db:seed && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free` ($0/mo)

4. **Add Environment Variables**:
   Under the **Environment Variables** section, add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Required |
   | `DATABASE_URL` | `file:./dev.db` | Runs embedded SQLite with 0 config |
   | `VISION_MODEL` | `gpt-4o-mini` | Default OCR vision model |
   | `LITELLM_API_BASE` | *(optional)* | e.g. `https://your-litellm-proxy.com/v1` |
   | `LITELLM_API_KEY` | *(optional)* | Your API key (falls back to deterministic engine if blank) |

5. **Click "Deploy Web Service"**:
   - Render will clone the repository, install dependencies, generate Prisma, initialize and seed the SQLite database with all 48 tournament players and 7 matches, seed the full 11-section tactical analyses, and build Next.js.
   - Within 2-3 minutes, you will receive a live public HTTPS URL:
     👉 `https://desisports-v2.onrender.com`

---

### Method B: 1-Click Blueprint (`render.yaml`)

Because this repository already contains [`render.yaml`](file:///C:/Users/milan/.gemini/antigravity/scratch/desisports-v2/render.yaml):
1. In Render Dashboard, click **"New +"** $\rightarrow$ select **"Blueprint"**.
2. Select your repository `mangoman2049/desisports-v2`.
3. Render will parse `render.yaml` automatically with all pre-configured build steps and environment variables.
4. Click **"Apply"** to deploy.

---

### Method C: Persistent Disk (Optional for Permanent Storage)

On Render's Free tier, the filesystem is ephemeral and re-seeds on every deploy. If you want newly uploaded scorecards to persist permanently across restarts:
1. Upgrade the web service to the **Starter** plan ($7/mo).
2. Go to **Disks** in your service sidebar $\rightarrow$ **Add Disk**.
   - **Name**: `data`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB`
3. Update the `DATABASE_URL` environment variable to:
   ```
   file:/var/data/dev.db
   ```
4. Save changes and redeploy.

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
