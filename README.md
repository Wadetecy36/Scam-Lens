# 🛡️ ScamLens

**Before you click, check.**  
A calm, trustworthy, public-service scam detection tool designed for families, older adults, and small business owners.

[![Tests](https://img.shields.io/badge/tests-82%20passed%20(100%25)-success?style=flat-square)](file:///server/risk/pipeline-benchmark.test.ts)
[![React](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite%208-blue?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript%20Strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/backend-Node.js%20HTTP%20API-green?style=flat-square)](https://nodejs.org/)

---

## 🔍 What is ScamLens?

ScamLens helps everyday people verify suspicious SMS messages, WhatsApp chats, fake bank statements, payment receipts, links, and phone calls before they reply, pay, or share private details.

Built with a calm, accessible "public information service" aesthetic, ScamLens removes technical jargon and translates risks into plain, practical advice for the whole family.

---

## ✨ Key Features

### 1. Dual-Layer Analysis Engine
- **Deterministic Risk Engine**: Fast, local rules with zero latency that evaluate known fraud indicators, math mismatches, and deceptive tactics.
- **AI Evidence Synthesis**: Integrated with Google Gemini to analyze nuanced social engineering, pretexting, and unfamiliar linguistic patterns.
- **Calibrated Risk Scores**: Clear classification tiers (**LOW**, **CAUTION**, **SUSPICIOUS**, **HIGH**) with hard tripwires for immediate escalation.

### 2. Specialized Mobile Money & Regional Protections
- **MoMo Fake Reversals**: Detects bogus transfer messages claiming "mistaken" funds.
- **Cash-Out & Authorization Prompts**: Alerts users immediately when asked to enter a wallet PIN or approve prompts.
- **SIM Deactivation Threats**: Catches fake telecom warnings threatening service shutoffs.
- **Recruitment & Protocol Fees**: Flags fraudulent government and agency enlistment schemes.

### 3. Bank Statement & Receipt Invariant Auditing
- Mathematical reconciliation of starting balance, inflows, outflows, and ending balance.
- Detection of synthetic document disclaimers (*"for testing purposes only"*, *"fictional entity"*).
- Routing transit number ABA Mod-10 checksum validation.

### 4. Privacy & Defense by Design
- **Local PII Redaction**: Automatically scrubs phone numbers, bank accounts, credit cards (Luhn-checked), Ghana Card IDs, and credentials *before* anything leaves the server for third-party AI analysis.
- **Prompt Injection Shielding**: Pre-flight regex heuristics and XML tag isolation prevent malicious attackers from hijacking or overriding the safety evaluator.
- **Denial-of-Wallet Rate Limiting**: Built-in IP rate limiter (10 requests/min) prevents API quota exhaustion while allowing automated test bypass.
- **Zero Credential Harvesting**: ScamLens never asks for or stores passwords, PINs, or private keys.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone & Install

```bash
git clone https://github.com/Wadetecy36/Scam-Lens.git
cd Scam-Lens
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Ensure your `.env` (or `server/.env`) has your Gemini API key configured:

```env
PORT=3001
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-3.5-flash-lite
```

### 3. Run the Development Stack

In two separate terminals:

**Terminal 1 — Backend API Server:**
```bash
npm run server
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend Client:**
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 🧪 Testing & Verification

ScamLens maintains 100% automated test coverage across all fraud detection pipelines, PII scrubbing, and security controls:

```bash
# Run all 82 unit, integration, and benchmark tests
npm test

# Run type check across frontend and backend
npx tsc -b

# Build production client bundle
npm run build
```

---

## 📂 Project Structure

```
Scam-Lens/
├── server/                    # Node.js backend API
│   ├── middleware/            # Rate limiting & security middleware
│   ├── privacy/               # PII redactor (scrubs phones, cards, IDs)
│   ├── providers/             # Gemini API integration with XML boundaries
│   ├── risk/                  # Deterministic risk engine, scorers & benchmarks
│   ├── routes/                # POST /api/analyze with injection heuristics
│   └── index.ts               # HTTP server entry point
├── src/                       # React 19 Frontend
│   ├── ai/                    # Schema types, validators & prompt templates
│   ├── components/            # Accessible UI primitives & layout
│   ├── pages/                 # Analysis input flows, landing & result views
│   └── services/              # API client & session storage
└── public/                    # Static brand assets & photography
```

---

## 🔒 Privacy & Safety Notice

ScamLens is an advisory second-opinion tool. It evaluates incoming messages for common patterns of deception but cannot guarantee that any communication is completely safe. Always verify unexpected financial requests directly with your bank or service provider through official, trusted channels.

---

**License**: MIT  
**Maintained by**: [Trinity](https://github.com/Wadetecy36)
