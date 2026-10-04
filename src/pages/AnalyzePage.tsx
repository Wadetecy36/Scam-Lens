import { ArrowLeft, ArrowRight, Camera, Link2, MessageSquare, Phone, Smartphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { useDocumentHead } from "@/hooks/useDocumentHead";

interface OptionItem {
  to: string;
  icon: typeof Smartphone;
  title: string;
  body: string;
  iconBg: string;
  iconColor: string;
}

const INPUT_OPTIONS: OptionItem[] = [
  {
    to: "/analyze/momo",
    icon: Smartphone,
    title: "Mobile Money (MoMo) SMS",
    body: "Verify an MTN, Telecel, or AT transfer alert, fake reversal plea, or cash-out prompt.",
    iconBg: "bg-green-soft",
    iconColor: "text-green",
  },
  {
    to: "/analyze/message",
    icon: MessageSquare,
    title: "A message",
    body: "Paste a text, WhatsApp message, email, or social media DM.",
    iconBg: "bg-blue-icon-bg",
    iconColor: "text-blue",
  },
  {
    to: "/analyze/image",
    icon: Camera,
    title: "A screenshot",
    body: "Upload a photo or receipt of what was sent to you.",
    iconBg: "bg-purple-soft",
    iconColor: "text-purple",
  },
  {
    to: "/analyze/url",
    icon: Link2,
    title: "A link",
    body: "Paste an unfamiliar website or payment link before you open it.",
    iconBg: "bg-orange-soft",
    iconColor: "text-orange",
  },
  {
    to: "/analyze/call",
    icon: Phone,
    title: "Something someone told me",
    body: "Describe a phone call, voice note, or in-person story that felt suspicious.",
    iconBg: "bg-blue-light",
    iconColor: "text-navy-dark",
  },
];

export function AnalyzePage() {
  useDocumentHead({
    title: "Check something",
    description: "Check a suspicious message, MoMo transfer alert, screenshot, link, or phone call with ScamLens.",
    path: "/analyze",
  });

  return (
    <main className="container-page py-10 sm:py-14">
      {/* Back button */}
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </Link>

      {/* Hero: Two-column on desktop */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-navy">
            What did you <span className="text-blue">receive?</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground-soft">
            Pick what you are worried about. We will guide you step by step with plain-language advice to protect your money and identity.
          </p>
        </div>

        {/* Inline SVG Trust Illustration */}
        <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
          <svg
            className="w-full max-w-[340px] drop-shadow-sm"
            viewBox="0 0 320 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Background card / shield glow */}
            <rect x="20" y="30" width="280" height="160" rx="20" fill="#F8FAFC" stroke="#E5EAF2" strokeWidth="2" />
            <rect x="40" y="55" width="130" height="14" rx="7" fill="#E5EAF2" />
            <rect x="40" y="80" width="90" height="10" rx="5" fill="#EEF5FF" />
            
            {/* Verification lines */}
            <rect x="40" y="115" width="160" height="8" rx="4" fill="#F2F7FF" />
            <rect x="40" y="135" width="120" height="8" rx="4" fill="#F2F7FF" />

            {/* Shield and check badge */}
            <g transform="translate(195, 60)">
              <circle cx="45" cy="45" r="42" fill="#EEF5FF" stroke="#1463FF" strokeWidth="2" strokeDasharray="3 3" />
              <path
                d="M45 18L68 28V46C68 62 45 74 45 74C45 74 22 62 22 46V28L45 18Z"
                fill="#1463FF"
              />
              <path
                d="M37 45L43 51L54 39"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Small safe badge */}
            <g transform="translate(40, 155)">
              <rect width="110" height="24" rx="12" fill="#ECFAF4" />
              <circle cx="12" cy="12" r="5" fill="#11A66A" />
              <text x="24" y="16" fill="#11A66A" fontSize="11" fontWeight="600" fontFamily="sans-serif">Verified Safe</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 5 Input Option Cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {INPUT_OPTIONS.map(({ to, icon: Icon, title, body, iconBg, iconColor }) => (
          <Link key={to} to={to} className="group block focus:outline-none">
            <Card className="flex min-h-[104px] items-center gap-4 p-5 transition-all duration-200 group-hover:border-blue group-hover:shadow-md">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon aria-hidden="true" size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-navy group-hover:text-blue transition-colors">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-foreground-soft">
                  {body}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="shrink-0 text-secondary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue"
                size={20}
              />
            </Card>
          </Link>
        ))}
      </div>

      {/* Privacy note */}
      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-border bg-blue-light/50 p-4 text-sm text-foreground-soft">
        <ShieldCheck className="mt-0.5 shrink-0 text-blue" size={20} aria-hidden="true" />
        <p>
          <strong className="font-semibold text-navy">Keep private information out.</strong>{" "}
          Never enter a password, PIN, OTP, or recovery code. ScamLens will never ask for them.
        </p>
      </div>
    </main>
  );
}
