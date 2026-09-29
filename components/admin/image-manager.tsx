"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import type { VehicleImage } from "@/lib/types";

function sortImages(images: VehicleImage[]) {
  return [...images].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.created_at.localeCompare(b.created_at);
  });
}

export function ImageManager({
  vehicleId,
  images,
}: {
  vehicleId: string;
  images: VehicleImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const list = sortImages(images);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/images`, { method: "POST", body: form });
      const data = (await res.json()) as { uploaded?: unknown[]; errors?: string[] };
      if (!res.ok) {
        setError("Качувањето не успеа.");
        return;
      }
      const count = data.uploaded?.length ?? 0;
      setMessage(count ? `Додадени ${count} фотографии.` : "Ниту една фотографија не е додадена.");
      if (data.errors?.length) setError(data.errors.join(" · "));
      router.refresh();
    } catch {
      setError("Не успеавме да се поврземе. Пробај повторно.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError("Промената не успеа.");
        return;
      }
      if (body.coverId) setMessage("Главната фотографија е сменета.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const order = list.map((i) => i.id);
    [order[index], order[target]] = [order[target], order[index]];
    await patch({ order });
  };

  const removeImage = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 5000);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: id }),
      });
      if (!res.ok) {
        setError("Бришењето не успеа.");
        return;
      }
      setConfirmId(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="border border-gold-500/18 bg-brand-900/35 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-[20px] text-stone">Фотографии</h2>
        <span className="text-[12.5px] text-stone-2/55">
          {list.length} {list.length === 1 ? "фотографија" : "фотографии"}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mt-5 border border-dashed p-6 text-center transition-colors ${
          dragging ? "border-gold-500 bg-gold-500/10" : "border-gold-500/30"
        }`}
      >
        <UploadCloud className="mx-auto h-7 w-7 text-gold-500" aria-hidden="true" />
        <p className="mt-3 text-[14.5px] text-stone-2/75">
          Повлечи фотографии овде или избери ги рачно
        </p>
        <p className="mt-1 text-[12.5px] text-stone-2/45">JPG, PNG, WEBP или AVIF · максимум 10 MB</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="sr-only"
          onChange={(e) => void upload(e.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 bg-gold-500 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
          Избери фотографии
        </button>
      </div>

      {message ? <p className="mt-4 text-[13.5px] text-gold-300">{message}</p> : null}
      {error ? (
        <p role="alert" className="mt-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-200">
          {error}
        </p>
      ) : null}

      {list.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((img, i) => (
            <li key={img.id} className="border border-gold-500/18 bg-brand-950/50 p-3">
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-800">
                <Image src={img.url} alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
                {img.is_cover ? (
                  <span className="absolute left-2 top-2 bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-950">
                    Главна
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void patch({ coverId: img.id })}
                  disabled={busy || img.is_cover}
                  aria-label="Постави како главна фотографија"
                  className="inline-flex cursor-pointer items-center gap-1.5 border border-gold-500/35 px-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold-100 transition-colors hover:bg-gold-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  Главна
                </button>
                <button
                  type="button"
                  onClick={() => void move(i, -1)}
                  disabled={busy || i === 0}
                  aria-label="Помести налево"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => void move(i, 1)}
                  disabled={busy || i === list.length - 1}
                  aria-label="Помести надесно"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => void removeImage(img.id)}
                  disabled={busy}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-red-500/35 px-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-red-200 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {confirmId === img.id ? "Потврди" : "Избриши"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-[14px] text-stone-2/55">
          Сè уште нема фотографии. Првата качена фотографија автоматски станува главна.
        </p>
      )}
    </section>
  );
}


