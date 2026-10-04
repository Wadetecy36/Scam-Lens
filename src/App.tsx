import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { AnalyzePage } from "@/pages/AnalyzePage";
import { MessageAnalyzePage } from "@/pages/MessageAnalyzePage";
import { MomoAnalyzePage } from "@/pages/MomoAnalyzePage";
import { ImageAnalyzePage } from "@/pages/ImageAnalyzePage";
import { UrlAnalyzePage } from "@/pages/UrlAnalyzePage";
import { CallAnalyzePage } from "@/pages/CallAnalyzePage";
import { ResultPage } from "@/pages/ResultPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { FamilyPage } from "@/pages/FamilyPage";
import { AboutPage } from "@/pages/AboutPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { LearnPage } from "@/pages/LearnPage";
import { ContactPage } from "@/pages/ContactPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "analyze", element: <AnalyzePage /> },
      { path: "analyze/message", element: <MessageAnalyzePage /> },
      { path: "analyze/momo", element: <MomoAnalyzePage /> },
      { path: "analyze/image", element: <ImageAnalyzePage /> },
      { path: "analyze/url", element: <UrlAnalyzePage /> },
      { path: "analyze/call", element: <CallAnalyzePage /> },
      { path: "result/:id", element: <ResultPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "family", element: <FamilyPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "learn", element: <LearnPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
