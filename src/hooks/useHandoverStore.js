import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sabo_handover";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("sabo-handover-updated"));
}

export function useHandoverStore(seed) {
  const [items, setItems] = useState(() => readAll() ?? seed);

  useEffect(() => {
    if (readAll() === null) {
      writeAll(seed);
    }
  }, [seed]);

  useEffect(() => {
    function syncFromStorage() {
      setItems(readAll() ?? seed);
    }
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("sabo-handover-updated", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("sabo-handover-updated", syncFromStorage);
    };
  }, [seed]);

  const addHandover = useCallback(
    (newItem) => {
      const current = readAll() ?? seed;
      const updated = [newItem, ...current];
      writeAll(updated);
      setItems(updated);
    },
    [seed]
  );

  const updateStatus = useCallback(
    (id, status) => {
      const current = readAll() ?? seed;
      const updated = current.map((item) =>
        item.id === id ? { ...item, status } : item
      );
      writeAll(updated);
      setItems(updated);
    },
    [seed]
  );

  return { items, addHandover, updateStatus };
}