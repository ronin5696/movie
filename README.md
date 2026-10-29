# WatchRelax — Relaxing Movie Trailer Hub & Traffic Funnel (`watchrelax.site`)

A high-performance Next.js entertainment curation platform designed to capture high-intent referral traffic via studio-quality official trailers and legal streaming metadata, cleanly routing qualified users to your monetized Google AdSense editorial website.

---

## Architecture & Tech Stack

- **Framework:** Next.js (App Router, no `/src` directory)
- **Styling:** Tailwind CSS v3 (Cinematic dark theme)
- **Hosting & CDN:** AWS Amplify Hosting (with Amazon CloudFront Edge)
- **APIs:** The Movie Database (TMDB) API & JustWatch stream provider data
- **AI Engine:** Amazon Bedrock (Meta Llama 3.3 70B via `@aws-sdk/client-bedrock-runtime`)
- **SEO & Discover:** Google Discover optimization via `'max-image-preview': 'large'` and dynamic sitemaps.

---

## 4 Core Pipelines Implemented

1. **Edge Geolocation Middleware (`middleware.js`):**
   - Automatically inspects CloudFront headers (`cloudfront-viewer-country`, `x-amz-cf-header-country`).
   - Silently rewrites or redirects un-localized visitors to country-specific structures (e.g., `/{country}/movie/{id}`).
   - Ensures users receive regional legal streaming providers (Netflix, Disney+, Prime Video, Tubi) for their country.

2. **Zero-Image-Cost Movie Presentation (`app/[country]/movie/[id]/page.jsx`):**
   - Directly leverages official studio backdrops from TMDB CDNs without incurring generative image costs.
   - Embeds fast, responsive official YouTube trailers via `youtube-nocookie.com`.
   - Embeds categorized legal watch providers: Subscription, Free with Ads, and Digital Rent/Buy.
   - Embeds a prominent, high-intent call-to-action button bridging engaged visitors to your AdSense editorial website (*"Read the Ending Explained & Hidden Secrets"*).

3. **Autonomous Trend & Hook Engine (`app/api/cron-generate/route.js`):**
   - Secured endpoint guarded by `CRON_SECRET`.
   - Queries TMDB's daily trending movies.
   - Pings Amazon Bedrock (Meta Llama 3.3 70B) to generate curiosity-gap burning questions and discussion prompts.
   - Generates ready-to-post social media hijacking payloads for Reddit, X, and TikTok.
   - Automatically pings Google Search Console for rapid sitemap re-indexing.

4. **Google Discover & SEO Optimization (`app/layout.jsx`, `app/sitemap.js`, `app/robots.js`):**
   - Enforces `'max-image-preview': 'large'` required for Google Discover hero cards.
   - Dynamic sitemap generating fresh URLs for trending movies across top geographic regions (`us`, `gb`, `ca`, `in`, `au`).
   - Comprehensive `Movie` and `VideoObject` Schema.org JSON-LD structured data.

---

## Quick Start (Local Development)

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API keys:
```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_ACCESS_TOKEN=your_v4_bearer_token
CRON_SECRET=your_custom_secret_key
NEXT_PUBLIC_EDITORIAL_SITE_URL=https://your-editorial-adsense-site.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Amazon Bedrock (if running locally without AWS IAM credentials)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to AWS Amplify Hosting

1. Push this repository to GitHub.
2. In the AWS Management Console, navigate to **AWS Amplify** -> **Deploy an app** -> **GitHub**.
3. Select this repository and the `main` branch.
4. Amplify will automatically detect the build settings via [`amplify.yml`](file:///Users/samir/movie%20site/amplify.yml).
5. In **App settings** -> **Environment variables**, add:
   - `TMDB_API_KEY`
   - `TMDB_READ_ACCESS_TOKEN`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_EDITORIAL_SITE_URL`
   - `NEXT_PUBLIC_SITE_URL`
6. Under **Service Role**, assign an IAM role with `bedrock:InvokeModel` permissions to allow Bedrock Llama 3.3 70B execution without hardcoding keys.
7. Click **Save and Deploy**.

---

## Setting Up the Automated Daily Cron

You can automate the trend engine using [Cron-Job.org](https://cron-job.org) or GitHub Actions:

### Via Cron-Job.org (Free):
- **URL:** `https://your-domain.com/api/cron-generate`
- **Schedule:** Every 6 or 12 hours
- **HTTP Header:** `Authorization: Bearer <YOUR_CRON_SECRET>`
