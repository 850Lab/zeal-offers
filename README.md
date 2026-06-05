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
- `businessConfig.displayPhone` and `businessConfig.phoneHref`: update the phone number.
- `formSettings.webhookUrl`: add a future webhook, CRM, or lead form endpoint.
- `formSettings.leadSource`: controls the hidden lead source field, currently `direct-mail-qr`.
- `offerPackages`, `beforeAfterServices`, and `trustItems`: update offer copy, service cards, and trust points.

The comparison visuals use lightweight CSS treatments for speed. Replace those blocks in `src/App.jsx` with real image assets when job photos are ready.

## Tracking Hooks

CTA buttons have stable `id` values for analytics and pixel events. Comments are included in `index.html`, `src/App.jsx`, and the quote form submit handler for future QR campaign tracking, Google Analytics, Facebook Pixel, CRM, or webhook integration.
