# ScamLens Design Plan

Subject: an AI safety check a parent/older adult opens in a moment of low-grade
panic — "is this bank text real?" It needs to read as calm and procedural,
like a trusted checklist a nurse or pharmacist would hand you, not a security
product. Primary device: phone, one thumb, outdoors light.

## Avoiding the defaults
- NOT cream-bg + terracotta accent (Claude-tell).
- NOT near-black + neon accent (hacker terminal — explicitly banned by brief).
- NOT identical rounded SaaS cards with the same soft grey shadow everywhere.
- NOT ALL-CAPS eyebrows / em-dash labels / monospace data chips.
Instead: a single warm neutral paper tone, one deep ink-teal as the trust
color (not indigo-SaaS-blue, not navy-fintech), and a restrained 4-level risk
system that uses shape + icon + text, not just hue.

## Color (base palette)
- --paper:   #F6F3EC   (warm, slightly warmer than pure white — calm, paper-like, not the AI-cream since it leans more olive/warm-grey than pink-cream)
- --ink:     #1E2A28   (near-black with a green undertone — the "trust" dark, used for text & the wordmark, not pure #111)
- --pine:    #2F5D53   (deep teal-green — primary brand/action color: protective, calm, not corporate-blue)
- --pine-soft: #E4EEE9 (pale wash of pine, for cards/badges)
- --clay:    #C1652F   (warm burnt-orange — used ONLY for high-risk signal + one hero accent, sparingly)
- --sun:     #D9A441   (ochre — caution-level signal)
Risk ramp (each paired with icon+word, never color alone):
  LOW #3E7A5B (leaf) · CAUTION #D9A441 (eye) · SUSPICIOUS #C1652F (triangle) · HIGH #A63A2B (stop-hex)

## Type
- Display/headline: "Fraunces" (serif, warm, has real personality, humanist —
  reads trustworthy/editorial rather than techy). Used at large sizes only,
  set fairly tight.
- UI/body: "Inter" — but with generous size (18px base body on mobile) since
  audience skews older. No third face.
- No all-caps labels; sentence case eyebrows only when truly a label for a
  sequence (e.g. step 1/2/3 in the flow), set in Inter medium, real words.

## Layout
- Mobile-first single column, left-aligned text (not centered slabs — centered
  reads more "template landing page"). Generous 24px gutters, 44px+ touch
  targets, sections separated by breathing room + a single hairline rule, not
  cards-with-shadow everywhere.
- Landing hero: ASCII —
  [ScamLens mark]
  Before you click, check.        <- Fraunces, large, left-aligned
  one-line supporting copy
  [Check something ->] [How it works]
  below: a live-feeling mini "paste a message" preview card showing an actual
  example scam text with its risk pill — this IS the hero visual (real product
  moment, not a stock illustration or abstract gradient blob).
- Result screen is the hero screen of the whole app: risk pill (shape+icon+
  number+word) at top, then stacked plain-language sections separated by
  hairlines, actions as a real checklist (not chips), sticky "Explain simply /
  Read aloud / Ask family" bar at bottom on mobile.

## Principles
1. One page-load moment of motion max (the risk pill "settling" into place on
   the result screen); everything else is instant, no hover-fade parade.
2. Risk communicated by three channels always: label word, icon shape, and
   position on a horizontal ramp — never fill color alone.
3. Real scam-message copy throughout (Ghana-agnostic but plausible: prize/
   bank/delivery/job examples), never lorem ipsum.
4. One accent spent boldly: the clay/high-risk color and the Fraunces display
   type are the two "voices"; everything else is quiet ink-on-paper.
