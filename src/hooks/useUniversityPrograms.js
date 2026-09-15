import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/university-programs";

function toFrontend(row) {
  return {
    id: row.id,
    university: row.university,
    country: row.country,
    program: row.program,
    degreeLevel: row.degree_level,
  };
}

function toApiPayload(item) {
  return {
    university: item.university,
    country: item.country,
    program: item.program,
    degree_level: item.degreeLevel,
  };
}

export function useUniversityPrograms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal mengambil data university programs");
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
    if (!res.ok) throw new Error("Gagal menambah university program");
    const created = await res.json();
    setItems((prev) => [toFrontend(created), ...prev]);
  }, []);

  const updateItem = useCallback(async (id, patch) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(patch)),
    });
    if (!res.ok) throw new Error("Gagal mengubah university program");
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? toFrontend(updated) : i)));
  }, []);

  const removeItem = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error("Gagal menghapus university program");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, error, addItem, updateItem, removeItem };
}