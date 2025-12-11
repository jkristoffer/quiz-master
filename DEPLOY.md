# Deployment Guide - Vercel

The easiest way to deploy **Quiz Master** is using [Vercel](https://vercel.com).
It connects to your GitHub repo and automatically deploys when you push code.

## 1. Setup

1.  **Push your code** to GitHub.
2.  Log in to **Vercel** and click **"Add New..."** -> **"Project"**.
3.  Import your **Quiz Master** repository.

## 2. Configuration

Vercel might not auto-detect Expo Web export settings immediately. Ensure these settings are correct:

- **Framework Preset**: `Other` (or `Expo` if available)
- **Build Command**: `npm run build:web`
  - _Alternatively_: `npx expo export -p web`
- **Output Directory**: `dist`
  - _Note_: Do **NOT** use `web-build`. Expo Router uses `dist`.

## 3. Deploy

Click **Deploy**.
Vercel will run the build script and serve the `dist/` folder globally.

---

## Troubleshooting

- **404 on Reload**: If refreshing a deep link (e.g., `/quiz/1`) gives a 404, you need a `vercel.json` rewrite rule for Single Page Apps (SPA).
  - _Note_: Expo Router usually handles this via `dist/index.html` as the entry point, but if issues persist, add a rewrite to `index.html`.
