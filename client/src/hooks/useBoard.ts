import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { Column } from "../types";

export function useBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = useCallback(async () => {
    try {
      const data = await api.getColumns();
      setColumns(data);
    } catch {
      setError("Could not load board. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  const addCard = async (title: string, columnId: number) => {
    const card = await api.createCard(title, columnId);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
      )
    );
  };

  const moveCard = async (
    cardId: number,
    fromColumnId: number,
    toColumnId: number,
    newPosition: number
  ) => {
    // Optimistic update
    setColumns((prev) => {
      const fromCol = prev.find((c) => c.id === fromColumnId)!;
      const card = fromCol.cards.find((c) => c.id === cardId)!;
      const updatedCard = { ...card, columnId: toColumnId, position: newPosition };

      // Same column — reorder in place
      if (fromColumnId === toColumnId) {
        return prev.map((col) => {
          if (col.id !== fromColumnId) return col;
          const reordered = col.cards.filter((c) => c.id !== cardId);
          reordered.splice(newPosition, 0, updatedCard);
          return { ...col, cards: reordered.map((c, i) => ({ ...c, position: i })) };
        });
      }

      // Different column — remove from source, insert into destination
      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === toColumnId) {
          const newCards = [...col.cards];
          newCards.splice(newPosition, 0, updatedCard);
          return { ...col, cards: newCards.map((c, i) => ({ ...c, position: i })) };
        }
        return col;
      });
    });

    // Persist to server
    await api.updateCard(cardId, { columnId: toColumnId, position: newPosition });
  };

  const deleteCard = async (cardId: number, columnId: number) => {
    await api.deleteCard(cardId);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  const addColumn = async (title: string) => {
    const col = await api.createColumn(title);
    setColumns((prev) => [...prev, col]);
  };

  const deleteColumn = async (columnId: number) => {
    await api.deleteColumn(columnId);
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
  };

  const updateCardTitle = async (cardId: number, columnId: number, title: string) => {
    await api.updateCard(cardId, { title });
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId ? { ...c, title } : c
              ),
            }
          : col
      )
    );
  };

  return {
    columns,
    loading,
    error,
    addCard,
    moveCard,
    deleteCard,
    addColumn,
    deleteColumn,
    updateCardTitle,
  };
}