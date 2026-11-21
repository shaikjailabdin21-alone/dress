import { useEffect, useState } from 'react';

export function useLoad(loader, deps = [], preserveData = false) {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  useEffect(() => { let active = true; setState(previous => ({ loading: true, error: '', data: preserveData ? previous.data : null })); loader().then(data => active && setState({ loading: false, error: '', data })).catch(error => active && setState(previous => ({ loading: false, error: error.response?.data?.message || 'We could not connect to the collection. Please try again.', data: preserveData ? previous.data : null }))); return () => { active = false; }; }, deps);
  return state;
}
