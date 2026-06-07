# Zeal Power Washing Landing Page

Mobile-first React + Vite landing page for Zeal Power Washing LLC direct mail QR traffic.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Replaceable Content

Most campaign content lives in `src/data/landingPage.js`:

- `businessConfig.logoSrc`: add a logo URL or imported asset path.
- `businessConfig.videoSrc`: add a self-hosted video URL.
- `businessConfig.videoPosterSrc`: add a video poster image URL.
- `businessConfig.displayPhone`, `businessConfig.phoneHref`, and `businessConfig.textHref`: update the phone and SMS links.
- `formSettings.webhookUrl`: add a future webhook, CRM, or lead form endpoint.
- `formSettings.leadSource`: controls the hidden `lead_source` field, currently `direct_mail_qr`.
- `formSettings.landingPage`: controls the hidden `landing_page` field, currently `launch_offer`.
- `propertyDetailOptions`: update the checkbox prompts shown in the quote form.
- `offerPackages`, `beforeAfterServices`, and `trustItems`: update offer copy, service cards, and trust points.

The comparison visuals use lightweight CSS treatments for speed. Replace those blocks in `src/App.jsx` with real image assets when job photos are ready.

## Tracking Hooks

GA4 is loaded from `VITE_GA_MEASUREMENT_ID`. In Vercel, add:

```bash
VITE_GA_MEASUREMENT_ID=G-DRRCR08C3Q
```

Analytics code lives in `src/utils/analytics.js`. It tracks the QR landing view, call/text/quote clicks, offer clicks, quote form submission, and persisted URL attribution parameters: `utm_source`, `utm_medium`, `utm_campaign`, `neighborhood`, and `offer`.

Comments are included in `index.html`, `src/App.jsx`, and `src/utils/analytics.js` for future Google Tag Manager, Meta Pixel, CRM, or webhook integration.

## Address Autocomplete

Address autocomplete uses Google Places when this Vercel environment variable is present:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
```

If the key is missing or Places is unavailable, the address field still works as a normal address input.

If suggestions do not appear on the live site, confirm:

- The Vercel project was redeployed after adding `VITE_GOOGLE_MAPS_API_KEY`.
- The Google Cloud key has **Maps JavaScript API** and **Places API** enabled.
- Any HTTP referrer restrictions include the production domain and Vercel preview domains.
