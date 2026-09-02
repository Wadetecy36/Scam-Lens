# SCAMLENS
## Parent-Focused AI Scam Safety Platform
### Foundation + Architecture Build Specification

You are a senior full-stack product engineer, UX architect, security engineer, SEO engineer, and SaaS product strategist.

Your task is to build the production-grade foundation for **ScamLens**, a parent-focused AI scam detection and digital safety web application.

This is NOT a generic AI chatbot.

This is NOT merely a cybersecurity dashboard.

This is NOT a tool designed primarily for technical users.

ScamLens is designed around one simple idea:

> "Before you click, check."

The target user is a parent, older adult, or less technically confident internet user who receives a suspicious message, screenshot, URL, email, offer, or online request and wants to know:

1. Is this suspicious?
2. Why is it suspicious?
3. What should I do?
4. Can someone I trust help me decide?

The application should make online safety understandable without requiring cybersecurity knowledge.

---

# 1. PRODUCT VISION

ScamLens acts as a safety layer between users and potentially dangerous digital interactions.

Core workflow:

INPUT
↓
ANALYZE
↓
RISK SCORE
↓
EXPLAIN
↓
RECOMMEND ACTION
↓
OPTIONALLY ASK A TRUSTED PERSON

Primary inputs:

- pasted text
- WhatsApp/SMS messages
- emails
- suspicious URLs
- uploaded screenshots
- images containing suspicious messages
- user-described phone calls or conversations

The MVP must focus on making this workflow exceptionally clear.

---

# 2. PRIMARY USER

Primary audience:

- parents
- older adults
- less technically confident users
- family members helping parents stay safe online

Secondary audience:

- children helping parents
- caregivers
- family members
- community organizations
- schools
- digital-safety organizations

The interface must feel:

- trustworthy
- calm
- simple
- readable
- accessible
- non-technical
- modern
- premium
- reassuring without creating false confidence

DO NOT make the interface look like a hacker terminal.

DO NOT use unnecessary cybersecurity clichés.

DO NOT overload users with technical terminology.

---

# 3. CORE PRODUCT PRINCIPLE

Every analysis must answer:

### WHAT HAPPENED?

What does the message/request appear to be doing?

### WHY IS IT SUSPICIOUS?

Explain the detected warning signs.

### WHAT SHOULD I DO?

Give clear, actionable next steps.

### WHAT SHOULD I NOT DO?

Explicitly identify dangerous actions.

### HOW CONFIDENT ARE WE?

AI detection is probabilistic.

Never present ScamLens as an infallible scam detector.

Use language such as:

- "This looks suspicious."
- "We found several warning signs."
- "We recommend..."
- "We can't confirm this is legitimate."

Avoid:

- "This is definitely safe."
- "This is definitely a scam."

unless the system has a genuinely deterministic basis for that conclusion.

---

# 4. BRAND

Product name:

SCAMLENS

Primary tagline:

"Before you click, check."

Supporting positioning:

"An AI safety check for suspicious messages, links, and online offers."

Brand personality:

- trustworthy
- intelligent
- protective
- calm
- accessible
- modern

Avoid fear-based branding.

ScamLens should feel like a helpful family safety tool, not an alarm system.

---

# 5. MVP USER JOURNEY

Landing Page
↓
Analyze Something
↓
Choose Input
↓
Submit
↓
Analysis Loading State
↓
Risk Result
↓
Warning Signs
↓
Simple Explanation
↓
Recommended Actions
↓
Optional "Explain It Simply"
↓
Optional "Read It Aloud"
↓
Optional "Ask Family Member"

The primary action must always remain obvious.

---

# 6. INPUT METHODS

Create an extensible input architecture supporting:

## A. Paste Message

Example:

"Congratulations! You have won GH₵5,000. Click here to claim..."

## B. Upload Screenshot

Support:

- PNG
- JPG
- WEBP

Prepare the architecture for OCR/image analysis.

## C. URL

Allow users to submit suspicious URLs.

Do not automatically visit arbitrary URLs from the frontend.

URL analysis must be isolated behind a secure server-side architecture.

## D. Describe a Call

Example:

"Someone called saying they were from my bank and asked for my OTP."

Create a simple text-based interface for this.

---

# 7. RISK RESULT MODEL

The backend must return structured analysis.

Example:

{
  "riskScore": 91,
  "riskLevel": "HIGH",
  "summary": "This message contains several warning signs commonly associated with scams.",
  "warningSigns": [
    {
      "type": "urgency",
      "severity": "high",
      "explanation": "The message pressures the recipient to act immediately."
    },
    {
      "type": "payment_request",
      "severity": "high",
      "explanation": "The sender appears to request money."
    }
  ],
  "recommendedActions": [
    "Do not click the link.",
    "Do not send money.",
    "Contact the organization through an official channel."
  ],
  "avoidActions": [
    "Do not share your PIN.",
    "Do not share your OTP.",
    "Do not provide passwords."
  ],
  "simpleExplanation": "This message looks suspicious. Don't click the link or send money. If you're unsure, contact the company directly using a trusted phone number.",
  "confidence": 0.91
}

Use a strict typed schema.

Do not allow arbitrary AI output to directly control the UI.

---

# 8. RISK CATEGORIES

Design the architecture to recognize categories including:

- phishing
- impersonation
- fake prizes
- fake job offers
- investment scams
- romance scams
- payment scams
- banking scams
- account takeover attempts
- credential harvesting
- fake customer support
- delivery scams
- government impersonation
- charity scams
- emergency scams
- blackmail/extortion attempts
- suspicious marketplace transactions
- malicious links
- social engineering
- advance-fee scams

The category system must be extensible.

---

# 9. RISK SCORE

Use a 0–100 score internally.

Suggested presentation:

0–24
LOW RISK

25–49
CAUTION

50–74
SUSPICIOUS

75–100
HIGH RISK

However, the score must not imply scientific certainty.

Always display the explanation alongside the score.

The UI should prioritize actionable recommendations over the numerical score.

---

# 10. "EXPLAIN IT SIMPLY"

This is a core ScamLens feature.

Technical AI output:

"The message demonstrates multiple social-engineering indicators."

Parent-friendly output:

"This message is trying to make you act quickly. Don't click the link or send money. If you're unsure, contact the company directly."

Create a reusable explanation transformation layer.

The system should support:

- technical explanation
- simple explanation
- child/family explanation
- voice-friendly explanation

---

# 11. VOICE ACCESSIBILITY

Prepare the application for text-to-speech.

Create a reusable component:

`<ReadAloudButton />`

The initial implementation may use browser-native speech synthesis if appropriate.

Requirements:

- clear play button
- pause
- stop
- accessible labels
- works on mobile browsers
- does not automatically speak without user interaction

---

# 12. FAMILY SAFETY MODEL

Prepare the architecture for:

## Trusted Family Member

A user can optionally designate another person as a trusted contact.

Example:

Parent:

"Is this safe?"

ScamLens:

"High risk. We recommend not continuing."

CTA:

[ASK MY FAMILY MEMBER]

Future workflow:

Parent
↓
ScamLens
↓
High-risk detection
↓
Trusted contact notified
↓
Family member reviews
↓
Family member responds

This must be designed as an OPTIONAL safety layer.

Do not make users dependent on another person to use ScamLens.

---

# 13. PRIVACY-FIRST ARCHITECTURE

ScamLens may process extremely sensitive information.

Design accordingly.

Never expose:

- passwords
- OTPs
- PINs
- financial credentials
- authentication tokens

in logs.

Do not unnecessarily persist submitted screenshots or messages.

Create a clear distinction between:

TEMPORARY ANALYSIS DATA

and

USER-REQUESTED SAVED HISTORY.

Prepare architecture for automatic deletion/retention policies.

Do not train models on user submissions by default.

Do not claim privacy guarantees that the actual infrastructure does not provide.

---

# 14. SECURITY REQUIREMENTS

Implement secure defaults.

Consider:

- input validation
- output validation
- rate limiting
- authentication boundaries
- CSRF protection where applicable
- XSS prevention
- secure headers
- URL validation
- SSRF protection
- file upload restrictions
- MIME validation
- file size limits
- malicious file prevention
- API key isolation
- server-side secret storage
- abuse prevention

NEVER expose AI API keys in client-side JavaScript.

NEVER place secrets inside VITE_ environment variables.

All privileged AI/API operations must occur server-side.

---

# 15. TECHNOLOGY FOUNDATION

Use a modern, maintainable web architecture.

Preferred:

- React
- Vite
- TypeScript
- Tailwind CSS
- accessible component system
- modern routing
- PWA support
- server/API layer appropriate to deployment
- structured environment configuration

Use strict TypeScript.

Avoid unnecessary dependencies.

Do not create an enormous dependency tree.

Prioritize:

- performance
- maintainability
- accessibility
- mobile-first design
- clean architecture

---

# 16. MOBILE-FIRST

The primary device is a phone.

Design for:

- Android Chrome
- iPhone Safari
- small screens
- touch interaction
- slow connections
- limited bandwidth

Minimum touch target:

44px.

Use:

- large readable text
- generous spacing
- simple navigation
- clear buttons
- minimal forms
- obvious states

Do not build desktop first and "make it responsive" later.

Build mobile-first.

---

# 17. PWA

Prepare ScamLens as a Progressive Web App.

Include:

- manifest
- icons
- installability
- appropriate theme metadata
- offline shell where useful
- service worker architecture
- mobile viewport configuration

Offline mode should NOT pretend to perform AI analysis when the network is unavailable.

Instead:

"You're offline. Reconnect to analyze this message."

---

# 18. DESIGN SYSTEM

Create a reusable design system before building individual screens.

Define:

- typography
- spacing
- buttons
- cards
- inputs
- badges
- alerts
- dialogs
- navigation
- loading states
- error states
- empty states
- risk indicators

Use a restrained visual language.

The UI should feel closer to:

"trusted digital safety product"

than:

"cybersecurity dashboard."

---

# 19. CORE ROUTES

Create the initial route architecture.

/
Landing page

/analyze
Main analysis interface

/analyze/message
Message analysis

/analyze/image
Screenshot analysis

/analyze/url
URL analysis

/result/:id
Analysis result

/history
Analysis history

/settings
User settings

/family
Trusted family contacts

/about
About ScamLens

/privacy
Privacy

/terms
Terms

/404
Custom 404 page

Keep routes modular.

Do not create unnecessary pages merely for the sake of SEO.

---

# 20. LANDING PAGE

Hero:

SCAMLENS

"Before you click, check."

Supporting copy:

"Use AI to check suspicious messages, links, screenshots, and online requests before you act."

Primary CTA:

[Check Something]

Secondary CTA:

[How It Works]

Sections:

1. Hero
2. How ScamLens Works
3. What You Can Check
4. Example Analysis
5. Parent-Friendly Safety
6. Trusted Family Member
7. Privacy
8. FAQ
9. Final CTA
10. Footer

---

# 21. ANALYSIS SCREEN

The main interface should immediately present choices:

"What would you like to check?"

Cards:

📱 Message

📷 Screenshot

🔗 Link

📞 Something someone told you

Then the relevant input interface.

Keep the interaction extremely simple.

---

# 22. RESULT SCREEN

Design this as the most important screen in the product.

Structure:

RISK ASSESSMENT

91 / 100

HIGH RISK

WHY WE'RE CONCERNED

Warning signs...

WHAT THIS MEANS

Simple explanation...

WHAT TO DO

✓ Do not click the link
✓ Do not send money
✓ Contact the organization directly

WHAT NOT TO SHARE

✕ PIN
✕ OTP
✕ Password
✕ Recovery codes

[Explain It Simply]

[Read Aloud]

[Ask Family Member]

Do not bury the recommended actions.

---

# 23. AI ARCHITECTURE

Create an AI service abstraction.

Example:

ai/
  scam-analysis/
    analyzer.ts
    schema.ts
    prompts.ts
    categories.ts
    validators.ts

Do not couple the entire application to one AI provider.

Create a provider abstraction.

Example:

interface AIProvider {
  analyzeScam(input: ScamAnalysisInput): Promise<ScamAnalysis>;
}

This allows providers to be swapped later.

---

# 24. PROMPT ENGINEERING

Create versioned prompts.

Example:

SCAMLENS_ANALYZER_V1

The AI must:

1. identify potential warning signs
2. distinguish evidence from assumptions
3. avoid inventing facts
4. identify uncertainty
5. produce structured output
6. provide practical recommendations
7. avoid unnecessary technical language
8. never request sensitive credentials
9. never claim certainty without evidence

Prompt versions must be stored separately from UI code.

---

# 25. FALSE POSITIVE / FALSE NEGATIVE UX

ScamLens must acknowledge uncertainty.

Allow:

"Not sure?"

Users can report:

[This looks wrong]

[This seems legitimate]

[I'm not sure]

Use this feedback architecture for future model improvement.

Do not automatically treat user feedback as ground truth.

---

# 26. ANALYSIS HISTORY

Prepare a history model.

Example:

Analysis {
  id
  userId
  type
  riskScore
  riskLevel
  category
  createdAt
  expiresAt
}

Default behavior should minimize retained sensitive content.

Prefer storing:

- metadata
- analysis result
- user-created labels

rather than permanently storing raw screenshots/messages unless explicitly requested.

---

# 27. BUSINESS MODEL

ScamLens must be designed as a scalable SaaS, not merely a one-off free tool.

Business model architecture:

## FREE

Limited monthly analyses.

Core scam checking.

Basic explanations.

Basic history.

Purpose:

Acquire users.

---

## SCAMLENS PLUS

Subscription.

Potential features:

- higher analysis limits
- screenshot analysis
- URL analysis
- expanded history
- advanced explanations
- family protection
- trusted contacts
- priority analysis
- personalized safety education

Do NOT hard-code pricing yet.

Create a configurable pricing system.

---

# 28. FAMILY PLAN

Future subscription model:

SCAMLENS FAMILY

One account can protect multiple family members.

Potential features:

- parent profiles
- trusted contacts
- shared alerts
- family dashboard
- safety reports
- configurable notifications

This is strategically important because the actual paying customer may be:

"The adult child who wants to protect their parents."

Do not assume the person using the product is necessarily the person paying.

---

# 29. B2B / B2B2C MODEL

Prepare for future partnerships.

Potential customers:

- banks
- telecom companies
- insurance companies
- schools
- churches/community organizations
- senior-care organizations
- employers
- financial-literacy programs
- cybersecurity companies

Potential model:

Organization subscription
↓
Employees/customers/members
↓
ScamLens access

Create the architecture so organizational accounts can be introduced later without rewriting the entire application.

Do NOT build the entire enterprise platform in V1.

Only create clean architectural boundaries.

---

# 30. WHITE-LABEL / API MODEL

Future monetization opportunity:

ScamLens Detection API.

Organizations could integrate:

"Check this message for scam indicators."

Potential customers:

- banks
- messaging platforms
- fintechs
- telecom companies
- security products

Prepare the codebase for API-first expansion.

Do not build the public API in the first foundation phase.

---

# 31. CUSTOMER SUCCESS / RETENTION MODEL

Do not rely only on subscriptions.

Build retention through useful recurring safety value.

Potential future features:

- monthly scam trend reports
- personalized safety tips
- family safety summaries
- emerging scam alerts
- educational micro-lessons
- "Scam of the Week"
- recurring digital safety checks

The goal is:

One-time scam check
↓
Repeated safety usage
↓
Family adoption
↓
Subscription
↓
Organization expansion

---

# 32. GROWTH LOOP

Design the product around:

User receives suspicious message
↓
Checks ScamLens
↓
Gets useful result
↓
Shares ScamLens with parent/friend/family
↓
New user
↓
Family account
↓
Subscription

Potential viral CTA:

"Send this check to someone who might need it."

Do not use manipulative sharing patterns.

---

# 33. SEO FOUNDATION

Implement proper technical SEO from the beginning.

Requirements:

- unique page titles
- unique meta descriptions
- canonical tags
- semantic HTML
- proper heading hierarchy
- unique primary heading per page
- descriptive alt text
- Open Graph metadata
- social share images
- Twitter/X card metadata where appropriate
- sitemap.xml
- robots.txt
- structured data
- internal links
- breadcrumbs where useful
- clean URLs
- proper page sources
- no placeholder text

Do not keyword-stuff.

SEO content should genuinely help users understand online scams.

---

# 34. STRUCTURED DATA

Use schema.org structured data where semantically appropriate.

Potential schemas:

- Organization
- WebSite
- WebPage
- FAQPage where appropriate
- SoftwareApplication if appropriate

DO NOT use LocalBusiness schema unless ScamLens actually represents a qualifying local business.

Never insert structured data simply because it appears in an SEO checklist.

---

# 35. llms.txt

Prepare an `/llms.txt` resource containing a concise, machine-readable overview of ScamLens.

Include:

- product purpose
- primary functionality
- supported inputs
- important limitations
- privacy principles
- relevant public documentation

Do not expose:

- secrets
- internal prompts
- private user data
- internal architecture secrets

---

# 36. TECHNICAL SEO / QUALITY CHECKLIST

Before declaring the foundation complete, verify:

[ ] No Vite/React placeholder branding remains
[ ] Production title exists
[ ] Every route has an appropriate title
[ ] Every important route has a meta description
[ ] Canonical tags exist
[ ] Proper page source structure
[ ] Semantic HTML
[ ] Unique headings
[ ] Unique page titles
[ ] Internal links work
[ ] Breadcrumbs exist where useful
[ ] Images have meaningful alt text
[ ] Favicon exists
[ ] Social share image exists
[ ] robots.txt exists
[ ] sitemap.xml exists
[ ] llms.txt exists
[ ] structured data is valid
[ ] custom 404 page exists
[ ] no placeholder content remains
[ ] no console errors
[ ] no broken links
[ ] no obvious accessibility violations
[ ] production source maps are handled appropriately
[ ] JavaScript bundles are kept reasonably small
[ ] unnecessary dependencies are removed
[ ] mobile performance is prioritized

---

# 37. PERFORMANCE

Optimize for mobile.

Avoid:

- huge JS bundles
- unnecessary libraries
- oversized images
- blocking scripts
- excessive animations
- unnecessary API calls

Use:

- lazy loading
- code splitting
- optimized assets
- efficient components
- caching where appropriate

Do not sacrifice usability simply to achieve an arbitrary Lighthouse score.

---

# 38. ERROR HANDLING

Every asynchronous operation must have:

- loading state
- success state
- error state
- retry state

Example:

AI analysis fails:

"Something went wrong while checking this. Please try again."

Do NOT expose stack traces to users.

Log technical details securely on the server.

---

# 39. ACCESSIBILITY

Target WCAG-conscious implementation.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- ARIA only when necessary
- sufficient contrast
- readable typography
- screen-reader-friendly controls
- meaningful labels
- accessible error messages
- large touch targets
- no color-only risk communication

Risk level must be communicated using:

- text
- icon
- visual indicator

not color alone.

---

# 40. ANALYTICS

Prepare privacy-conscious analytics.

Track product-level events such as:

- analysis_started
- analysis_completed
- analysis_failed
- result_viewed
- simple_explanation_used
- read_aloud_used
- family_request_started
- signup_completed
- subscription_started

Do not send raw scam messages or sensitive user content to analytics platforms.

---

# 41. ENVIRONMENT CONFIGURATION

Create:

.env.example

Document variables without exposing secrets.

Separate:

development
staging
production

Never commit:

.env

API keys

tokens

credentials

private certificates

---

# 42. PROJECT STRUCTURE

Use a clean scalable structure.

Example:

src/
  components/
  features/
    analysis/
    family/
    history/
    onboarding/
  pages/
  layouts/
  hooks/
  lib/
  services/
  types/
  config/
  styles/

server/
  api/
  services/
  ai/
    providers/
    prompts/
    schemas/
  security/
  validation/

public/
  icons/
  images/
  robots.txt
  sitemap.xml
  llms.txt

Adjust the exact structure if the chosen framework requires it, but preserve separation of concerns.

---

# 43. DEVELOPMENT PHASE 1

IMPORTANT:

For this task, build the FOUNDATION FIRST.

Do NOT attempt to build the entire finished product.

Phase 1 must establish:

1. project configuration
2. routing
3. design system
4. responsive layout
5. landing page
6. analysis page shell
7. result page shell
8. history page shell
9. settings page shell
10. family page shell
11. custom 404
12. PWA foundation
13. SEO foundation
14. structured data foundation
15. accessibility foundation
16. API/service abstraction
17. AI provider abstraction
18. typed scam-analysis schema
19. secure environment configuration
20. error/loading states
21. basic testing foundation
22. production build configuration

AI analysis can initially use a MOCK provider.

The mock provider must return realistic structured data.

This allows the frontend to be developed independently from the AI provider.

---

# 44. MOCK DATA

Create realistic mock scenarios.

Example scenarios:

1. Fake prize message
2. Fake bank message
3. Fake delivery message
4. Fake job offer
5. Suspicious investment offer
6. Fake family emergency
7. Suspicious account verification
8. Legitimate-looking message with low risk

Do not use real people's personal information.

---

# 45. TESTING

Create tests for:

- risk result schema validation
- risk-level calculation
- input validation
- URL validation
- component rendering
- critical user flows
- error states

At minimum verify:

Landing page
→ Analyze
→ Submit mock input
→ Result

works without errors.

---

# 46. CONSOLE / BUILD QUALITY

Before finishing:

Run:

- type checking
- linting
- tests
- production build

Fix ALL:

- TypeScript errors
- lint errors
- console errors
- broken imports
- broken links
- accessibility warnings
- failed builds

Do not leave warnings unresolved if they can reasonably be fixed.

---

# 47. NO PLACEHOLDERS

Do not leave:

"Lorem ipsum"

"Coming soon"

"Replace this later"

"Your Company"

"Vite + React"

"TODO"

unless the TODO is genuinely part of an intentional future architecture.

Use realistic product copy throughout the foundation.

---

# 48. DO NOT OVERENGINEER

This is a foundation.

Do NOT build:

- full enterprise administration
- complex billing system
- massive notification infrastructure
- proprietary AI model
- social network
- unnecessary microservices
- complex blockchain features
- unnecessary dashboards
- dozens of settings

Build clean boundaries that allow these capabilities later.

---

# 49. PRODUCT DESIGN TEST

After building the foundation, mentally test this scenario:

A 58-year-old parent receives:

"Your bank account will be blocked today. Verify your account immediately using this link."

They open ScamLens.

Can they understand what to do within 10 seconds?

If not, simplify the interface.

The product wins through clarity.

---

# 50. BUSINESS STRATEGY

Design ScamLens around the following business architecture:

FREE USER
↓
Repeated utility
↓
Family adoption
↓
SCAMLENS PLUS
↓
FAMILY PLAN
↓
B2B/B2B2C
↓
API / WHITE LABEL

The product should eventually have multiple revenue layers without compromising the core safety experience.

Do not introduce aggressive monetization inside a high-risk warning flow.

Safety comes first.

---

# 51. FINAL FOUNDATION DELIVERABLE

At completion provide:

1. project structure
2. technology decisions
3. installed dependencies
4. routes
5. components
6. design system
7. data models
8. AI abstraction
9. mock AI provider
10. SEO implementation
11. PWA implementation
12. security measures
13. accessibility measures
14. testing setup
15. environment variables
16. build commands
17. deployment instructions
18. remaining Phase 2 tasks

Do not simply tell me what should be built.

BUILD THE FOUNDATION.

---

# 52. PHASE 2 ROADMAP

After Phase 1 is successfully built, STOP.

Do not automatically continue into Phase 2.

Phase 2 will add:

- real AI provider
- screenshot/OCR analysis
- URL analysis
- persistent analysis history
- authentication
- trusted family members
- text-to-speech
- scam education
- subscription infrastructure
- analytics
- abuse prevention
- production monitoring

Phase 3 will add:

- family plans
- organization accounts
- B2B dashboard
- notifications
- ScamLens API
- white-label capabilities
- advanced scam intelligence

Wait for explicit approval before implementing these phases.

---

# FINAL INSTRUCTION

Think like a startup CTO, product architect, security engineer, and growth strategist simultaneously.

Build something that can start as a simple parent safety tool and evolve into a serious digital-safety SaaS.

Prioritize:

CLARITY
SECURITY
TRUST
ACCESSIBILITY
MOBILE UX
PERFORMANCE
SCALABILITY
RECURRING REVENUE
RETENTION
DEFENSIBILITY

Do not optimize for feature count.

Optimize for a product where one sentence explains the value:

> "My parent got a suspicious message, so they checked it with ScamLens before doing anything."

Now build the Phase 1 foundation.
