import type { Card, Column } from "../types";

const BASE = "/api";

export const api = {
  getColumns: async (): Promise<Column[]> => {
    const res = await fetch(`${BASE}/columns`);
    if (!res.ok) throw new Error("Failed to fetch columns");
    return res.json();
  },

  createColumn: async (title: string): Promise<Column> => {
    const res = await fetch(`${BASE}/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create column");
    return res.json();
  },

  updateColumn: async (id: number, title: string): Promise<Column> => {
    const res = await fetch(`${BASE}/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update column");
    return res.json();
  },

  deleteColumn: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/columns/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete column");
  },

  createCard: async (
    title: string,
    columnId: number,
    description?: string
  ): Promise<Card> => {
    const res = await fetch(`${BASE}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, columnId, description }),
    });
    if (!res.ok) throw new Error("Failed to create card");
    return res.json();
  },

  updateCard: async (
    id: number,
    data: Partial<Pick<Card, "title" | "description" | "columnId" | "position">>
  ): Promise<Card> => {
    const res = await fetch(`${BASE}/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update card");
    return res.json();
  },

  deleteCard: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/cards/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete card");
  },
};
