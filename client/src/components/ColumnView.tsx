import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { CardItem } from "./CardItem";
import type { Column } from "../types";

interface Props {
  column: Column;
  onAddCard: (title: string, columnId: number) => void;
  onDeleteCard: (cardId: number, columnId: number) => void;
  onUpdateCardTitle: (cardId: number, columnId: number, title: string) => void;
  onDeleteColumn: (columnId: number) => void;
}

export function ColumnView({
  column,
  onAddCard,
  onDeleteCard,
  onUpdateCardTitle,
  onDeleteColumn,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddCard(newTitle.trim(), column.id);
    setNewTitle("");
    setAdding(false);
  };

  return (
    <div className="flex-shrink-0 w-72 flex flex-col bg-board-surface rounded-xl border border-board-border">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-board-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-board-accent" />
          <h2 className="text-board-text font-semibold text-sm tracking-wide">
            {column.title}
          </h2>
          <span className="bg-board-card text-board-subtext text-xs font-mono px-1.5 py-0.5 rounded">
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-board-muted hover:text-red-400 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
          title="Delete column"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Cards drop zone */}
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[60px] transition-colors duration-150 rounded-b-xl ${
              snapshot.isDraggingOver ? "bg-board-accent/5" : ""
            }`}
          >
            {column.cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onDelete={(cardId) => onDeleteCard(cardId, column.id)}
                onUpdateTitle={(cardId, title) =>
                  onUpdateCardTitle(cardId, column.id, title)
                }
              />
            ))}
            {provided.placeholder}

            {/* Add card form */}
            {adding ? (
              <div className="mt-1">
                <textarea
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAdd();
                    }
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewTitle("");
                    }
                  }}
                  placeholder="Card title..."
                  rows={2}
                  className="w-full bg-board-card border border-board-accent/50 rounded-lg px-3 py-2 text-sm text-board-text placeholder-board-muted outline-none resize-none font-sans"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-board-accent hover:bg-board-accent-light text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setAdding(false); setNewTitle(""); }}
                    className="px-3 py-1.5 text-xs text-board-subtext hover:text-board-text transition-colors rounded-lg hover:bg-board-card"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-board-muted hover:text-board-subtext hover:bg-board-card rounded-lg transition-all text-sm group"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-medium">Add card</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
