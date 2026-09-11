import { useCallback, useEffect, useState } from "react";

function readAll(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAll(storageKey, items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(`sabo-collection-updated:${storageKey}`));
}

export function useCollectionStore(storageKey, seed) {
  const [items, setItems] = useState(() => readAll(storageKey) ?? seed);

  useEffect(() => {
    if (readAll(storageKey) === null) {
      writeAll(storageKey, seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    const eventName = `sabo-collection-updated:${storageKey}`;
    function syncFromStorage() {
      setItems(readAll(storageKey) ?? seed);
    }
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(eventName, syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(eventName, syncFromStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const addItem = useCallback(
    (newItem) => {
      const current = readAll(storageKey) ?? seed;
      const updated = [newItem, ...current];
      writeAll(storageKey, updated);
      setItems(updated);
    },
    [storageKey, seed]
  );

  const updateItem = useCallback(
    (id, patch) => {
      const current = readAll(storageKey) ?? seed;
      const updated = current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      );
      writeAll(storageKey, updated);
      setItems(updated);
    },
    [storageKey, seed]
  );

  const removeItem = useCallback(
    (id) => {
      const current = readAll(storageKey) ?? seed;
      const updated = current.filter((item) => item.id !== id);
      writeAll(storageKey, updated);
      setItems(updated);
    },
    [storageKey, seed]
  );

  return { items, addItem, updateItem, removeItem };
}