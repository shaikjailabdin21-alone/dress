import { useEffect, useState } from 'react';

export function useLoad(loader, deps = [], preserveData = false) {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let active = true;
    let retryTimer = null;
    let attempts = 0;
    const maxAttempts = 3;

    const execute = () => {
      setState(previous => ({ loading: true, error: '', data: preserveData ? previous.data : null }));
      loader()
        .then(data => {
          if (active) setState({ loading: false, error: '', data });
        })
        .catch(error => {
          if (!active) return;
          const isTransient = error.isApiUnavailable || error.response?.status === 503 || error.code === 'ERR_NETWORK';
          if (isTransient && attempts < maxAttempts) {
            attempts += 1;
            retryTimer = setTimeout(execute, 1500);
            return;
          }
          setState(previous => ({
            loading: false,
            error: error.isApiUnavailable ? error.message : error.response?.data?.message || 'We could not connect to the collection. Please try again.',
            data: preserveData ? previous.data : null,
          }));
        });
    };

    execute();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, deps);

  return state;
}
