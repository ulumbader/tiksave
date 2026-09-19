# TikSave - Development Changelog

## Project Overview
TikTok Video & MP3 Downloader Web App
Stack: Next.js 14, TypeScript, Tailwind CSS
Design: Neo-Brutalist style
Colors: Background #F5F5E8, Lime #CAFF00, Pink #FF2D78, Black #1A1A1A
Font: Use Google Fonts - "Syne" for headlines, "DM Sans" for body

## Status
- [x] PHASE 1: Global styles & layout
- [x] PHASE 2: Hero section + URL input
- [x] PHASE 3: Download result card
- [x] PHASE 4: How It Works section
- [x] PHASE 5: FAQ section
- [x] PHASE 6: API route /api/download
- [x] PHASE 7: Download handler (video + mp3)

## Component Registry
- globals.css updated
- layout.tsx updated
- HeroSection.tsx with props: onDownload(url, format)
- FormatCard.tsx with props: loading, videoData, format, onClose
- HowItWorks.tsx
- FAQSection.tsx
- Footer.tsx
- API /api/download - POST, body: {url, format}
- types/video.ts - VideoData interface

Note: API route now calls real RapidAPI /media endpoint, logging raw response
MVP complete. RapidAPI integration wired. Response mapping still pending.
Integration complete. API response mapped, FormatCard now shows real video data.
Note: next.config.ts updated with COOP/COEP headers for FFmpeg WASM
Note: MP3 conversion implemented client-side via FFmpeg WASM
MP3 feature complete.
Note: image proxy route added for TikTok thumbnail/avatar compatibility under COEP/COOP
