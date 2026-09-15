import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/scholarships";

function toFrontend(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    coverage: row.coverage,
    level: row.level,
  };
}

function toApiPayload(item) {
  return {
    name: item.name,
    provider: item.provider,
    coverage: item.coverage,
    level: item.level,
  };
}

export function useScholarships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal mengambil data scholarships");
      const data = await res.json();
      setItems(data.map(toFrontend));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (item) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(item)),
    });
    if (!res.ok) throw new Error("Gagal menambah scholarship");
    const created = await res.json();
    setItems((prev) => [toFrontend(created), ...prev]);
  }, []);

  const updateItem = useCallback(async (id, patch) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(patch)),
    });
    if (!res.ok) throw new Error("Gagal mengubah scholarship");
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? toFrontend(updated) : i)));
  }, []);

  const removeItem = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error("Gagal menghapus scholarship");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, error, addItem, updateItem, removeItem };
}