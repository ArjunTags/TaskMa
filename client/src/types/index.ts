export interface Card {
  id: number;
  title: string;
  description: string | null;
  position: number;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: number;
  title: string;
  position: number;
  cards: Card[];
  createdAt: string;
}
