import { useState, useEffect } from "react";

const BASE_URL = "https://muslim-academy.betamoneta.com/api";


export function useStaticPage(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();

    async function fetchPage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data ?? json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
    return () => controller.abort();
  }, [endpoint]);

  return { data, loading, error };
}
