"use client";

import { useState } from "react";

type Props = {
  defaultValue: string;
};

export function CurrentLocationField({ defaultValue }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleUseCurrentLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setMessage("Geolocalização não suportada neste navegador.");
      return;
    }

    setLoading(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const input = document.getElementById("ironfit-location-input") as HTMLInputElement | null;
        if (input) input.value = `${lat},${lng}`;
        setMessage("Localização atual preenchida. Agora é só gerar a rota.");
        setLoading(false);
      },
      () => {
        setMessage("Não consegui acessar sua localização atual.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Localização</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="ironfit-location-input"
          name="location"
          defaultValue={defaultValue}
          placeholder="Ex.: Ibirapuera, São Paulo"
          className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950"
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-60"
        >
          {loading ? "Localizando..." : "Usar localização atual"}
        </button>
      </div>
      {message ? <div className="mt-2 text-xs text-emerald-700">{message}</div> : null}
    </div>
  );
}
