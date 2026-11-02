import AppShell from "@/components/sites/aioenglish/app/AppShell";
import PronunciationHub from "@/components/sites/aioenglish/vocab/PronunciationHub";
export const metadata = { title: "Phát âm IPA · AIO English" };
export default function PronunciationPage() {
  return (
    <AppShell active="/tu-vung">
      <PronunciationHub />
    </AppShell>
  );
}
