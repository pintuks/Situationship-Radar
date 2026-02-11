import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="space-y-3 pb-8 pt-2 text-center text-xs text-slate-600">
      <Separator className="bg-white/40" />
      <p>For fun + self-awareness only. Not legal, clinical, or relationship-professional advice.</p>
      <p>We don&apos;t permanently store your chat text. Communicate clearly, hydrate generously.</p>
      <p>Built by Maverick, built on TRAE.</p>
    </footer>
  );
}
