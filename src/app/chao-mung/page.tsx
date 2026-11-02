import type { Metadata } from "next";
import OnboardingWizard from "@/components/sites/aioenglish/app2/OnboardingWizard";

export const metadata: Metadata = {
  title: "Chào mừng bạn đến với AIO English",
};

export default function ChaoMungPage() {
  return <OnboardingWizard />;
}
