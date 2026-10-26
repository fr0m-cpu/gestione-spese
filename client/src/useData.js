import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

const REFRESH_MS = 30_000;

// Carica dati dall'API e li tiene aggiornati: dopo ogni modifica,
// quando torni sull'app e ogni 30 secondi (per i cambi fatti da altri dispositivi)
export function useData(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setData(await api(path));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [path]);

  useEffect(() => {
    load();
    const onVisible = () => document.visibilityState === 'visible' && load();
    const timer = setInterval(onVisible, REFRESH_MS);
    window.addEventListener('data-changed', load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      window.removeEventListener('data-changed', load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return { data, error, reload: load };
}
