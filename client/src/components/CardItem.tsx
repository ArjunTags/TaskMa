import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Card } from "../types";

interface Props {
  card: Card;
  index: number;
  onDelete: (cardId: number) => void;
  onUpdateTitle: (cardId: number, title: string) => void;
}

export function CardItem({ card, index, onDelete, onUpdateTitle }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const handleBlur = () => {
    if (title.trim() && title !== card.title) {
      onUpdateTitle(card.id, title.trim());
    } else {
      setTitle(card.title);
    }
    setEditing(false);
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative rounded-lg px-3 py-2.5 mb-2 cursor-grab active:cursor-grabbing transition-all duration-150
            ${snapshot.isDragging
              ? "bg-board-accent shadow-lg shadow-board-accent/20 rotate-1 scale-105"
              : "bg-board-card border border-board-border hover:border-board-accent/50"
            }`}
        >
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBlur();
                if (e.key === "Escape") {
                  setTitle(card.title);
                  setEditing(false);
                }
              }}
              className="w-full bg-transparent text-board-text text-sm outline-none font-sans"
            />
          ) : (
            <p
              className="text-board-text text-sm font-medium leading-snug pr-5"
              onDoubleClick={() => setEditing(true)}
            >
              {card.title}
            </p>
          )}

          {card.description && !editing && (
            <p className="text-board-subtext text-xs mt-1 line-clamp-2">
              {card.description}
            </p>
          )}

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDelete(card.id)}
              className="text-board-muted hover:text-red-400 transition-colors p-0.5"
              title="Delete card"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-[10px] text-board-muted">
              #{card.id}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
