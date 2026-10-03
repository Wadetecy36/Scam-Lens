# ScamLens Pages Audit

This document maps out all the pages and views required for the production app, along with their current status in the repository.

## 1. Core User Flows
- **Home / Landing Page** (/): **Existing** (src/pages/LandingPage.tsx)
- **Base Input Selection** (/analyze): **Existing** (src/pages/AnalyzePage.tsx)
- **Input Flows:**
  - Message Analysis (/analyze/message): **Existing** (src/pages/MessageAnalyzePage.tsx)
  - Image Analysis (/analyze/image): **Existing** (src/pages/ImageAnalyzePage.tsx)
  - URL Analysis (/analyze/url): **Existing** (src/pages/UrlAnalyzePage.tsx)
  - Call/Audio Analysis (/analyze/call): **Existing** (src/pages/CallAnalyzePage.tsx)
- **Loading State**: **Needs review** (Currently handled via component state; may need dedicated loading skeletons/pages)
- **Results View** (/result/:id): **Existing** (src/pages/ResultPage.tsx)
- **Scan History** (/history): **Existing** (src/pages/HistoryPage.tsx)

## 2. Information & Education
- **How it Works** (/how-it-works): **Existing** (src/pages/HowItWorksPage.tsx)
- **Scams Index / Learn** (/learn): **Existing** (src/pages/LearnPage.tsx)
- **FAQ** (/faq): **Missing** (Not implemented or mapped in router)
- **About** (/about): **Existing** (src/pages/AboutPage.tsx)

## 3. Legal & Support
- **Privacy Policy** (/privacy): **Existing** (src/pages/PrivacyPage.tsx)
- **Terms of Service** (/terms): **Existing** (src/pages/TermsPage.tsx)
- **Contact** (/contact): **Existing** (src/pages/ContactPage.tsx)

## 4. Account & Settings
- **Settings** (/settings): **Existing** (src/pages/SettingsPage.tsx)
- **Family Plans** (/family): **Existing** (src/pages/FamilyPage.tsx)

## 5. System & Error States
- **404 Not Found** (/404 or /*): **Existing** (src/pages/NotFoundPage.tsx)
- **500 General Error**: **Missing** (Needs global React ErrorBoundary or dedicated 500 page)
- **Offline Page**: **Needs review** (Service worker sw.js falls back to /. Consider dedicated offline UX)

## 6. Public Assets & SEO
- **robots.txt**: **Existing** (public/robots.txt)
- **sitemap.xml**: **Existing** (public/sitemap.xml)
- **manifest.webmanifest**: **Existing** (public/manifest.webmanifest)
- **llms.txt**: **Existing** (public/llms.txt)
