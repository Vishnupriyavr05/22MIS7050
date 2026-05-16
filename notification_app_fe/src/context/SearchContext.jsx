"use client";

import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");

  const value = useMemo(() => ({ search, setSearch }), [search]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}

export function matchesSearch(search, fields) {
  const q = search.trim().toLowerCase();
  if (!q) return true;

  return [fields.title, fields.message, fields.notification_type]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
}
