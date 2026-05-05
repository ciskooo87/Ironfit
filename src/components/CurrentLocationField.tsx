type Props = {
  defaultValue: string;
};

export function CurrentLocationField({ defaultValue }: Props) {
  const script = `(() => {
    const button = document.getElementById('ironfit-current-location-btn');
    const input = document.getElementById('ironfit-location-input');
    const message = document.getElementById('ironfit-current-location-message');
    if (!button || !input || !message || button.dataset.bound === '1') return;
    button.dataset.bound = '1';
    button.addEventListener('click', () => {
      if (!navigator.geolocation) {
        message.textContent = 'Geolocalização não suportada neste navegador.';
        return;
      }
      button.setAttribute('disabled', 'true');
      button.textContent = 'Localizando...';
      message.textContent = '';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          input.value = position.coords.latitude.toFixed(6) + ',' + position.coords.longitude.toFixed(6);
          message.textContent = 'Localização atual preenchida. Agora é só gerar a rota.';
          button.removeAttribute('disabled');
          button.textContent = 'Usar localização atual';
        },
        () => {
          message.textContent = 'Não consegui acessar sua localização atual.';
          button.removeAttribute('disabled');
          button.textContent = 'Usar localização atual';
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  })();`;

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
          id="ironfit-current-location-btn"
          type="button"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
        >
          Usar localização atual
        </button>
      </div>
      <div id="ironfit-current-location-message" className="mt-2 text-xs text-emerald-700"></div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}
