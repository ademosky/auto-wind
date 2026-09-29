"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

const field =
  "w-full border border-gold-500/25 bg-brand-950/70 px-3.5 py-3 text-[14.5px] text-stone outline-none transition-colors placeholder:text-stone-2/30 hover:border-gold-500/40 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30";
const label = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-500";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Најавата не успеа.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Не успеавме да се поврземе. Пробај повторно.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col px-5 py-16 md:py-24">
      <div className="border border-gold-500/20 bg-brand-900/40 p-7 md:p-9">
        <span className="relative mx-auto block h-14 w-[236px] overflow-hidden">
          <Image src="/brand/auto-wind-logo.png" alt="AUTO WIND" fill sizes="236px" className="object-contain" />
        </span>

        <h1 className="mt-7 text-center font-display text-[26px] text-stone">Администрација</h1>
        <p className="mt-2 text-center text-[13.5px] text-stone-2/60">
          Најави се за да управуваш со возилата во понуда.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className={label} htmlFor="email">
              Е-пошта
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="password">
              Лозинка
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 bg-gold-500 px-6 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
            Најави се
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-[12.5px] text-stone-2/45">
        Пристапот е ограничен. Ако ја заборавиш лозинката, таа се менува во поставките на проектот.
      </p>
    </div>
  );
}


