import { useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { ColumnView } from "./components/ColumnView";
import { useBoard } from "./hooks/useBoard";

export default function App() {
  const {
    columns,
    loading,
    error,
    addCard,
    moveCard,
    deleteCard,
    addColumn,
    deleteColumn,
    updateCardTitle,
  } = useBoard();

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const cardId = parseInt(draggableId);
    const fromColumnId = parseInt(source.droppableId);
    const toColumnId = parseInt(destination.droppableId);

    moveCard(cardId, fromColumnId, toColumnId, destination.index);
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    await addColumn(newColumnTitle.trim());
    setNewColumnTitle("");
    setAddingColumn(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-board-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-board-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-board-subtext text-sm font-mono">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-board-bg">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-board-text font-semibold mb-2">Connection failed</p>
          <p className="text-board-subtext text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-board-accent text-white rounded-lg text-sm hover:bg-board-accent-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-board-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-b border-board-border bg-board-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-board-accent rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-board-text font-bold text-base leading-none">TaskMa</h1>
            <p className="text-board-subtext text-xs mt-0.5 font-mono">
              {columns.reduce((acc, col) => acc + col.cards.length, 0)} tasks across {columns.length} columns
            </p>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-6 h-full items-start">
            {columns.map((column) => (
              <ColumnView
                key={column.id}
                column={column}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onUpdateCardTitle={updateCardTitle}
                onDeleteColumn={deleteColumn}
              />
            ))}

            {/* Add Column */}
            <div className="flex-shrink-0 w-72">
              {addingColumn ? (
                <div className="bg-board-surface border border-board-border rounded-xl p-3">
                  <input
                    autoFocus
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") {
                        setAddingColumn(false);
                        setNewColumnTitle("");
                      }
                    }}
                    placeholder="Column name..."
                    className="w-full bg-board-card border border-board-accent/50 rounded-lg px-3 py-2 text-sm text-board-text placeholder-board-muted outline-none font-sans mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 bg-board-accent hover:bg-board-accent-light text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Add column
                    </button>
                    <button
                      onClick={() => { setAddingColumn(false); setNewColumnTitle(""); }}
                      className="px-3 py-1.5 text-xs text-board-subtext hover:text-board-text rounded-lg hover:bg-board-card transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingColumn(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-board-surface/50 hover:bg-board-surface border border-dashed border-board-border hover:border-board-accent/50 rounded-xl text-board-muted hover:text-board-subtext transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">Add column</span>
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}
