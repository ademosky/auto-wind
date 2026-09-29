import { Phone } from "lucide-react";

function ViberMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2.2C6.9 2.2 3 5.8 3 10.3c0 2.4 1.2 4.6 3.2 6.1l-.5 3.9 4-2.1c.7.1 1.5.2 2.3.2 5.1 0 9-3.6 9-8.1S17.1 2.2 12 2.2Zm.1 12.6c-.7 0-1.4-.1-2-.3l-2.4 1.3.3-2.3c-1.4-1.1-2.3-2.7-2.3-4.4 0-3.1 2.9-5.6 6.4-5.6s6.4 2.5 6.4 5.6-2.8 5.7-6.4 5.7Z" />
      <path d="M9.7 7.5c.3-.1.7 0 .9.3l.7 1c.2.2.1.5 0 .7l-.3.5c-.1.2-.1.4 0 .6.4.6 1 1.2 1.6 1.6.2.1.4.1.6 0l.5-.3c.2-.1.5-.2.7 0l1 .7c.3.2.4.6.3.9-.2.6-.8 1-1.5 1.1-1.1.1-3.4-1-4.8-2.4-1.4-1.4-2.4-3.7-2.3-4.8.1-.7.5-1.2 1.1-1.4Z" />
    </svg>
  );
}

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 1.9a8.1 8.1 0 0 1 0 16.2 8 8 0 0 1-4.1-1.1l-.4-.2-2.5.7.7-2.4-.2-.4A8.1 8.1 0 0 1 12 3.9Zm-3 4c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2s.8 2.2.9 2.3c.1.2 1.6 2.6 4 3.5 1.9.8 2.3.6 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.5-.6c.1-.2.2-.3.1-.5l-.6-1.4c-.1-.3-.3-.4-.5-.4Z" />
    </svg>
  );
}

export function ContactButtons({
  phoneDisplay,
  phoneE164,
  viber,
  whatsapp,
  subject,
  compact = false,
}: {
  phoneDisplay?: string | null;
  phoneE164?: string | null;
  viber?: string | null;
  whatsapp?: string | null;
  subject?: string;
  compact?: boolean;
}) {
  const tel = phoneE164 ? `tel:${phoneE164.replace(/[^+0-9]/g, "")}` : null;
  const wa = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}${
        subject ? `?text=${encodeURIComponent(subject)}` : ""
      }`
    : null;
  const vb = viber ? `viber://chat?number=${encodeURIComponent(viber.replace(/[^+0-9]/g, ""))}` : null;

  const base =
    "inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99]";

  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
      {tel ? (
        <a href={tel} className={`${base} bg-gold-500 text-brand-950 hover:bg-gold-300`}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          {compact ? "Јави се" : phoneDisplay ?? "Јави се"}
        </a>
      ) : null}
      {vb ? (
        <a
          href={vb}
          className={`${base} border border-gold-500/40 text-gold-100 hover:border-gold-500 hover:bg-gold-500/10`}
        >
          <ViberMark className="h-4 w-4" />
          Viber
        </a>
      ) : null}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border border-gold-500/40 text-gold-100 hover:border-gold-500 hover:bg-gold-500/10`}
        >
          <WhatsAppMark className="h-4 w-4" />
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}

